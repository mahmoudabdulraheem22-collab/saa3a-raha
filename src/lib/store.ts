import 'server-only';
import { Pool } from 'pg';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { cities, type City } from './locations';

const globalDb = globalThis as unknown as { pool?: Pool; local?: DatabaseSync };
export function pool() { const url=process.env.DATABASE_URL??''; if (!url.startsWith('postgres')) return null; return globalDb.pool ??= new Pool({connectionString:url,max:5}); }
function local() {
 if(process.env.NODE_ENV==='production') throw new Error('DATABASE_REQUIRED');
 if(!globalDb.local) { mkdirSync(path.join(process.cwd(),'.data'),{recursive:true}); globalDb.local=new DatabaseSync(path.join(process.cwd(),'.data','development.sqlite')); globalDb.local.exec('CREATE TABLE IF NOT EXISTS partner_applications (id TEXT PRIMARY KEY, payload TEXT NOT NULL, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)'); }
 return globalDb.local;
}
export async function locations():Promise<City[]> {
 const db=pool(); if(!db) return cities;
 const result=await db.query('SELECT slug, name_ar, name_en, landmark_ar, landmark_en, image FROM cities WHERE active = true ORDER BY position');
 const d=await db.query('SELECT city_slug, slug, name_ar, name_en FROM districts WHERE active = true ORDER BY name_en');
 return result.rows.map(c=>({slug:c.slug,ar:c.name_ar,en:c.name_en,landmarkAr:c.landmark_ar,landmarkEn:c.landmark_en,image:c.image,districts:d.rows.filter(x=>x.city_slug===c.slug).map(x=>({slug:x.slug,ar:x.name_ar,en:x.name_en}))}));
}
export async function savePartner(payload:unknown) { const id=randomUUID(); const db=pool(); if(db) await db.query('INSERT INTO partner_applications (id,payload) VALUES ($1,$2)',[id,JSON.stringify(payload)]); else local().prepare('INSERT INTO partner_applications VALUES (?,?,?)').run(id,JSON.stringify(payload),new Date().toISOString()); return id; }
export async function rateLimit(key:string) {
 const now=Date.now(), expires=now+3600000, db=pool();
 if(db) { const r=await db.query('INSERT INTO rate_limits (key,count,expires) VALUES ($1,1,$2) ON CONFLICT (key) DO UPDATE SET count=CASE WHEN rate_limits.expires < $3 THEN 1 ELSE rate_limits.count+1 END, expires=CASE WHEN rate_limits.expires < $3 THEN $2 ELSE rate_limits.expires END RETURNING count',[key,expires,now]);return r.rows[0].count<=8; }
 const s=local();s.prepare('DELETE FROM rate_limits WHERE expires < ?').run(now); const r=s.prepare('INSERT INTO rate_limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').get(key,expires) as {count:number};return r.count<=8;
}
export type { Hotel, Offer } from './types';
import type { Hotel } from './types';
export async function hotels():Promise<Hotel[]> {
 const db=pool(); if(!db)return [];
 const h=await db.query("SELECT id,slug,name_ar,name_en,city_slug,district_slug,description_ar,description_en,photos,amenities,classification,latitude,longitude,location_verified_at,distance_m,distance_verified_at,capacity,policies_ar,policies_en,sponsored FROM hotels WHERE status='approved' AND photos_verified_at IS NOT NULL AND city_slug IN (SELECT slug FROM cities WHERE active=true)");
 const o=await db.query("SELECT o.id,o.duration,o.price,o.booking_mode,o.valid_from::text,o.valid_until::text,o.arrival_from::text,o.arrival_until::text,r.name_ar AS room_name_ar,r.name_en AS room_name_en,r.capacity,r.hotel_id FROM offers o JOIN rooms r ON r.id=o.room_id WHERE o.active=true AND o.valid_until >= CURRENT_DATE");
 return h.rows.map(row=>({...row,offers:o.rows.filter(x=>x.hotel_id===row.id).map(x=>({...x,price:Number(x.price)}))}));
}
