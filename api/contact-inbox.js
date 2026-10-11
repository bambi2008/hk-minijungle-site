import {getInbox} from '../server/contact/runtime.mjs';
export function GET(request){return getInbox().read(request);}
