import {readJson,sameOrigin,RequestError} from '@/lib/http';
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { partnerSchema } from '@/lib/validation';
import { locations,rateLimit,savePartner } from '@/lib/store';
export async function POST(req:Request) {
 try {
  if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403});
  if(process.env.NODE_ENV==='production'&&process.env.PUBLIC_LAUNCH!=='true')return NextResponse.json({error:'NOT_LAUNCHED'},{status:503});
  const body=await readJson(req,12000);
  const parsed=partnerSchema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'VALIDATION',fields:parsed.error.flatten()},{status:400});
  const c=(await locations()).find(c=>c.slug===parsed.data.city);if(!c?.districts.some(d=>d.slug===parsed.data.district))return NextResponse.json({error:'DISTRICT'},{status:400});
  const key=createHash('sha256').update(parsed.data.email.toLowerCase()).digest('hex');
  if(!await rateLimit(key))return NextResponse.json({error:'RATE_LIMIT'},{status:429});
  const id=await savePartner(parsed.data);return NextResponse.json({id,status:'pending_review',local:process.env.NODE_ENV!=='production'&&!process.env.DATABASE_URL},{status:201});
 } catch(error) { if(error instanceof RequestError)return NextResponse.json({error:error.code},{status:error.status}); return NextResponse.json({error:'UNAVAILABLE'},{status:503}); }
}
