import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://oniii.com/zh', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
// list all header buttons
const btns = await page.$$eval('header button', els => els.map(e => e.textContent.trim()));
console.log('Header buttons:', JSON.stringify(btns));
// click language dropdown button (the one with svg / short text), then click EN
const langBtn = await page.$('header button:has(svg)');
if (langBtn) { await langBtn.click(); await page.waitForTimeout(500); }
// find EN link in dropdown
const enLink = await page.$('a:has-text("English"), a:has-text("EN")');
if (enLink) {
  const href = await enLink.getAttribute('href');
  await enLink.click();
  await page.waitForTimeout(1500);
  console.log('Clicked EN, URL now:', page.url(), 'href was:', href);
} else {
  console.log('EN link not found in dropdown');
}
// verify nav text after switch
const nav = await page.$$eval('header nav a', els => els.map(e=>e.textContent.trim())).catch(()=>[]);
console.log('Nav after switch:', JSON.stringify(nav));
await browser.close();
