/**
 * Unit tests for generator mode detection and validation.
 * Run: node server/src/lib/generator.test.js
 */

import { getModeFlags } from './generator.js';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

console.log('getModeFlags — Baroque detection:');

// Prompt-based detection
assert(getModeFlags({ prompt: 'bach partita' }).baroque === true, '"bach partita" triggers baroque');
assert(getModeFlags({ prompt: 'A fugue in D minor' }).baroque === true, '"fugue" triggers baroque');
assert(getModeFlags({ prompt: 'baroque counterpoint' }).baroque === true, '"baroque" triggers baroque');
assert(getModeFlags({ prompt: 'sarabande in G' }).baroque === true, '"sarabande" triggers baroque');
assert(getModeFlags({ prompt: 'allemande' }).baroque === true, '"allemande" triggers baroque');
assert(getModeFlags({ prompt: 'chaconne' }).baroque === true, '"chaconne" triggers baroque');
assert(getModeFlags({ prompt: 'invention in C' }).baroque === true, '"invention" triggers baroque');
assert(getModeFlags({ prompt: 'well-tempered clavier' }).baroque === true, '"well-tempered" triggers baroque');

// inspiredBy detection
assert(getModeFlags({ inspiredBy: 'Bach' }).baroque === true, 'inspiredBy=Bach triggers baroque');
assert(getModeFlags({ inspiredBy: 'bach' }).baroque === true, 'inspiredBy=bach (lowercase) triggers baroque');

// style detection
assert(getModeFlags({ style: 'baroque' }).baroque === true, 'style=baroque triggers baroque');

// Non-baroque
assert(getModeFlags({ prompt: 'dreamy nocturne' }).baroque === false, '"dreamy nocturne" does not trigger baroque');
assert(getModeFlags({ prompt: 'jazz waltz' }).baroque === false, '"jazz waltz" does not trigger baroque');
assert(getModeFlags({}).baroque === false, 'empty params does not trigger baroque');

// Default mode flags when not baroque
console.log('\ngetModeFlags — Default mode:');
const defaultFlags = getModeFlags({ prompt: 'a quiet meditation' });
assert(defaultFlags.baroque === false, 'not baroque');
assert(defaultFlags.organicTime === true, 'organicTime enabled');
assert(defaultFlags.antiEtude === true, 'antiEtude enabled');

// Baroque mode flags
const baroqueFlags = getModeFlags({ prompt: 'bach partita' });
assert(baroqueFlags.baroque === true, 'baroque enabled');
assert(baroqueFlags.organicTime === false, 'organicTime disabled in baroque');
assert(baroqueFlags.antiEtude === false, 'antiEtude disabled in baroque');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
