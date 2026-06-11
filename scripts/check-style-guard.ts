import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const scanRoots = [
  path.join(ROOT, "src"),
  path.join(ROOT, "tailwind.config.ts"),
  path.join(ROOT, "postcss.config.js"),
  path.join(ROOT, "next.config.js"),
];

const forbidden = [
  "box-shadow",
  "shadow-",
  "drop-shadow",
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
  "backdrop-blur",
  "bg-gradient",
];

const allowedExtensions = new Set([".css", ".ts", ".tsx", ".js", ".jsx"]);

async function listFiles(target: string): Promise<string[]> {
  const entries = await readdir(target, { withFileTypes: true }).catch(() => null);
  if (!entries) return [target];
  const files: string[] = [];
  for (const entry of entries) {
    const next = path.join(target, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(next));
    } else if (allowedExtensions.has(path.extname(entry.name))) {
      files.push(next);
    }
  }
  return files;
}

const findings: string[] = [];

for (const root of scanRoots) {
  const files = await listFiles(root);
  for (const file of files) {
    if (!allowedExtensions.has(path.extname(file))) continue;
    const text = await readFile(file, "utf8");
    for (const token of forbidden) {
      if (text.includes(token)) {
        findings.push(`${path.relative(ROOT, file)} contains ${token}`);
      }
    }
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "passed",
  scanned: scanRoots.map((item) => path.relative(ROOT, item)),
  forbidden,
}, null, 2));
