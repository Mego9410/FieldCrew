import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const appDir = join(root, "app");
const scanRoots = [join(root, "app"), join(root, "components"), join(root, "lib")];
const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mdx"]);

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    if (entry === ".next" || entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      files.push(...walk(full));
    } else if ([...codeExtensions].some((ext) => full.endsWith(ext))) {
      files.push(full);
    }
  }

  return files;
}

function toRoutePattern(pagePath: string): string {
  const rel = relative(appDir, pagePath).replace(/\\/g, "/");
  const withoutPage = rel.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  return withoutPage ? `/${withoutPage}` : "/";
}

function isPathMatch(pathname: string, pattern: string): boolean {
  const a = pathname.split("/").filter(Boolean);
  const b = pattern.split("/").filter(Boolean);
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    const seg = b[i]!;
    if (seg.startsWith("[") && seg.endsWith("]")) continue;
    if (a[i] !== seg) return false;
  }
  return true;
}

function hasInternalRoute(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => isPathMatch(pathname, pattern));
}

const pageFiles = walk(appDir).filter((file) => file.endsWith("/page.tsx") || file.endsWith("\\page.tsx"));
const routePatterns = pageFiles.map(toRoutePattern);
const scanFiles = scanRoots.flatMap((dir) => walk(dir));
const publicPageFiles = pageFiles.filter((file) => {
  const rel = relative(appDir, file).replace(/\\/g, "/");
  return !rel.startsWith("app/") && !rel.startsWith("api/") && !rel.startsWith("w/");
});

const placeholderFindings: string[] = [];
const invalidRouteFindings: string[] = [];
const temporaryLanguageFindings: string[] = [];
const hrefRegex = /href\s*[:=]\s*["'`]([^"'`]+)["'`]/g;
const temporaryPatterns = [/coming soon/i, /todo:/i, /under construction/i, /to be implemented/i];

for (const file of scanFiles) {
  const content = readFileSync(file, "utf8");
  const relFile = relative(root, file).replace(/\\/g, "/");
  let match: RegExpExecArray | null = hrefRegex.exec(content);

  while (match) {
    const href = match[1]!;
    const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
    const isAnchorOnly = href.startsWith("#");
    const isInternal = href.startsWith("/");

    if (href === "#" || href.trim() === "") {
      placeholderFindings.push(`${relFile} -> "${href}"`);
    } else if (isAnchorOnly) {
      // Local anchors are allowed.
    } else if (isInternal && !isExternal) {
      const pathname = href.split("#")[0]!.split("?")[0]!;
      if (!hasInternalRoute(pathname, routePatterns)) {
        invalidRouteFindings.push(`${relFile} -> "${href}"`);
      }
    }

    match = hrefRegex.exec(content);
  }
}

for (const file of publicPageFiles) {
  const content = readFileSync(file, "utf8");
  const relFile = relative(root, file).replace(/\\/g, "/");
  for (const pattern of temporaryPatterns) {
    if (pattern.test(content)) {
      temporaryLanguageFindings.push(`${relFile} -> matches ${pattern}`);
    }
  }
}

if (placeholderFindings.length || invalidRouteFindings.length || temporaryLanguageFindings.length) {
  if (placeholderFindings.length) {
    console.error("Placeholder href findings:");
    for (const finding of placeholderFindings) console.error(`- ${finding}`);
  }
  if (invalidRouteFindings.length) {
    console.error("Invalid internal route findings:");
    for (const finding of invalidRouteFindings) console.error(`- ${finding}`);
  }
  if (temporaryLanguageFindings.length) {
    console.error("Temporary language findings in public pages:");
    for (const finding of temporaryLanguageFindings) console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("Link integrity check passed: no placeholder hrefs, invalid internal routes, or temporary public-page language found.");
