import * as fs from 'fs';
import * as path from 'path';
import {
  countSyllables,
  toPhoneticSequence,
  getRhymeScore,
} from '../src/lib/language-engine/phonetics';
import {
  parseSongContent,
  detectInternalRhymes,
  extractLineEndWord,
} from '../src/lib/language-engine/verse-analyzer';
import { normalizeRomanHindi, resolveToDevanagari } from '../src/lib/language-engine/normalizer';

const TEST_DIR = path.join(__dirname, '../src/tests/linguistic');
function loadJson<T>(filename: string): T {
  return JSON.parse(fs.readFileSync(path.join(TEST_DIR, filename), 'utf-8'));
}

console.log('=== 2. GOLD RHYMES FAILURES ===');
const rhymes: any[] = loadJson('gold-rhymes.json');
for (const r of rhymes) {
  const s1 = toPhoneticSequence(r.word1);
  const s2 = toPhoneticSequence(r.word2);
  const score = getRhymeScore(s1, s2);
  const actualTier = score.type.toUpperCase();
  const expectedTier = r.expectedTier.toUpperCase();
  const scoreOk = score.score >= (r.minScore || 0.65);
  const tierMatch =
    actualTier === expectedTier ||
    (expectedTier === 'PERFECT' && actualTier === 'STRONG' && score.score >= 0.90) ||
    (expectedTier === 'STRONG' && (actualTier === 'PERFECT' || actualTier === 'NEAR') && score.score >= 0.75) ||
    (expectedTier === 'MULTISYLLABIC' && score.multisyllabic);
  if (!scoreOk || !tierMatch) {
    console.log(`[${r.id}] ${r.word1} ↔ ${r.word2} | got: ${actualTier} (${score.score}), expected: ${expectedTier} (min: ${r.minScore}) | s1: ${s1.ipa}, s2: ${s2.ipa}`);
  }
}

console.log('\n=== 3. FALSE POSITIVES FAILURES ===');
const fps: any[] = loadJson('false-positives.json');
for (const fp of fps) {
  const s1 = toPhoneticSequence(fp.word1);
  const s2 = toPhoneticSequence(fp.word2);
  const score = getRhymeScore(s1, s2);
  const actualTier = score.type.toUpperCase();
  const forbidden: string[] = (fp.expectedTierNot || []).map((t: string) => t.toUpperCase());
  const isTierForbidden = forbidden.includes(actualTier);
  const isScoreTooHigh = score.score > (fp.maxScore || 0.70);
  if (isTierForbidden || isScoreTooHigh) {
    console.log(`[${fp.id}] ${fp.word1} ↔ ${fp.word2} | got: ${actualTier} (${score.score}), maxScore: ${fp.maxScore}, forbidden: ${forbidden.join(',')} | s1: ${s1.ipa}, s2: ${s2.ipa}`);
  }
}

console.log('\n=== 9. RHYME SCHEMES FAILURES ===');
const schemes: any[] = loadJson('rhyme-schemes.json');
for (const s of schemes) {
  const text = s.lines.join('\n');
  const parsed = parseSongContent(text);
  const actualScheme = parsed.lines.map((l) => l.rhymeGroup || '—');
  const expectedScheme = s.expectedScheme;
  let matches = true;
  for (let k = 0; k < expectedScheme.length; k++) {
    const exp = expectedScheme[k];
    const act = actualScheme[k];
    if (exp === '—' && act !== '—') { matches = false; break; }
    if (exp !== '—' && act === '—') { matches = false; break; }
  }
  if (!matches) {
    console.log(`[${s.id} (${s.schemeType})] got: [${actualScheme.join(',')}], expected: [${expectedScheme.join(',')}]`);
    console.log(`  lines: ${s.lines.map((l: string) => extractLineEndWord(l)).join(' | ')}`);
  }
}
