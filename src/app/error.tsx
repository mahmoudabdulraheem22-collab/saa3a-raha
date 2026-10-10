'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container section gated"><h1>تعذر تحميل الصفحة</h1><p>Something went wrong. Please try again.</p><button className="button gold" onClick={reset}>حاول مجددًا · Try again</button></main>}
