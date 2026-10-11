import {getInbox} from '../server/contact/runtime.mjs';
export function POST(request){return getInbox().accept(request);}
export function GET(){return Response.json({status:'method_not_allowed'},{status:405,headers:{'Cache-Control':'no-store'}});}
