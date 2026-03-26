import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(__dirname, '../src/tokens');

// Sanitize a key into a CSS variable name fragment
function sanitize(str) {
  return str
    .toLowerCase()
    .replace(/[_\s]*\([^)]*\)/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Normalize a key segment for lookup matching
// Handles spaces, underscores, mixed case
function normSeg(s) {
  return s
    .toLowerCase()
    .replace(/[_\s]*\([^)]*\)/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Build a flat lookup map: normalized-dot-path → raw $value
function buildLookup(obj, path = [], map = new Map()) {
  if (obj && obj.$value !== undefined) {
    map.set(path.map(normSeg).join('.'), obj.$value);
    return map;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      buildLookup(v, [...path, k], map);
    }
  }
  return map;
}

// Resolve a single {reference} string against one or more lookups
function resolveRef(ref, lookups) {
  const inner = ref.slice(1, -1);
  const key = inner.split('.').map(normSeg).join('.');
  for (const lk of lookups) {
    if (lk.has(key)) return lk.get(key);
  }
  return undefined;
}

// Resolve a value, following up to 2 levels of chained references
function resolveValue(value, lookups) {
  if (typeof value !== 'string') return value;
  if (!value.startsWith('{') || !value.endsWith('}')) return value;
  const r1 = resolveRef(value, lookups);
  if (r1 === undefined) return undefined;
  if (typeof r1 === 'string' && r1.startsWith('{') && r1.endsWith('}')) {
    return resolveRef(r1, lookups) ?? undefined;
  }
  return r1;
}

// Format a token value into a CSS string
function formatValue(value, type, lookups) {
  const resolved = resolveValue(value, lookups);
  if (resolved === undefined) return null;
  if (typeof resolved === 'string' && resolved.startsWith('{')) return null;

  if (type === 'color' || type === 'fontFamily' || type === 'string') {
    return typeof resolved === 'string' ? resolved : null;
  }
  if (type === 'dimension') {
    if (typeof resolved === 'object' && resolved !== null) return `${resolved.value}${resolved.unit}`;
    if (typeof resolved === 'number') return resolved === 0 ? '0' : `${resolved}px`;
    if (typeof resolved === 'string') return resolved;
    return null;
  }
  if (type === 'number') {
    if (typeof resolved === 'number') return resolved === 0 ? '0' : `${resolved}px`;
    if (typeof resolved === 'string') return resolved;
    return null;
  }
  return typeof resolved === 'string' ? resolved : null;
}

// Walk token tree, collecting vars grouped by top-level key
function walkTokens(obj, path, groups, lookups) {
  if (obj && obj.$value !== undefined) {
    const value = formatValue(obj.$value, obj.$type, lookups);
    if (value === null) return;
    const topKey = path[0] ?? 'misc';
    const name = '--' + path.map(sanitize).filter(Boolean).join('-');
    if (!groups[topKey]) groups[topKey] = [];
    groups[topKey].push({ name, value: String(value) });
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === 'object') walkTokens(v, [...path, k], groups, lookups);
    }
  }
}

const presenterFor = {
  colors: 'Color', icon: 'Color', text: 'Color', surface: 'Color',
  border: 'Color', logo: 'Color', shadow: 'Color',
  scale: 'Spacing', radius: 'BorderRadius',
  'border-width': 'BorderWidth',
  'font-size': 'FontSize', 'line-height': 'FontSize', 'letter-spacing': 'FontSize',
};

function buildCSS(groups, selector) {
  let css = '';
  for (const [topKey, vars] of Object.entries(groups)) {
    if (!vars.length) continue;
    const label = topKey.charAt(0).toUpperCase() + topKey.slice(1);
    const presenter = presenterFor[sanitize(topKey)];
    css += `/**\n * @tokens ${label}\n`;
    if (presenter) css += ` * @presenter ${presenter}\n`;
    css += ` */\n${selector} {\n`;
    for (const { name, value } of vars) {
      css += `  ${name}: ${value};\n`;
    }
    css += `}\n\n`;
  }
  return css.trimEnd() + '\n';
}

function processFile({ tokens, selector, outputPath, extraLookups = [] }) {
  const selfLookup = buildLookup(tokens);
  const allLookups = [selfLookup, ...extraLookups];
  const groups = {};
  walkTokens(tokens, [], groups, allLookups);
  const css = buildCSS(groups, selector);
  writeFileSync(outputPath, css);
  const count = Object.values(groups).flat().length;
  const file = outputPath.split('/src/')[1];
  console.log(`✓ ${count} tokens → src/${file}`);
  return selfLookup;
}

// ── Primitives ────────────────────────────────────────────────────────────────
const primitives = JSON.parse(readFileSync(join(tokensDir, 'primitives.json'), 'utf8'));
const primitiveLookup = processFile({
  tokens: primitives,
  selector: ':root',
  outputPath: join(__dirname, '../src/tokens.css'),
});

// ── Light mode semantics (:root) ───────────────────────────────────────────────
const semanticsLight = JSON.parse(readFileSync(join(tokensDir, 'semantics-light.json'), 'utf8'));
processFile({
  tokens: semanticsLight,
  selector: ':root',
  outputPath: join(__dirname, '../src/tokens-light.css'),
  extraLookups: [primitiveLookup],
});

// ── Dark mode semantics ([data-theme="dark"]) ──────────────────────────────────
const semanticsDark = JSON.parse(readFileSync(join(tokensDir, 'semantics-dark.json'), 'utf8'));
processFile({
  tokens: semanticsDark,
  selector: '[data-theme="dark"]',
  outputPath: join(__dirname, '../src/tokens-dark.css'),
  extraLookups: [primitiveLookup],
});

// ── Mobile scoping ─────────────────────────────────────────────────────────────
const scopingMobile = JSON.parse(readFileSync(join(tokensDir, 'scoping-mobile.json'), 'utf8'));
processFile({
  tokens: scopingMobile,
  selector: ':root',
  outputPath: join(__dirname, '../src/tokens-scoping.css'),
  extraLookups: [primitiveLookup],
});

// ── Scoping semantics (mobile) ─────────────────────────────────────────────────
const scopingSemanticsMobile = JSON.parse(readFileSync(join(tokensDir, 'scoping-semantics-mobile.json'), 'utf8'));
processFile({
  tokens: scopingSemanticsMobile,
  selector: ':root',
  outputPath: join(__dirname, '../src/tokens-scoping-semantics.css'),
  extraLookups: [primitiveLookup],
});

console.log('\nDone!');
