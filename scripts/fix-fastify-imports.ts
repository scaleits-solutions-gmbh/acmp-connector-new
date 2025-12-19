import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_PATH = path.join(__dirname, "../apps/fastify/api/src");

function getRelativePath(from: string, to: string): string {
  const relative = path.relative(path.dirname(from), to);
  return relative.replace(/\\/g, "/");
}

function convertToAlias(filePath: string, importPath: string): string {
  // Skip if already using alias or external package
  if (
    importPath.startsWith("@/") ||
    importPath.startsWith("@") ||
    !importPath.startsWith(".")
  ) {
    return importPath;
  }

  // Resolve the actual file path
  const dir = path.dirname(filePath);
  const resolvedPath = path.resolve(dir, importPath);

  // Convert to alias path
  const relativeToSrc = path.relative(APP_PATH, resolvedPath);
  const aliasPath = "@/".concat(relativeToSrc.replace(/\\/g, "/"));

  // Remove .ts extension
  return aliasPath.replace(/\.ts$/, "");
}

function fixFile(filePath: string): void {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // Match import statements
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  const matches = [...content.matchAll(importRegex)];

  for (const match of matches) {
    const oldImport = match[1];
    const newImport = convertToAlias(filePath, oldImport);

    if (oldImport !== newImport && newImport.startsWith("@/")) {
      content = content.replace(match[0], `from '${newImport}'`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed: ${path.relative(APP_PATH, filePath)}`);
  }
}

function walkDir(dir: string): void {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith(".ts")) {
      fixFile(filePath);
    }
  }
}

console.log("🔧 Converting relative imports to @/ alias...\n");
walkDir(APP_PATH);
console.log("\n✅ Done!");
