import type { Hotel, Offer } from './types';
export function withinArrivalWindow(time:string,from:string|null,until:string|null){
 if(!time||!from||!until)return true;
 const t=time.slice(0,5),a=from.slice(0,5),b=until.slice(0,5);
 return a<=b?t>=a&&t<=b:t>=a||t<=b;
}
export type SearchFilters={city?:string;district?:string;date?:string;time?:string;duration?:string;guests?:string;price:number;distance:string;stars:string;room:string;amenities:string[]};
export function matchingOffers(hotel:Hotel,f:SearchFilters):Offer[]{
 return hotel.offers.filter(o=>o.price<=f.price&&o.capacity>=Number(f.guests||1)&&(!f.duration||o.duration===f.duration)&&(!f.date||(o.valid_from.slice(0,10)<=f.date&&o.valid_until.slice(0,10)>=f.date))&&withinArrivalWindow(f.time||'',o.arrival_from,o.arrival_until)&&(!f.room||(o.room_name_en+' '+o.room_name_ar).toLowerCase().includes(f.room.toLowerCase())));
}
export function filterHotels(hotels:Hotel[],f:SearchFilters){
 return hotels.filter(h=>(!f.city||h.city_slug===f.city)&&(!f.district||h.district_slug===f.district)&&(!f.stars||h.classification===Number(f.stars))&&(!f.distance||(h.distance_verified_at&&h.distance_m!==null&&h.distance_m<=Number(f.distance)))&&f.amenities.every(a=>h.amenities.includes(a))).map(h=>({...h,offers:matchingOffers(h,f)})).filter(h=>h.offers.length>0);
}
