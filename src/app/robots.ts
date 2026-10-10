import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',...(process.env.PUBLIC_LAUNCH==='true'?{allow:'/',disallow:['/admin','/dashboard','/api/','/search']}:{disallow:'/'})},sitemap:(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')+'/sitemap.xml'};}
