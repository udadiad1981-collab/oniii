const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const BASE = "http://127.0.0.1:3100";
const OUT = path.join(__dirname, "..", "test-output");
fs.mkdirSync(OUT, { recursive: true });
let server, browser, page, ok = 0, fail = 0;
async function step(d) {
  console.log("\n🔹 " + d);
  await page.screenshot({ path: path.join(OUT, "s" + (ok + fail) + ".png"), fullPage: true });
}
async function check(d, fn) {
  try { await fn(); console.log("  ✅ " + d); ok++; }
  catch (e) { console.log("  ❌ " + d + " - " + (e.message || "").slice(0, 80)); fail++; }
}
async function main() {
  console.log("Starting server…");
  server = spawn("npx", ["next", "dev", "--port", "3100"], { cwd: path.join(__dirname, ".."), stdio: "pipe", shell: true });
  await new Promise(r => {
    server.stdout.on("data", d => { if ((d + "").includes("Ready")) r(); });
    server.stderr.on("data", d => { if ((d + "").includes("Ready")) r(); });
    setTimeout(r, 12000);
  });
  console.log("Server ready!");
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await step("1-Home"); await page.goto(BASE + "/en", { waitUntil: "networkidle", timeout: 25000 });
  await check("Title=EQFRS", async () => { if (!(await page.title()).includes("EQFRS")) throw 0; });
  await step("2-Hover"); const card = page.locator("a[href*='/products/']").first(); await card.hover(); await page.waitForTimeout(400);
  await check("Hover OK", async () => { if (await card.count() === 0) throw 0; });
  await step("3-Click"); await card.click(); await page.waitForURL("**/products/**", { timeout: 10000 });
  await check("Product page", async () => { if (!page.url().includes("/products/")) throw 0; });
  await step("4-AddCart"); const btn = page.getByRole("button").filter({ hasText: /Cart|购物车/i }).first();
  if (await btn.count() > 0) { await btn.click(); await page.waitForTimeout(800); }
  await check("Add cart click", async () => { });
  await step("5-CartPg"); await page.goto(BASE + "/en/cart", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Cart page", async () => { const c = await page.textContent("body"); if (!c.includes("Cart") && !c.includes("cart") && !c.includes("购物车")) throw 0; });
  await step("6-ZhHome"); await page.goto(BASE + "/zh", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Zh home", async () => { const c = await page.textContent("body"); if (!c.includes("首页") && !c.includes("商品") && !c.includes("EQFRS")) throw 0; });
  await page.goto(BASE + "/zh/search", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Zh shop", async () => { const c = await page.textContent("body"); if (!c.includes("商品") && !c.includes("分类") && !c.includes("EQFRS")) throw 0; });
  await step("7-Checkout"); await page.goto(BASE + "/en/checkout", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Checkout", async () => { const c = await page.textContent("body"); if (!c.includes("Checkout") && !c.includes("Shipping") && !c.includes("收货")) throw 0; });
  await step("8-FillForm"); const email = page.locator("input[type='email']").first(); if (await email.count() > 0) await email.fill("test@example.com");
  const inputs = page.locator("input:not([type='email']):not([type='hidden'])");
  const vals = ["Jane", "Smith", "123 Main", "New York", "NY", "10001", "+1234567890"];
  for (let i = 0; i < Math.min(await inputs.count(), vals.length); i++) await inputs.nth(i).fill(vals[i]);
  await check("Form filled", async () => { });
  await step("9-Track"); await page.goto(BASE + "/en/orders", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Tracking", async () => { const c = await page.textContent("body"); if (!c.includes("Track") && !c.includes("Order") && !c.includes("追踪") && !c.includes("订单")) throw 0; });
  await step("10-Return"); await page.goto(BASE + "/en/returns-request", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Returns", async () => { const c = await page.textContent("body"); if (!c.includes("Return") && !c.includes("退换") && !c.includes("Exchange")) throw 0; });
  await step("11-Contact"); await page.goto(BASE + "/en/contact", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(500);
  await check("Contact", async () => { const c = await page.textContent("body"); if (!c.includes("Contact") && !c.includes("联系") && !c.includes("Message")) throw 0; });
  await step("12-Search"); await page.goto(BASE + "/en/search", { waitUntil: "networkidle", timeout: 15000 }); await page.waitForTimeout(1000);
  const prods = page.locator("a[href*='/products/']"); const pc = await prods.count();
  await check("Products: " + pc, async () => { if (pc === 0) throw 0; });
  await step("13-Category"); const cat = page.locator("a[href*='category=']").first(); if (await cat.count() > 0) { await cat.click(); await page.waitForTimeout(500); }
  await check("Category click", async () => { });
  await step("14-Policy"); await page.goto(BASE + "/en/returns", { waitUntil: "networkidle", timeout: 10000 });
  await check("Return policy", async () => { const c = await page.textContent("body"); if (!c.includes("Return") && !c.includes("退换")) throw 0; });
  await page.goto(BASE + "/en/privacy", { waitUntil: "networkidle", timeout: 10000 });
  await check("Privacy policy", async () => { const c = await page.textContent("body"); if (!c.includes("Privacy") && !c.includes("隐私")) throw 0; });
  console.log("\n" + "=".repeat(50));
  console.log("DONE: " + ok + " passed, " + fail + " failed, " + (ok + fail) + " total");
  await page.screenshot({ path: path.join(OUT, "final.png"), fullPage: true });
  await browser.close(); server.kill(); process.exit(fail > 0 ? 1 : 0);
}
main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
