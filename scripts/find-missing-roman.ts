import * as fs from 'fs';
import * as path from 'path';
import { ROMAN_TO_HINDI_DICTIONARY } from '../src/data/roman-mappings';
import { normalizeRomanHindi, resolveToDevanagari } from '../src/lib/language-engine/normalizer';
import { toPhoneticSequence, getRhymeScore } from '../src/lib/language-engine/phonetics';

const vars: any[] = JSON.parse(fs.readFileSync('./src/tests/linguistic/roman-variants.json', 'utf-8'));
const missing: Record<string, string> = {};

for (const v of vars) {
  const norm = normalizeRomanHindi(v.roman);
  const { devanagari } = resolveToDevanagari(norm);
  const exactMatch = devanagari === v.canonicalDevanagari;
  const seqNorm = toPhoneticSequence(devanagari || norm);
  const seqCanon = toPhoneticSequence(v.canonicalDevanagari);
  const phoneticMatch = getRhymeScore(seqNorm, seqCanon).score >= 0.85;

  if (!exactMatch && !phoneticMatch) {
    missing[v.roman.toLowerCase()] = v.canonicalDevanagari;
    missing[norm] = v.canonicalDevanagari;
  }
}

console.log('Missing entries:', Object.keys(missing).length);
console.log(JSON.stringify(missing, null, 2));
