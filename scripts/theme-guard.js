#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FORBIDDEN_ACCENT_HEX = [
  { pattern: /#ff0030/gi, label: 'accent red (use bg-accent / text-accent)' },
  { pattern: /#ff0025/gi, label: 'accent red (use bg-accent / text-accent)' },
  { pattern: /#d90029/gi, label: 'accent hover (use bg-accent-hover)' },
  { pattern: /#d90024/gi, label: 'accent hover (use bg-accent-hover)' },
];

const SCAN_DIRS = [
  path.resolve(__dirname, '..', 'apps', 'product-core', 'src'),
  path.resolve(__dirname, '..', 'apps', 'admin-app', 'src'),
];

const EXCLUDE_FILES = new Set(['globals.css', 'tokens.css', 'theme.ts', 'theme-guard.js']);

const EXTENSIONS = new Set(['.tsx', '.ts']);

function walkDir(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (EXTENSIONS.has(path.extname(entry.name)) && !EXCLUDE_FILES.has(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

let hasErrors = false;

console.log('Theme guard: checking for forbidden hardcoded accent hex values...\n');

for (const dir of SCAN_DIRS) {
  const files = walkDir(dir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    for (const { pattern, label } of FORBIDDEN_ACCENT_HEX) {
      pattern.lastIndex = 0;
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        const relPath = path.relative(path.resolve(__dirname, '..'), file);
        console.error(
          `  FAIL: ${relPath} (${matches.length} occurrences) — ${pattern.source} → ${label}`,
        );
        hasErrors = true;
      }
    }
  }
}

if (hasErrors) {
  console.error('\nTheme guard FAILED. Replace hardcoded accent hex values with semantic tokens.');
  console.error('See docs/DESIGN-SYSTEM.md Section 1.1 for the token reference.\n');
  process.exit(1);
}

console.log('Theme guard passed: no forbidden accent hex values found in app components.\n');
