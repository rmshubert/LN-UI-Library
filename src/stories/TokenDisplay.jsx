import primitives from '../tokens/primitives.json';
import semanticsLight from '../tokens/semantics-light.json';
import scopingSemantics from '../tokens/scoping-semantics-mobile.json';

function sanitizeName(str) {
  return str
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getTokenPaths(obj, path = []) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object') {
      if (val.$value !== undefined) results.push([...path, key]);
      else results.push(...getTokenPaths(val, [...path, key]));
    }
  }
  return results;
}

function SemanticSwatch({ path }) {
  const varName = '--' + path.map(sanitizeName).filter(Boolean).join('-');
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-white/10">
      <div
        className="w-8 h-8 rounded shrink-0 border border-black/10"
        style={{ background: `var(${varName})` }}
      />
      <span className="text-xs font-mono truncate opacity-70" title={varName}>{varName}</span>
    </div>
  );
}

function SemanticGroup({ label, paths }) {
  if (!paths.length) return null;
  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">{label}</h4>
      {paths.map(p => <SemanticSwatch key={p.join('.')} path={p} />)}
    </div>
  );
}

function SemanticPanel({ sections, theme }) {
  const isDark = theme === 'dark';
  return (
    <div
      className={`flex-1 p-8 ${isDark ? 'text-white' : 'text-gray-900 bg-white'}`}
      data-theme={isDark ? 'dark' : undefined}
      style={isDark ? { background: 'var(--surface-page-default)' } : undefined}
    >
      <h2 className="text-lg font-semibold mb-6">{isDark ? 'Dark Mode' : 'Light Mode'}</h2>
      {sections.map(section => (
        <SemanticGroup
          key={section}
          label={section}
          paths={getTokenPaths(semanticsLight[section] ?? {}).map(p => [section, ...p])}
        />
      ))}
    </div>
  );
}

export function SemanticColorsView({ section }) {
  const sections = section ? [section] : Object.keys(semanticsLight);
  return (
    <div className="flex min-h-screen">
      <SemanticPanel sections={sections} theme="light" />
      <SemanticPanel sections={sections} theme="dark" />
    </div>
  );
}

// Flatten nested token object into [{ path, value, type }]
function flattenTokens(obj, path = []) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object') {
      if (val.$value !== undefined) {
        results.push({ path: [...path, key], value: val.$value, type: val.$type });
      } else {
        results.push(...flattenTokens(val, [...path, key]));
      }
    }
  }
  return results;
}

function cssVar(path) {
  return '--' + path
    .map(s => s.toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
    .filter(Boolean)
    .join('-');
}

// ─── Color Swatches ──────────────────────────────────────────────────────────

function ColorSwatch({ path, value }) {
  const variable = cssVar(path);
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div
        className="w-full h-12 rounded-md border border-black/10"
        style={{ background: value }}
      />
      <span className="text-xs text-gray-500 truncate" title={variable}>{variable}</span>
      <span className="text-xs font-mono text-gray-400">{value}</span>
    </div>
  );
}

function ColorGroup({ label, tokens }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 capitalize">{label}</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
        {tokens.map(t => (
          <ColorSwatch key={t.path.join('-')} path={t.path} value={t.value} />
        ))}
      </div>
    </div>
  );
}

export function ColorsView() {
  const all = flattenTokens(primitives.colors);
  // Group by second-level key (neutrals, stellar › black, stellar › brand blue, etc.)
  const groups = {};
  for (const token of all) {
    const groupKey = token.path.slice(0, 2).join(' › ');
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(token);
  }
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Colors</h2>
      {Object.entries(groups).map(([label, tokens]) => (
        <ColorGroup key={label} label={label} tokens={tokens} />
      ))}
    </div>
  );
}

// ─── Scale ───────────────────────────────────────────────────────────────────

