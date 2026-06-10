# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-shopping-journey.spec.ts >> EQFRS Full Human Shopping Journey >> complete shopping flow with mouse clicks, hovers, and form fills
- Location: tests\e2e\full-shopping-journey.spec.ts:7:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en
Call log:
  - navigating to "http://localhost:3000/en", waiting until "networkidle"

```

# Test source

```ts
  1   | import { test, expect, chromium } from "@playwright/test";
  2   | import path from "path";
  3   | 
  4   | const BASE = "http://localhost:3000";
  5   | 
  6   | test.describe("EQFRS Full Human Shopping Journey", () => {
  7   |   test("complete shopping flow with mouse clicks, hovers, and form fills", async ({ page }) => {
  8   |     // =========================================================
  9   |     // 1. HOME PAGE - Browse, hover on product, verify content
  10  |     // =========================================================
  11  |     console.log("\n🔍 1. HOME PAGE TEST");
> 12  |     await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/en
  13  |     await page.screenshot({ path: "test-output/01-home-en.png", fullPage: true });
  14  |     console.log("   ✅ Home page loaded, screenshot saved");
  15  | 
  16  |     // Verify hero section
  17  |     await expect(page.locator("h1").first()).toContainText("Quality");
  18  |     console.log("   ✅ Hero title visible");
  19  | 
  20  |     // Hover on first product card
  21  |     const firstCard = page.locator("a[href*='/products/']").first();
  22  |     await firstCard.hover();
  23  |     await page.waitForTimeout(300);
  24  |     await page.screenshot({ path: "test-output/01b-hover-product.png" });
  25  |     console.log("   ✅ Product card hover effect works");
  26  | 
  27  |     // =========================================================
  28  |     // 2. LANGUAGE SWITCH - Click Chinese toggle
  29  |     // =========================================================
  30  |     console.log("\n🔍 2. LANGUAGE SWITCH TEST");
  31  |     // Find the language switch link (shows "中文" on English page)
  32  |     const langSwitch = page.getByText("中文").first();
  33  |     await langSwitch.click();
  34  |     await page.waitForURL("**/zh**");
  35  |     await page.waitForTimeout(500);
  36  | 
  37  |     // Verify Chinese content
  38  |     const zhTitle = page.locator("h1").first();
  39  |     await expect(zhTitle).toContainText("中国");
  40  |     await page.screenshot({ path: "test-output/02-zh-home.png", fullPage: true });
  41  |     console.log("   ✅ Switched to Chinese successfully");
  42  | 
  43  |     // Switch back to English
  44  |     const enSwitch = page.getByText("EN").first();
  45  |     await enSwitch.click();
  46  |     await page.waitForURL("**/en**");
  47  |     console.log("   ✅ Switched back to English");
  48  | 
  49  |     // =========================================================
  50  |     // 3. SEARCH / SHOP BROWSE
  51  |     // =========================================================
  52  |     console.log("\n🔍 3. SHOP BROWSE TEST");
  53  |     await page.goto(`${BASE}/en/search`, { waitUntil: "networkidle" });
  54  |     await page.screenshot({ path: "test-output/03-shop.png", fullPage: true });
  55  |     
  56  |     // Check products are visible
  57  |     const productCount = await page.locator("a[href*='/products/']").count();
  58  |     console.log(`   ✅ Found ${productCount} products in shop`);
  59  | 
  60  |     // =========================================================
  61  |     // 4. PRODUCT DETAIL PAGE
  62  |     // =========================================================
  63  |     console.log("\n🔍 4. PRODUCT DETAIL TEST");
  64  |     await page.goto(`${BASE}/en/search`, { waitUntil: "networkidle" });
  65  |     // Click first product
  66  |     const shopProduct = page.locator("a[href*='/products/']").first();
  67  |     await shopProduct.click();
  68  |     await page.waitForURL("**/products/**");
  69  |     await page.waitForTimeout(500);
  70  |     await page.screenshot({ path: "test-output/04-product-detail.png", fullPage: true });
  71  | 
  72  |     // Verify price is visible
  73  |     const price = page.locator("text=$").first();
  74  |     await expect(price).toBeVisible();
  75  |     console.log("   ✅ Product detail page loaded with price");
  76  | 
  77  |     // Try clicking "Add to Cart" if visible
  78  |     const addToCartBtn = page.getByRole("button", { name: /add to cart/i });
  79  |     if (await addToCartBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  80  |       await addToCartBtn.click();
  81  |       await page.waitForTimeout(500);
  82  |       await page.screenshot({ path: "test-output/04b-added-to-cart.png" });
  83  |       console.log("   ✅ Added product to cart");
  84  |     }
  85  | 
  86  |     // =========================================================
  87  |     // 5. CART PAGE
  88  |     // =========================================================
  89  |     console.log("\n🔍 5. CART PAGE TEST");
  90  |     await page.goto(`${BASE}/en/cart`, { waitUntil: "networkidle" });
  91  |     await page.screenshot({ path: "test-output/05-cart.png", fullPage: true });
  92  |     console.log("   ✅ Cart page loaded");
  93  | 
  94  |     // =========================================================
  95  |     // 6. CHECKOUT PAGE - Fill form
  96  |     // =========================================================
  97  |     console.log("\n🔍 6. CHECKOUT FORM FILL TEST");
  98  |     await page.goto(`${BASE}/en/checkout`, { waitUntil: "networkidle" });
  99  |     await page.waitForTimeout(500);
  100 | 
  101 |     // Fill shipping form
  102 |     try {
  103 |       await page.fill('input[placeholder*="First Name"]', "Jane");
  104 |       await page.fill('input[placeholder*="Last Name"]', "Smith");
  105 |       await page.fill('input[placeholder*="Email"]', "jane@test.com");
  106 |       await page.fill('input[placeholder*="Address"]', "456 Oak Ave");
  107 |       await page.fill('input[placeholder*="City"]', "Los Angeles");
  108 |       await page.fill('input[placeholder*="State"]', "CA");
  109 |       await page.fill('input[placeholder*="ZIP"]', "90001");
  110 |       await page.selectOption('select', "US");
  111 |       await page.screenshot({ path: "test-output/06-checkout-filled.png", fullPage: true });
  112 |       console.log("   ✅ Checkout form filled successfully");
```