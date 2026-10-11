import {createHash} from 'node:crypto';
const intents=new Set(['pilot','home','partner','media','other']);
export const contactFields=['intent','source','name','company','role','email','phone','space','product','message','privacy'];
export function validateContactPayload(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).some(k=>!contactFields.includes(k)))throw new Error('invalid_fields');
 const result={};
 for(const key of contactFields.filter(x=>x!=='privacy')){
  const value=raw[key]??'';
  if(typeof value!=='string'||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))throw new Error('invalid_'+key);
  result[key]=value.trim();
  if(result[key].length>(key==='message'?8000:key==='email'?254:key==='source'?160:240))throw new Error('oversized_'+key);
  if(key!=='message'&&/[\r\n]/.test(result[key]))throw new Error('invalid_'+key);
 }
 if(!intents.has(result.intent))throw new Error('invalid_intent');
 if(!/^\/(?:zh-hk|en)\/contact$/.test(result.source))throw new Error('invalid_source');
 if(!result.name||!result.message)throw new Error('required_fields');
 if(!/^[^\s<>@]+@[^\s<>@]+\.[A-Za-z]{2,}$/.test(result.email))throw new Error('invalid_email');
 if(raw.privacy!==true)throw new Error('consent_required');
 result.privacy=true;
 return result;
}
export const contactDigest=payload=>createHash('sha256').update(JSON.stringify(payload)).digest('hex');
export function buildContactEnvelope(payload,{submissionId,receivedAt,origin}){
 return {schema_version:1,source:'website_contact',submission_id:submissionId,received_at:receivedAt,source_link:origin+payload.source,
  original:structuredClone(payload),contact:{name:payload.name,company:payload.company,email:payload.email,phone:payload.phone,claimed_role:payload.role,role_verified:false},
  customer_stated_message:payload.message,stated_space_or_district:payload.space,project_location:null,business_category:'pending',
  facts:[{field:'visitor_stated_message',value:payload.message,source:'submitted_form'},{field:'form_intent',value:payload.intent,source:'visitor_selection'}],
  inferred:[],needs_verification:['sender_identity','business_category','project_location','budget','quantity','timeline','decision_maker'],
  consent:{purpose:'respond_to_this_enquiry',accepted:true,received_at:receivedAt},owner:null,review_status:'pending_review',business_write_count:0,sent_count:0};
}
