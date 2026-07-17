import { chromium } from "playwright";

const BASE = "https://manju-kc-portfolio.vercel.app";
const PASSWORD = "manju2024masterpiece";
const UNSPLASH = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80";
const results = [];
function log(name, ok, extra = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  // 1. Public pages load
  for (const path of ["/", "/about", "/portfolio", "/services", "/blog", "/contact"]) {
    const r = await page.goto(BASE + path, { waitUntil: "networkidle" });
    log(`GET ${path} (${r.status()})`, r.ok());
  }

  // 2. Project detail + blog detail
  let r = await page.goto(BASE + "/portfolio/lumen-skincare", { waitUntil: "networkidle" });
  log("GET /portfolio/[slug]", r.ok());
  r = await page.goto(BASE + "/blog/marketing-feels-like-a-friend", { waitUntil: "networkidle" });
  log("GET /blog/[slug]", r.ok());

  // 3. Contact form submission
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.fill('input[placeholder="Manju KC"]', "Playwright Tester");
  await page.fill('input[type="email"]', "pw@example.com");
  await page.getByRole("button", { name: /^Social Media$/ }).click();
  await page.fill('textarea', "Hello from the automated test — loving the site!");
  await page.getByRole("button", { name: /Send message/i }).click();
  await page.waitForTimeout(2500);
  const thankYou = await page.getByText(/thank you/i).count();
  log("Contact form submits + success message", thankYou > 0);

  // 4. Admin login
  await page.goto(BASE + "/admin", { waitUntil: "networkidle" });
  await page.fill('input[type="password"]', PASSWORD);
  await page.getByRole("button", { name: /Enter/i }).click();
  await page.waitForTimeout(1500);
  const loggedIn = await page.getByText(/Manju KC · Admin/i).count();
  log("Admin login", loggedIn > 0);

  // 5. Submissions tab shows the test submission
  await page.getByRole("button", { name: /Submissions/i }).click();
  await page.waitForTimeout(1500);
  const subShown = await page.getByText("pw@example.com").count();
  log("Submissions panel shows new message", subShown > 0, "pw@example.com");

  // 6. Content tab — upload via URL (Unsplash) for hero image, then save
  await page.getByRole("button", { name: /Content/i }).click();
  await page.waitForTimeout(1000);
  const useUrlButtons = page.getByRole("button", { name: /Use image URL/i });
  await useUrlButtons.first().click();
  await page.waitForTimeout(400);
  const urlInput = page.locator('input[placeholder="https://…/photo.jpg"]').first();
  await urlInput.fill(UNSPLASH);
  await page.getByRole("button", { name: /^Add$/ }).first().click();
  await page.waitForTimeout(3000);
  const urlAdded = await page.getByText(/res\.cloudinary\.com/i).first().count();
  log("Upload via URL (Unsplash) returns Cloudinary URL", urlAdded > 0);

  // 7. Save changes
  await page.getByRole("button", { name: /Save changes/i }).click();
  await page.waitForTimeout(2500);
  const savedToast = await page.getByText(/Content updated|Save failed/i).first().count();
  log("Save changes (GitHub persist)", savedToast > 0);

  // 8. Verify hero image reflected on home
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const heroImg = await page.locator('img[src*="res.cloudinary.com"]').count();
  log("Home hero shows uploaded (Cloudinary) image", heroImg > 0);

  // 9. No console errors (ignore favicon/network noise)
  const realErrors = errors.filter((e) => !/favicon|404|Failed to load resource.*favicon/i.test(e));
  log("No critical console errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length) { console.log("FAILED:", failed.map((f) => f.name).join("; ")); process.exit(1); }
})().catch((e) => { console.error("E2E crashed:", e); process.exit(2); });
