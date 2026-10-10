import {withinArrivalWindow} from '@/lib/search';
import {readJson,sameOrigin,RequestError} from '@/lib/http';
import { NextResponse } from 'next/server';
import { randomUUID,createHash } from 'node:crypto';
import { bookingSchema } from '@/lib/validation';
import { pool,rateLimit } from '@/lib/store';
export async function POST(req:Request) {
 try {
  if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403});
  if(process.env.PUBLIC_LAUNCH!=='true')return NextResponse.json({error:'NOT_LAUNCHED'},{status:503});
  const body=await readJson(req,6000);
  const parsed=bookingSchema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'VALIDATION'},{status:400});
  const db=pool();if(!db)return NextResponse.json({error:'UNAVAILABLE'},{status:503});
  const p=parsed.data;
  if(!await rateLimit('booking:'+createHash('sha256').update(p.email.toLowerCase()).digest('hex')))return NextResponse.json({error:'RATE_LIMIT'},{status:429});
  const arrivalDay=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(p.arrival));
  const r=await db.query("SELECT o.*,r.capacity,r.hotel_id FROM offers o JOIN rooms r ON r.id=o.room_id JOIN hotels h ON h.id=r.hotel_id WHERE o.id=$1 AND o.active=true AND h.status='approved' AND h.photos_verified_at IS NOT NULL AND h.city_slug IN (SELECT slug FROM cities WHERE active=true) AND o.valid_from <= $2::date AND o.valid_until >= $2::date",[p.offerId,arrivalDay]);
  const offer=r.rows[0];const arrivalTime=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Riyadh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(p.arrival));if(!offer||p.guests>offer.capacity||!withinArrivalWindow(arrivalTime,offer.arrival_from,offer.arrival_until))return NextResponse.json({error:'OFFER_UNAVAILABLE'},{status:409});
  // Never downgrade instant booking to a fictional confirmation. An inventory adapter must hold inventory first.
  if(offer.booking_mode==='instant')return NextResponse.json({error:'LIVE_INVENTORY_NOT_CONNECTED'},{status:503});
  const id=randomUUID();await db.query("INSERT INTO booking_requests (id,offer_id,hotel_id,payload,quoted_price,status) VALUES ($1,$2,$3,$4,$5,'pending_hotel')",[id,p.offerId,offer.hotel_id,JSON.stringify(p),offer.price]);
  return NextResponse.json({id,status:'pending_hotel'},{status:201});
 } catch(error) { if(error instanceof RequestError)return NextResponse.json({error:error.code},{status:error.status});return NextResponse.json({error:'UNAVAILABLE'},{status:503});}
}
