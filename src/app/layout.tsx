import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
const tajawal=localFont({src:[{path:'../../public/fonts/tajawal-0.ttf',weight:'400'},{path:'../../public/fonts/tajawal-1.ttf',weight:'500'},{path:'../../public/fonts/tajawal-2.ttf',weight:'700'},{path:'../../public/fonts/tajawal-3.ttf',weight:'800'}],variable:'--font-raha',display:'swap'});
export const metadata:Metadata={title:{default:'ساعة راحة | Saa3a Raha — فنادق مكة والمدينة',template:'%s | ساعة راحة'},description:'نوصلك بالفندق المناسب للمدة التي تحتاجها. اكتشف خيارات الإقامة في مكة المكرمة والمدينة المنورة.',robots:process.env.PUBLIC_LAUNCH==='true'?{index:true,follow:true}:{index:false,follow:false}};
export default async function RootLayout({children}:{children:React.ReactNode}){const lang=(await headers()).get('x-site-language')==='en'?'en':'ar';return <html lang={lang} dir={lang==='ar'?'rtl':'ltr'}><body className={tajawal.variable}>{children}</body></html>;}
