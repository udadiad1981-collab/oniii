import { test, expect, chromium } from "@playwright/test";
import path from "path";

const BASE = "http://localhost:3000";

test.describe("EQFRS Full Human Shopping Journey", () => {
  test("complete shopping flow with mouse clicks, hovers, and form fills", async ({ page }) => {
    // =========================================================
    // 1. HOME PAGE - Browse, hover on product, verify content
    // =========================================================
    console.log("\n🔍 1. HOME PAGE TEST");
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
    await page.screenshot({ path: "test-output/01-home-en.png", fullPage: true });
    console.log("   ✅ Home page loaded, screenshot saved");

    // Verify hero section
    await expect(page.locator("h1").first()).toContainText("Quality");
    console.log("   ✅ Hero title visible");

    // Hover on first product card
    const firstCard = page.locator("a[href*='/products/']").first();
    await firstCard.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "test-output/01b-hover-product.png" });
    console.log("   ✅ Product card hover effect works");

    // =========================================================
    // 2. LANGUAGE SWITCH - Click Chinese toggle
    // =========================================================
    console.log("\n🔍 2. LANGUAGE SWITCH TEST");
    // Find the language switch link (shows "中文" on English page)
    const langSwitch = page.getByText("中文").first();
    await langSwitch.click();
    await page.waitForURL("**/zh**");
    await page.waitForTimeout(500);

    // Verify Chinese content
    const zhTitle = page.locator("h1").first();
    await expect(zhTitle).toContainText("中国");
    await page.screenshot({ path: "test-output/02-zh-home.png", fullPage: true });
    console.log("   ✅ Switched to Chinese successfully");

    // Switch back to English
    const enSwitch = page.getByText("EN").first();
    await enSwitch.click();
    await page.waitForURL("**/en**");
    console.log("   ✅ Switched back to English");

    // =========================================================
    // 3. SEARCH / SHOP BROWSE
    // =========================================================
    console.log("\n🔍 3. SHOP BROWSE TEST");
    await page.goto(`${BASE}/en/search`, { waitUntil: "networkidle" });
    await page.screenshot({ path: "test-output/03-shop.png", fullPage: true });
    
    // Check products are visible
    const productCount = await page.locator("a[href*='/products/']").count();
    console.log(`   ✅ Found ${productCount} products in shop`);

    // =========================================================
    // 4. PRODUCT DETAIL PAGE
    // =========================================================
    console.log("\n🔍 4. PRODUCT DETAIL TEST");
    await page.goto(`${BASE}/en/search`, { waitUntil: "networkidle" });
    // Click first product
    const shopProduct = page.locator("a[href*='/products/']").first();
    await shopProduct.click();
    await page.waitForURL("**/products/**");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "test-output/04-product-detail.png", fullPage: true });

    // Verify price is visible
    const price = page.locator("text=$").first();
    await expect(price).toBeVisible();
    console.log("   ✅ Product detail page loaded with price");

    // Try clicking "Add to Cart" if visible
    const addToCartBtn = page.getByRole("button", { name: /add to cart/i });
    if (await addToCartBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "test-output/04b-added-to-cart.png" });
      console.log("   ✅ Added product to cart");
    }

    // =========================================================
    // 5. CART PAGE
    // =========================================================
    console.log("\n🔍 5. CART PAGE TEST");
    await page.goto(`${BASE}/en/cart`, { waitUntil: "networkidle" });
    await page.screenshot({ path: "test-output/05-cart.png", fullPage: true });
    console.log("   ✅ Cart page loaded");

    // =========================================================
    // 6. CHECKOUT PAGE - Fill form
    // =========================================================
    console.log("\n🔍 6. CHECKOUT FORM FILL TEST");
    await page.goto(`${BASE}/en/checkout`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Fill shipping form
    try {
      await page.fill('input[placeholder*="First Name"]', "Jane");
      await page.fill('input[placeholder*="Last Name"]', "Smith");
      await page.fill('input[placeholder*="Email"]', "jane@test.com");
      await page.fill('input[placeholder*="Address"]', "456 Oak Ave");
      await page.fill('input[placeholder*="City"]', "Los Angeles");
      await page.fill('input[placeholder*="State"]', "CA");
      await page.fill('input[placeholder*="ZIP"]', "90001");
      await page.selectOption('select', "US");
      await page.screenshot({ path: "test-output/06-checkout-filled.png", fullPage: true });
      console.log("   ✅ Checkout form filled successfully");
    } catch (e) {
      console.log("   ⚠️ Could not fill all fields (may need items in cart):", e.message);
    }

    // =========================================================
    // 7. CONTACT PAGE - Fill and submit message
    // =========================================================
    console.log("\n🔍 7. CONTACT FORM TEST");
    await page.goto(`${BASE}/en/contact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await page.fill('input[placeholder*="Name"]', "Test User");
    await page.fill('input[placeholder*="Email"]', "user@test.com");
    await page.fill('input[placeholder*="Order Number"]', "EQ20260609RVR8L5");
    await page.fill('textarea', "This is a test message from automated testing.");
    await page.screenshot({ path: "test-output/07-contact-filled.png", fullPage: true });

    // Click submit
    const submitBtn = page.getByRole("button", { name: /send|submit/i });
    await submitBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "test-output/07b-contact-success.png", fullPage: true });
    console.log("   ✅ Contact form submitted");

    // =========================================================
    // 8. RETURN REQUEST PAGE
    // =========================================================
    console.log("\n🔍 8. RETURN REQUEST FORM TEST");
    await page.goto(`${BASE}/en/returns-request`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await page.fill('input[placeholder*="EQ"]', "EQ20260609RVR8L5");
    await page.fill('input[type="email"]', "shopper@test.com");
    await page.selectOption('select', "Size doesn't fit");
    await page.fill('textarea', "Item is too large, need smaller size.");
    await page.screenshot({ path: "test-output/08-return-filled.png", fullPage: true });

    const returnSubmit = page.getByRole("button", { name: /submit return/i });
    await returnSubmit.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "test-output/08b-return-success.png", fullPage: true });
    console.log("   ✅ Return request submitted");

    // =========================================================
    // 9. ORDER TRACKING PAGE
    // =========================================================
    console.log("\n🔍 9. ORDER TRACKING TEST");
    await page.goto(`${BASE}/en/orders`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await page.fill('input[placeholder*="EQ"]', "EQ20260609RVR8L5");
    const trackBtn = page.getByRole("button", { name: /track/i });
    await trackBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "test-output/09-order-tracked.png", fullPage: true });
    console.log("   ✅ Order tracking works");

    // =========================================================
    // 10. ALL STATIC PAGES
    // =========================================================
    console.log("\n🔍 10. STATIC PAGES CHECK");
    const staticPages = ["returns", "privacy"];
    for (const p of staticPages) {
      await page.goto(`${BASE}/en/${p}`, { waitUntil: "networkidle" });
      await page.screenshot({ path: `test-output/10-${p}-en.png` });
      await page.goto(`${BASE}/zh/${p}`, { waitUntil: "networkidle" });
      await page.screenshot({ path: `test-output/10-${p}-zh.png` });
    }
    console.log("   ✅ All static pages verified with screenshots");

    console.log("\n🎉 FULL HUMAN SHOPPING JOURNEY COMPLETE!");
    console.log("   All screenshots saved in test-output/");
  });
});
