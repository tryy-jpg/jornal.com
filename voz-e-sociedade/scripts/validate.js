#!/usr/bin/env node
/**
 * VOZ E SOCIEDADE — verificação de build
 * ---------------------------------------
 * Este projeto é um site estático (HTML/CSS/JS puro, sem framework e sem
 * bundler) — não há nada para "compilar". O papel deste script é servir
 * como o portão de qualidade equivalente a um build: ele falha (exit code 1)
 * se encontrar dados inconsistentes ou links locais quebrados, para que
 * problemas sejam pegos antes do deploy na Vercel, não depois.
 *
 * Uso: node scripts/validate.js   (roda automaticamente via `npm run build`)
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE = ROOT;
let errors = [];

if (!fs.existsSync(path.join(SITE, "index.html"))) {
  console.error(`\n✗ Build falhou — index.html não encontrado na raiz do projeto.\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------
// 1. Validação cruzada dos dados editoriais (js/data/*.js)
// ---------------------------------------------------------------------
global.window = global;
require(path.join(SITE, "js/data/categories.js"));
require(path.join(SITE, "js/data/authors.js"));
require(path.join(SITE, "js/data/tags.js"));
require(path.join(SITE, "js/data/articles.js"));
require(path.join(SITE, "js/data/explicativos.js"));
require(path.join(SITE, "js/data/cartuns.js"));
require(path.join(SITE, "js/data/dados.js"));
require(path.join(SITE, "js/data/queries.js"));

const D = global.VS_DATA;
const catSlugs = new Set(D.categories.map((c) => c.slug));
const authorSlugs = new Set(D.authors.map((a) => a.slug));
const articleSlugs = new Set(D.articles.map((a) => a.slug));
const explainerSlugs = new Set(D.explainers.map((e) => e.slug));

D.articles.forEach((a) => {
  if (!catSlugs.has(a.category)) errors.push(`[dados] Artigo "${a.slug}" usa categoria inexistente "${a.category}"`);
  if (!authorSlugs.has(a.authorSlug)) errors.push(`[dados] Artigo "${a.slug}" usa autor inexistente "${a.authorSlug}"`);
  (a.relatedSlugs || []).forEach((rs) => {
    if (!articleSlugs.has(rs) && !explainerSlugs.has(rs)) {
      errors.push(`[dados] Artigo "${a.slug}" referencia relatedSlug inexistente "${rs}"`);
    }
  });
  if (!a.slug || !a.title || !a.type || !a.date) errors.push(`[dados] Artigo id ${a.id} está com campo obrigatório ausente`);
});
D.explainers.forEach((e) => {
  if (!catSlugs.has(e.category)) errors.push(`[dados] Explicativo "${e.slug}" usa categoria inexistente "${e.category}"`);
});
D.cartuns.forEach((c) => {
  if (!catSlugs.has(c.category)) errors.push(`[dados] Cartum "${c.slug}" usa categoria inexistente "${c.category}"`);
});
const seenSlugs = new Set();
D.articles.forEach((a) => {
  if (seenSlugs.has(a.slug)) errors.push(`[dados] Slug de artigo duplicado: "${a.slug}"`);
  seenSlugs.add(a.slug);
});

// ---------------------------------------------------------------------
// 2. Todo JS do projeto tem sintaxe válida
// ---------------------------------------------------------------------
function walk(dir, exts, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".git") || entry.name === "scripts") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, cb);
    else if (exts.some((ext) => entry.name.endsWith(ext))) cb(full);
  }
}

walk(SITE, [".js"], (file) => {
  try {
    new Function(fs.readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`[sintaxe] ${path.relative(ROOT, file)}: ${e.message}`);
  }
});

// ---------------------------------------------------------------------
// 3. Todo href/src local usado em HTML aponta para um arquivo existente
//    (também funciona como auditoria de case-sensitivity, já que este
//    processo roda em Node/fs, sensível a maiúsculas/minúsculas)
// ---------------------------------------------------------------------
const REF_RE = /(?:src|href)="([^"]+)"/g;

walk(SITE, [".html"], (file) => {
  const dir = path.dirname(file);
  const content = fs.readFileSync(file, "utf8");
  let m;
  while ((m = REF_RE.exec(content))) {
    let url = m[1];
    if (/^(https?:|data:|mailto:|#)/.test(url) || url === "") continue;
    if (url.includes("?")) url = url.split("?")[0];
    if (url === "") continue;
    const resolved = path.normalize(path.join(dir, url));
    if (!fs.existsSync(resolved)) {
      errors.push(`[link] ${path.relative(ROOT, file)} referencia "${url}", que não existe (${path.relative(ROOT, resolved)})`);
    }
  }
});

// ---------------------------------------------------------------------
// 4. Nenhum resquício de ambiente de desenvolvimento local
//    (arquivos .md como o README ficam de fora do escopo desta checagem
//    porque o filtro de extensões abaixo só olha .html/.js/.css — os
//    arquivos que realmente vão para produção)
// ---------------------------------------------------------------------
const FORBIDDEN_PATTERNS = [
  { re: /localhost|127\.0\.0\.1/i, label: "referência a localhost" },
  { re: /file:\/\//, label: "caminho file://" },
  { re: /[A-Z]:\\\\|C:\//, label: "caminho absoluto do Windows" },
  { re: /\/home\/[a-z]+\/|\/Users\/[a-zA-Z]+\//, label: "caminho absoluto local (Linux/Mac)" }
];
walk(SITE, [".html", ".js", ".css"], (file) => {
  const content = fs.readFileSync(file, "utf8");
  FORBIDDEN_PATTERNS.forEach(({ re, label }) => {
    if (re.test(content)) errors.push(`[ambiente] ${path.relative(ROOT, file)} contém ${label}`);
  });
});

// ---------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------
if (errors.length) {
  console.error(`\n✗ Build falhou — ${errors.length} problema(s) encontrado(s):\n`);
  errors.forEach((e) => console.error("  - " + e));
  console.error("");
  process.exit(1);
} else {
  console.log(`✓ Build ok — ${D.articles.length} artigos, ${D.explainers.length} explicativos, ${D.cartuns.length} cartuns, ${D.categories.length} categorias, ${D.authors.length} autores.`);
  console.log("✓ Sintaxe de todos os arquivos .js válida.");
  console.log("✓ Todos os links locais (src/href) resolvem para arquivos existentes.");
  console.log("✓ Nenhum resquício de ambiente local (localhost, caminhos absolutos, file://) encontrado.");
  console.log("\nEste projeto é estático (sem bundler) — não há artefato de build para gerar.");
  console.log("Os arquivos já prontos para produção são os do próprio repositório.\n");
}
