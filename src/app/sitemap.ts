import type { MetadataRoute } from 'next';
import { locations } from '@/lib/store';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const cities=await locations();return ['', '/partners',...cities.flatMap(c=>['/'+c.slug,...c.districts.map(d=>'/'+c.slug+'/'+d.slug)])].map(p=>({url:base+p,alternates:{languages:{ar:base+p+'?lang=ar',en:base+p+'?lang=en'}}}));}
