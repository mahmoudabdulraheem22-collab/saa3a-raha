/** Public listing contracts: never add partner credentials or commercial terms here. */
export type Offer = {
 id:string; room_name_ar:string; room_name_en:string; duration:string; price:number;
 capacity:number; booking_mode:'request'|'instant'; valid_from:string; valid_until:string;
 arrival_from:string|null; arrival_until:string|null;
};
export type Hotel = {
 id:string; slug:string; name_ar:string; name_en:string; city_slug:string; district_slug:string;
 description_ar:string; description_en:string; photos:string[]; amenities:string[];
 classification:number|null; latitude:number|null; longitude:number|null;
 location_verified_at:string|null; distance_m:number|null; distance_verified_at:string|null;
 capacity:number; policies_ar:string; policies_en:string; sponsored:boolean; offers:Offer[];
};
