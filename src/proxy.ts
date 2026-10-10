import { NextRequest, NextResponse } from 'next/server';
export function proxy(request:NextRequest){const requested=request.nextUrl.searchParams.get('lang');const language=requested==='ar'||requested==='en'?requested:request.cookies.get('language')?.value==='en'?'en':'ar';const headers=new Headers(request.headers);headers.set('x-site-language',language);return NextResponse.next({request:{headers}});}
export const config={matcher:['/((?!api|_next|images|icon.svg|robots.txt|sitemap.xml).*)']};
