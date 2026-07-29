import fs from "fs";
import path from "path";

const SRC = "./src";

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const full = path.join(dir, file.name);

    if (file.isDirectory()) {
      walk(full);
      continue;
    }

    if (file.name !== "index.ts") continue;

    let content = fs.readFileSync(full, "utf8");

    const original = content;

    // Corrige export * from "@/..."
    content = content.replace(
      /export\s+\*\s+from\s+["']@\/([^"']+)["'];?/g,
      (_, importPath) => {
        const target = path.join(SRC, importPath);
        const relative = path
          .relative(path.dirname(full), target)
          .replace(/\\/g, "/");

        return `export * from "${relative.startsWith(".") ? relative : "./" + relative}";`;
      }
    );

    // Corrige export { ... } from "@/..."
    content = content.replace(
      /export\s+\{([^}]+)\}\s+from\s+["']@\/([^"']+)["'];?/g,
      (_, names, importPath) => {
        const target = path.join(SRC, importPath);
        const relative = path
          .relative(path.dirname(full), target)
          .replace(/\\/g, "/");

        return `export {${names}} from "${relative.startsWith(".") ? relative : "./" + relative}";`;
      }
    );

    if (content !== original) {
      fs.writeFileSync(full, content);
      console.log("✓ corrigido:", full);
    }
  }
}

walk(SRC);

console.log("\n✅ Todos os barrels corrigidos.");