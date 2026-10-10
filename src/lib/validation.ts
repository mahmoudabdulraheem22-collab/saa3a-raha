import { z } from 'zod';
const text = (max=160) => z.string().trim().min(1).max(max);
const phone = z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/);
export const partnerSchema = z.object({hotelName:text(),commercialName:text(),city:text(60),district:text(80),classification:z.enum(['unclassified','1','2','3','4','5']),contactName:text(),mobile:phone,whatsapp:phone,email:z.email().max(254),rooms:z.coerce.number().int().min(1).max(10000),shortStay:z.enum(['yes','no']),fullNight:z.enum(['yes','no']),message:z.string().trim().max(2000),consent:z.literal(true),website:z.string().max(0)}).refine(v=>v.shortStay==='yes'||v.fullNight==='yes',{message:'Choose at least one stay model',path:['shortStay']});
export const bookingSchema = z.object({offerId:z.uuid(),arrival:z.iso.datetime({offset:true}),guests:z.coerce.number().int().min(1).max(20),name:text(),email:z.email(),mobile:phone,consent:z.literal(true)}).refine(v=>new Date(v.arrival).getTime()>Date.now(),{message:'Arrival must be in the future',path:['arrival']});
export function riyadhToday() { return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
