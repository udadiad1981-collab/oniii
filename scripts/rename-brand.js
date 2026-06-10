const fs = require("fs");
const path = require("path");

const replacements = [
  // Full strings
  ["EQFRS", "oniii"],
  ["eqfrs", "oniii"],
  // JSX split logo
  [
    'EQ<span className="text-[var(--accent)]">FRS</span>',
    'on<span className="text-[var(--accent)]">iii</span>',
  ],
  [
    "EQ<span className={`text-[var(--accent)]`}>FRS</span>",
    "on<span className={`text-[var(--accent)]`}>iii</span>",
  ],
  [
    'EQ<span className=\\"text-[var(--accent)]\\">FRS</span>',
    'on<span className=\\"text-[var(--accent)]\\">iii</span>',
  ],
  ["eqfrs-", "oniii-"],
  ["EQFRS_", "oniii_"],
  ["NEXT_PUBLIC_SITE_NAME=EQFRS", "NEXT_PUBLIC_SITE_NAME=oniii"],
  ["\"EQFRS\"", '"oniii"'],
  ['"EQFRS"', '"oniii"'],
];

const extensions = [".tsx", ".ts", ".json", ".js", ".css", ".md"];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git", "test-output", "test-results"].includes(entry.name)) continue;
      walk(full);
    } else if (extensions.includes(path.extname(entry.name))) {
      let content = fs.readFileSync(full, "utf8");
      let changed = false;
      for (const [from, to] of replacements) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, "utf8");
        console.log("✓ " + path.relative(process.cwd(), full));
      }
    }
  }
}

// Also handle .env separately
const envPath = ".env";
let envContent = fs.readFileSync(envPath, "utf8");
envContent = envContent.replace(/eqfrs/g, "oniii").replace(/EQFRS/g, "oniii");
fs.writeFileSync(envPath, envContent, "utf8");
console.log("✓ .env");

walk("src");
walk("public");
walk("prisma");
walk("docs");
console.log("Done! Brand: EQFRS → oniii");
