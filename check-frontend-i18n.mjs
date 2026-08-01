import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function getNav(localePath) {
  await page.goto(`https://oniii.com${localePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('header nav a', { timeout: 15000 }).catch(()=>{});
  await page.waitForTimeout(1000);
  const nav = await page.$$eval('header nav a', els => els.map(e => e.textContent.trim()));
  const banner = await page.$eval('header', el => el.textContent.includes('首頁') || el.textContent.includes('商城') ? 'zh-text-present' : 'en-or-other').catch(()=>'n/a');
  return { nav, banner };
}

const en = await getNav('/');
console.log('EN (/):', JSON.stringify(en));
const zh = await getNav('/zh');
console.log('ZH (/zh):', JSON.stringify(zh));
const es = await getNav('/es');
console.log('ES (/es):', JSON.stringify(es));

// Test switcher: on /zh click EN in language dropdown
await page.goto('https://oniii.com/zh', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
// hover language button then click EN
const switched = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('header button'));
  const langBtn = btns.find(b => /EN|中文|English|ZW/i.test(b.textContent) || b.textContent.trim().length <= 4);
  return langBtn ? langBtn.textContent.trim() : 'NO_BTN';
});
console.log('Lang button text on /zh:', switched);
await browser.close();