export function ScaleView() {
  const tokens = flattenTokens(primitives.scale).filter(t => t.value > 0);
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Scale</h2>
      <div className="flex flex-col gap-3">
        {tokens.map(t => (
          <div key={t.path.join('-')} className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-400 w-36 shrink-0">{cssVar(t.path)}</span>
            <div
              className="bg-blue-400 rounded h-5 shrink-0"
              style={{ width: Math.min(t.value, 128) }}
            />
            <span className="text-xs text-gray-500">{t.value}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Typography ──────────────────────────────────────────────────────────────

export function TypographyView() {
  const sizes = flattenTokens(primitives.typography['font-size']).filter(t => t.value > 0);
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Font Sizes</h2>
      <div className="flex flex-col gap-6">
        {[...sizes].reverse().map(t => (
          <div key={t.path.join('-')} className="flex items-baseline gap-6 border-b border-gray-100 pb-4">
            <div className="w-52 shrink-0">
              <div className="text-xs font-mono text-gray-400">{cssVar(t.path)}</div>
              <div className="text-xs text-gray-400">{t.value}px</div>
            </div>
            <span style={{ fontSize: Math.min(t.value, 48), fontFamily: 'Lato, sans-serif', lineHeight: 1.2 }} className="text-gray-800 truncate">
              The quick brown fox
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Radius ──────────────────────────────────────────────────────────────────

export function RadiusView() {
  const tokens = flattenTokens(primitives.radius).filter(t => t.value >= 0);
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Border Radius</h2>
      <div className="flex flex-wrap gap-8">
        {tokens.map(t => (
          <div key={t.path.join('-')} className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 bg-blue-400 border-2 border-blue-500"
              style={{ borderRadius: Math.min(t.value, 64) }}
            />
            <span className="text-xs font-mono text-gray-400 text-center">{cssVar(t.path)}</span>
            <span className="text-xs text-gray-400">{t.value}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Border Width ─────────────────────────────────────────────────────────────

export function BorderWidthView() {
  const tokens = flattenTokens(primitives['border width']);
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Border Width</h2>
      <div className="flex flex-col gap-6">
        {tokens.map(t => {
          const px = typeof t.value === 'object' ? t.value.value : t.value;
          return (
            <div key={t.path.join('-')} className="flex items-center gap-6">
              <span className="text-xs font-mono text-gray-400 w-52 shrink-0">{cssVar(t.path)}</span>
              <div
                className="w-48 border-gray-800"
                style={{ borderTopWidth: px, borderTopStyle: 'solid' }}
              />
              <span className="text-xs text-gray-400">{px}px</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Scoping Semantics ────────────────────────────────────────────────────────

function toVarSegment(str) {
  return str.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function getScopingTypographyStyles(typo) {
  const styles = [];
  for (const [category, variants] of Object.entries(typo)) {
    for (const [variantName] of Object.entries(variants)) {
      const prefix = '--typography-' + [category, variantName].map(toVarSegment).join('-');
      styles.push({ label: `${category} / ${variantName}`, prefix, category });
    }
  }
  return styles;
}

function ScopingTypographyRow({ label, prefix }) {
  return (
    <div className="flex items-baseline gap-6 border-b border-gray-100 pb-4">
      <div className="w-56 shrink-0">
        <div className="text-xs font-semibold text-gray-700">{label}</div>
        <div className="text-xs font-mono text-gray-400 mt-0.5">{`${prefix}-font-size`}</div>
      </div>
      <span
        style={{
          fontFamily: `var(${prefix}-font-family)`,
          fontSize: `var(${prefix}-font-size)`,
          fontWeight: `var(${prefix}-font-weight)`,
          lineHeight: `var(${prefix}-line-height)`,
          letterSpacing: `var(${prefix}-letter-spacing)`,
          maxWidth: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#1a1a2e',
        }}
      >
        The quick brown fox jumps over the lazy dog
      </span>
    </div>
  );
}

function ScopingCategorySection({ category, styles }) {
  const categoryStyles = styles.filter(s => s.category === category);
  return (
    <div className="mb-10">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 capitalize">{category}</h3>
      <div className="flex flex-col gap-4">
        {categoryStyles.map(s => <ScopingTypographyRow key={s.label} label={s.label} prefix={s.prefix} />)}
      </div>
    </div>
  );
}

export function ScopingSemanticsView({ category }) {
  const typo = scopingSemantics.typography;
  const categories = category ? [category] : Object.keys(typo);
  const styles = getScopingTypographyStyles(category ? { [category]: typo[category] } : typo);

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Scoping Semantics — Mobile (360)</h2>
      <p className="text-sm text-gray-400 mb-8">Typography scale scoped for mobile viewport</p>
      {categories.map(cat => (
        <ScopingCategorySection key={cat} category={cat} styles={styles} />
      ))}
    </div>
  );
}
