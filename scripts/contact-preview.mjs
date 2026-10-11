import {createServer} from 'vite';
import {createWebsiteInbox} from '../server/contact/contact-redis.mjs';
const previewPort=Number(process.env.CONTACT_PREVIEW_PORT??5710);
const fixture=process.argv.includes('--fixture'),records=new Map();
const command=async c=>{
 if(c[0]!=='EVAL')throw Error('fixture_only');
 const [,script,n,inbox,rate,id,digest,data]=c,old=records.get(id);
 if(old)return old.digest===digest?'duplicate':'conflict';
 const record=JSON.parse(data);if(!record.envelope.original.email.endsWith('@example.org')||!record.envelope.original.message.includes('SYNTHETIC TEST ONLY'))throw Error('fictional_fixture_required');
 records.set(id,record);return 'created';
};
const inbox=createWebsiteInbox({env:fixture?{CONTACT_INTAKE_ENABLED:'true',CONTACT_REVIEW_TOKEN:'x'.repeat(32),CONTACT_RATE_SECRET:'r'.repeat(32),CONTACT_RETENTION_POLICY:'manual-review-required'}:{},command:fixture?command:undefined});
const server=await createServer({server:{host:'127.0.0.1',port:previewPort,strictPort:true},plugins:[{
 name:'local-contact-preview',
 transformIndexHtml(html){return html.replace('<body>', '<body><div style="background:#ffe8a5;color:#241f14;padding:10px;text-align:center;font:14px sans-serif">'+(fixture?'本機虛構測試：資料只留在記憶體，不投遞、不入CRM。 / SYNTHETIC LOCAL PREVIEW':'本機預覽：接收箱尚未配置。 / LOCAL PREVIEW — NOT CONNECTED')+'</div>');},
 configureServer(vite){vite.middlewares.use(async(req,res,next)=>{
  if(req.url!=='/api/contact')return next();
  if(req.headers.host!=='127.0.0.1:'+previewPort) {res.writeHead(403);res.end();return;}
  if(req.method!=='POST'){res.writeHead(405);res.end();return;}
  let body='';for await(const c of req){body+=c;if(Buffer.byteLength(body)>20000){res.writeHead(413);res.end();return;}}
  const request=new Request('https://hkminijungle.com/api/contact',{method:'POST',headers:{'Content-Type':req.headers['content-type']??'',origin:'https://hkminijungle.com','Idempotency-Key':req.headers['idempotency-key']??'','x-vercel-forwarded-for':'192.0.2.20'},body});
  const result=await inbox.accept(request);res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());
 });}
}]});
await server.listen();server.printUrls();
