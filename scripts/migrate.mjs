import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { cities } from '../src/lib/locations.ts';
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL before running migrations.');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
try {await pool.query(await readFile('database/schema.sql','utf8'));const client=await pool.connect();try{await client.query('BEGIN');for(const [i,c] of cities.entries()){await client.query('INSERT INTO cities (slug,name_ar,name_en,landmark_ar,landmark_en,image,active,position) VALUES ($1,$2,$3,$4,$5,$6,true,$7) ON CONFLICT DO NOTHING',[c.slug,c.ar,c.en,c.landmarkAr,c.landmarkEn,c.image,i]);for(const d of c.districts)await client.query('INSERT INTO districts (city_slug,slug,name_ar,name_en) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING',[c.slug,d.slug,d.ar,d.en]);}await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}console.log('Schema and launch locations ready. No hotel or offer records were created.');}finally{await pool.end();}
