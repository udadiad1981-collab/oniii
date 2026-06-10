const { execSync } = require("child_process");
const { writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");

// Get all product slugs from the live API
const cmd = `pwsh -Command "(Invoke-RestMethod -Uri http://localhost:3000/api/admin/products -UseBasicParsing).products | ForEach-Object { $_.slug } | ConvertTo-Json"`;
const result = execSync(cmd, { encoding: "utf-8" });
const slugs = JSON.parse(result);

const dir = join(__dirname, "..", "public", "products");
mkdirSync(dir, { recursive: true });

const colors = [
  "#4F46E5","#059669","#DC2626","#7C3AED","#2563EB","#EA580C","#0891B2",
  "#BE185D","#DB2777","#65A30D","#9333EA","#16A34A","#0284C7","#9A3412",
  "#A855F7","#C2410C","#15803D","#1D4ED8","#B45309","#6D28D9","#0E7490",
  "#BE123C","#E11D48","#D97706","#4B5563","#78350F","#CA8A04","#F472B6",
  "#10B981","#A78BFA","#84CC16","#78716C","#F59E0B","#06B6D4","#EF4444",
  "#F97316","#8B5CF6","#22C55E","#3B82F6"
];

slugs.forEach((slug, i) => {
  const color = colors[i % colors.length];
  const letter = slug.charAt(0).toUpperCase();

  for (let n = 1; n <= 2; n++) {
    const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="400" y2="400">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="${color}" rx="20"/>
  <rect width="400" height="400" fill="url(#g)" rx="20"/>
  <text x="200" y="230" font-family="Arial,Helvetica,sans-serif" font-size="140" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${letter}</text>
  <text x="200" y="330" font-family="Arial,Helvetica,sans-serif" font-size="26" fill="white" text-anchor="middle" opacity="0.7">EQFRS</text>
</svg>`;
    writeFileSync(join(dir, `${slug}-${n}.svg`), svg);
  }
  console.log(`OK [${i+1}/${slugs.length}] ${slug}`);
});

console.log(`\nDone: ${slugs.length} products x 2 = ${slugs.length * 2} images`);
