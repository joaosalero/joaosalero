import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'docs');
const pages = readdirSync(site).filter(name => name.endsWith('.html'));
assert(pages.length >= 2, 'Portfolio and professional profile pages are required.');
const documents = new Map(pages.map(name => [name, readFileSync(path.join(site, name), 'utf8')]));
let checkedLinks = 0;

for (const [name, html] of documents) {
  assert.match(html, /^<!doctype html>/i, `${name}: HTML doctype missing.`);
  assert.match(html, /<html\b[^>]*lang="en"/, `${name}: page language missing.`);
  assert.match(html, /<meta name="viewport"/, `${name}: viewport missing.`);
  assert.match(html, /<title>[^<]+<\/title>/, `${name}: document title missing.`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${name}: exactly one main heading is required.`);
  assert.match(html, /<main\b[^>]*id="main"/, `${name}: main landmark missing.`);
  assert.match(html, /class="skip-link" href="#main"/, `${name}: skip link missing.`);
  assert.match(html, /<nav aria-label="Main navigation"/, `${name}: navigation label missing.`);
  assert.doesNotMatch(html, /<script\b|\son\w+=/i, `${name}: unexpected executable page code.`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${name}: duplicate element ID.`);

  for (const [, attribute, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    assert(!/^javascript:/i.test(raw), `${name}: unsafe URL.`);
    if (/^https:\/\//i.test(raw)) { new URL(raw); continue; }
    assert(!/^[a-z][a-z0-9+.-]*:/i.test(raw), `${name}: unsupported URL scheme ${raw}.`);
    assert(!raw.startsWith('/'), `${name}: use subpath-safe relative links (${raw}).`);
    const target = new URL(raw, `https://local.invalid/${name}`);
    const relative = decodeURIComponent(target.pathname).replace(/^\//, '') || 'index.html';
    const targetPath = path.resolve(site, relative);
    assert(targetPath.startsWith(site + path.sep), `${name}: link leaves site directory.`);
    assert(existsSync(targetPath), `${name}: missing ${attribute} target ${raw}.`);
    assert(statSync(targetPath).isFile(), `${name}: target must be a file (${raw}).`);
    if (target.hash) {
      const targetHtml = readFileSync(targetPath, 'utf8');
      const fragment = decodeURIComponent(target.hash.slice(1));
      assert(targetHtml.includes(`id="${fragment}"`), `${name}: missing fragment ${raw}.`);
    }
    checkedLinks++;
  }
}

const css = readFileSync(path.join(site, 'style.css'), 'utf8');
assert.match(css, /:focus-visible/, 'Visible keyboard focus is required.');
assert.match(css, /prefers-reduced-motion/, 'Reduced-motion preference must be respected.');
assert.match(css, /@media print/, 'The professional profile needs print styling.');
assert.doesNotMatch(css, /@import|url\(\s*['"]?https?:/i, 'Remote styles or fonts are unexpected.');
console.log(`PASS: ${pages.length} HTML pages; ${checkedLinks} local links/assets; structure and stylesheet safeguards.`);
