export class RequestError extends Error { constructor(public code:string,public status:number){super(code);} }
/** Enforce limits while streaming; never buffer an unbounded request body. */
export async function readJson(req:Request,maxBytes:number):Promise<unknown>{
 if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new RequestError('CONTENT_TYPE',415);
 const reader=req.body?.getReader();if(!reader)throw new RequestError('VALIDATION',400);
 const chunks:Uint8Array[]=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>maxBytes){await reader.cancel();throw new RequestError('TOO_LARGE',413);}chunks.push(value);}}finally{reader.releaseLock();}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new RequestError('INVALID_JSON',400);}
}
export function sameOrigin(req:Request){
 const origin=req.headers.get('origin');
 // The configured deployment origin avoids relying on an untrusted forwarded host.
 return origin===(process.env.PUBLIC_LAUNCH==='true'&&process.env.NEXT_PUBLIC_SITE_URL?new URL(process.env.NEXT_PUBLIC_SITE_URL).origin:new URL(req.url).origin);
}
