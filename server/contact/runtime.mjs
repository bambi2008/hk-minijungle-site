import {createRedisCommand, createWebsiteInbox} from './contact-redis.mjs';
export function getInbox(){
 const env=process.env; let command;
 try{if(env.CONTACT_INTAKE_ENABLED==='true')command=createRedisCommand({url:env.UPSTASH_REDIS_REST_URL??env.KV_REST_API_URL,token:env.UPSTASH_REDIS_REST_TOKEN??env.KV_REST_API_TOKEN});}catch{/* Missing configuration fails closed. */}
 return createWebsiteInbox({env,command,logger:(code,details)=>console.error(code,details)});
}
