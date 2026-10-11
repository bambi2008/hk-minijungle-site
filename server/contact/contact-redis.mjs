import {createHmac, timingSafeEqual} from 'node:crypto';
import {isIP} from 'node:net';
import {validateContactPayload, contactDigest, buildContactEnvelope} from './contact-contract.mjs';

export const INBOX_KEY='website-contact:v1:inbox';
// One hash stores both the immutable visitor record and its digest. There is no
// outbound delivery, so a timeout can be resolved by repeating the same ID.
export const ACCEPT_SCRIPT=`
local old=redis.call('HGET',KEYS[1],ARGV[1])
if old then
  if cjson.decode(old).digest==ARGV[2] then return 'duplicate' end
  return 'conflict'
end
if redis.call('HLEN',KEYS[1])>=5000 then return 'capacity' end
local count=redis.call('INCR',KEYS[2])
if count==1 then redis.call('EXPIRE',KEYS[2],300) end
if count>5 then return 'rate_limited' end
redis.call('HSET',KEYS[1],ARGV[1],ARGV[3])
return 'created'`;

export function createRedisCommand({url,token,fetchImpl=fetch}){
 const u=new URL(url);
 if(u.protocol!=='https:'||!u.hostname.endsWith('.upstash.io')||u.username||u.password||u.search||u.hash||!['','/'].includes(u.pathname))throw Error('invalid_store_url');
 if(!token)throw Error('store_token_required');
 return async command=>{
  const r=await fetchImpl(u.origin,{method:'POST',redirect:'error',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(8000)});
  if(!r.ok)throw Error('store_unavailable');
  const body=await r.json();
  if(body.error||!Object.hasOwn(body,'result'))throw Error('store_unavailable');
  return body.result;
 };
}
const reply=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function readJSON(request){
 const reader=request.body?.getReader();if(!reader)throw Error('invalid_json');
 const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>20000){await reader.cancel();throw Error('too_large');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const data=new Uint8Array(size);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.byteLength;}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(data));
}
export function createWebsiteInbox({env={},command,clock=()=>new Date().toISOString(),logger=()=>{}}={}){
 const testOnly=env.CONTACT_TEST_ONLY==='true';
 const previewSafe=env.VERCEL_ENV!=='preview'||testOnly;
 const ready=previewSafe&&env.CONTACT_INTAKE_ENABLED==='true'&&env.CONTACT_REVIEW_TOKEN?.length>=32&&env.CONTACT_RATE_SECRET?.length>=32&&env.CONTACT_RETENTION_POLICY==='manual-review-required';
 const origins=new Set(['https://hkminijungle.com','https://www.hkminijungle.com']);
 // Preview is separately enabled and never shares the production inbox.
 if(env.VERCEL_ENV==='preview'&&env.VERCEL_URL)origins.add('https://'+env.VERCEL_URL);
 const inbox=env.VERCEL_ENV==='preview'?INBOX_KEY+':preview':INBOX_KEY;
 return {
 async accept(request){
  if(request.method!=='POST')return reply(405,{status:'method_not_allowed'});
  if(!ready||!command)return reply(503,{status:'not_configured'});
  const origin=request.headers.get('origin');
  if(!origins.has(origin)||new URL(request.url).origin!==origin)return reply(403,{status:'forbidden'});
  if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json')return reply(400,{status:'invalid_request'});
  const id=request.headers.get('idempotency-key');if(!uuid.test(id??''))return reply(400,{status:'invalid_request'});
  const ip=request.headers.get('x-vercel-forwarded-for')?.trim();
  if(!isIP(ip??''))return reply(503,{status:'not_configured'});
  let payload;
  try{payload=validateContactPayload(await readJSON(request));}catch(e){return reply(e.message==='too_large'?413:422,{status:'invalid_request'});}
  if(testOnly&&(!/^[^@]+@example\.org$/i.test(payload.email)||!payload.message.includes('SYNTHETIC TEST ONLY')))return reply(422,{status:'synthetic_test_required'});
  const digest=contactDigest(payload),envelope=buildContactEnvelope(payload,{submissionId:id,receivedAt:clock(),origin});
  const rateKey=inbox+':rate:'+createHmac('sha256',env.CONTACT_RATE_SECRET).update(ip).digest('hex');
  try{
   const result=await command(['EVAL',ACCEPT_SCRIPT,2,inbox,rateKey,id,digest,JSON.stringify({digest,envelope})]);
   if(result==='created'||result==='duplicate')return reply(result==='created'?202:200,{status:'received',submission_id:id});
   if(result==='conflict')return reply(409,{status:'conflict'});
   if(result==='rate_limited')return reply(429,{status:'rate_limited'});
   if(result==='capacity')return reply(503,{status:'capacity_reached'});
   throw Error('invalid_store_result');
  }catch{logger('contact_store_result_unknown',{submission_id:id});return reply(503,{status:'needs_operator_check',submission_id:id});}
 },
 async read(request){
  if(!ready||!command)return reply(503,{status:'not_configured'});
  const provided=request.headers.get('authorization')??'',expected='Bearer '+env.CONTACT_REVIEW_TOKEN;
  if(Buffer.byteLength(provided)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(provided),Buffer.from(expected)))return reply(401,{status:'unauthorized'});
  if(request.method!=='GET')return reply(405,{status:'method_not_allowed'});
  const url=new URL(request.url),id=url.searchParams.get('id'),cursor=url.searchParams.get('cursor')??'0';
  if([...url.searchParams.keys()].some(k=>!['id','cursor'].includes(k))||id&&!uuid.test(id)||!/^[0-9]{1,20}$/.test(cursor))return reply(400,{status:'invalid_request'});
  try{
   if(id){const record=await command(['HGET',inbox,id]);return record?reply(200,{status:'received',record:JSON.parse(record).envelope}):reply(404,{status:'not_found'});}
   // COUNT is a hint; pages are clamped before returning to the consumer.
   // HSCAN can repeat records during mutation; consumers must deduplicate by ID.
   const result=await command(['HSCAN',inbox,cursor,'COUNT',10]);
   if(!Array.isArray(result)||result.length!==2||!Array.isArray(result[1])||result[1].length>200)throw Error('invalid_store_result');
   const records=[];for(let i=1;i<result[1].length;i+=2)records.push(JSON.parse(result[1][i]).envelope);
   return reply(200,{status:'inbox_page',cursor:String(result[0]),records,crm_write_count:0,sent_count:0});
  }catch{logger('contact_inbox_read_failed',{});return reply(503,{status:'unavailable'});}
 }
 };
}
