import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Lenovo/Documents/Codex/2026-10-03/files-pasted-by-the-user-build/work/browsers/chromium-1243/chrome-win64/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto('http://127.0.0.1:3100',{waitUntil:'networkidle',timeout:90000});await page.screenshot({path:'../../work/initial-desktop.png',fullPage:true});console.log(JSON.stringify({status:response.status(),title:await page.title(),heading:await page.locator('h1').innerText(),errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));await browser.close();
