// Framework independent controller. Wire this into the site's actual React submit handler.
// The same form content keeps one request ID through repeated clicks and uncertain results.
export function createContactClient({request,makeId,notify,remember}){
 let current=null,busy=false;
 return {async submit(payload){
  if(busy)return {status:'processing'};
  busy=true;notify('loading');
  try{
   const signature=JSON.stringify(payload);
   if(!current||current.signature!==signature)current={signature,id:remember?await remember(signature,makeId):makeId()};
   const r=await request(payload,current.id);
   if(r?.body?.status==='received'&&[200,202].includes(r.status)){notify('received');return {status:'received',submission_id:current.id};}
   const state=r?.body?.status==='not_configured'?'unconfigured':r?.status===422?'invalid':r?.status===429?'verification_required':['processing','needs_operator_check'].includes(r?.body?.status)?'unknown':'error';
   notify(state);return {status:state,submission_id:current.id};
  }catch{notify('unknown');return {status:'unknown',submission_id:current?.id??null};}
  finally{busy=false;}
 },getCurrentId:()=>current?.id??null};
}
// Session storage contains only a digest, request ID and timestamp, never the form.
// Failing closed on unavailable storage avoids issuing a new ID after an uncertain
// result followed by a reload. The visitor can still use the email fallback.
export function createSessionIdentity({storage,cryptoImpl=crypto,clock=()=>Date.now(),key='website-contact:v1'}){
 return async(signature,makeId)=>{
  const hash=await cryptoImpl.subtle.digest('SHA-256',new TextEncoder().encode(signature));
  const digest=Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
  const target=typeof storage==='function'?storage():storage;
  const saved=target.getItem(key);let previous;try{previous=JSON.parse(saved??'null');}catch{previous=null;}
  const now=clock();
  if(previous?.digest===digest&&typeof previous.id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(previous.id)&&Number.isFinite(previous.saved_at)&&now-previous.saved_at>=0&&now-previous.saved_at<86400000)return previous.id;
  const id=makeId();target.setItem(key,JSON.stringify({digest,id,saved_at:now}));return id;
 };
}
export function contactPayloadFromForm(form){
 const f=new FormData(form);return Object.fromEntries(['intent','source','name','company','role','email','phone','space','product','message','privacy'].map(k=>[k,k==='privacy'?f.get(k)==='on':String(f.get(k)??'')]));
}
export function createContactRequest({endpoint='/api/contact',fetchImpl=fetch,timeoutMs=15000}={}){
 if(!endpoint.startsWith('/')||endpoint.startsWith('//')||endpoint.includes('?')||endpoint.includes('#'))throw new Error('same_origin_endpoint_required');
 return async(payload,key)=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{const r=await fetchImpl(endpoint,{method:'POST',credentials:'same-origin',redirect:'error',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify(payload),signal:controller.signal});return {status:r.status,body:await r.json()};}
  finally{clearTimeout(timer);}
 };
}
