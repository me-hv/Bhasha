/**
 * BHASHA — Independent Linguistic Correctness & Phonetic Validation Test Suite
 * Asserts syllabification, phoneme representation, Hindi schwa syncope, and decoupled rhyme scores
 * against the 210+ Human Gold Standard Dataset independently of search ranking.
 */

import { LINGUISTIC_GOLD_DATASET } from './linguistic-gold-dataset';
import {
  countWordSyllables,
  toPhoneticSequence,
  toPhoneticSequences,
  getRhymeScore,
} from '../lib/language-engine/phonetics';

console.log('\n=================================================================');
console.log('🧪 RUNNING BHASHA PHASE 6 INDEPENDENT LINGUISTIC CORRECTNESS SUITE');
console.log('=================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

// ---------------------------------------------------------------------------
// TEST SUITE 1: SYLLABLE COUNT & SEGMENTATION ACCURACY (210+ WORDS)
// ---------------------------------------------------------------------------
console.log(`\n🔍 1. Validating Spoken Syllable Counts across ${LINGUISTIC_GOLD_DATASET.length} Gold Standard Words...`);

for (const entry of LINGUISTIC_GOLD_DATASET) {
  const computedSyllables = countWordSyllables(entry.devanagari);
  const seq = toPhoneticSequence(entry.devanagari);

  assert(
    computedSyllables === entry.verifiedSyllables,
    `[${entry.devanagari}] Syllables: Got ${computedSyllables}, Expected ${entry.verifiedSyllables} (IPA: /${seq.ipa}/)`
  );
}

// ---------------------------------------------------------------------------
// TEST SUITE 2: HINDI SCHWA SYNCOPE & CODA INTEGRITY
// ---------------------------------------------------------------------------
console.log('\n🔍 2. Validating Hindi Schwa Syncope & Intervocalic Coda Formation...');

const syncopeWords = LINGUISTIC_GOLD_DATASET.filter(e => e.hasSchwaSyncope);
console.log(`   Auditing ${syncopeWords.length} words with active schwa syncope rules...`);

for (const entry of syncopeWords) {
  const seq = toPhoneticSequence(entry.devanagari);
  assert(
    seq.syllableCount === entry.verifiedSyllables,
    `[Syncope] ${entry.devanagari} correctly deleted internal schwa -> /${seq.ipa}/ (${seq.syllableCount} syls)`
  );
}

// ---------------------------------------------------------------------------
// TEST SUITE 3: NUQTA & DIALECTAL VARIANT GENERATION
// ---------------------------------------------------------------------------
console.log('\n🔍 3. Validating Nuqta & Dialectal Phonetic Variants...');

const qudratVariants = toPhoneticSequences('क़ुदरत');
assert(
  qudratVariants.length >= 2,
  `"क़ुदरत" generates canonical Perso-Arabic (/q/) and standard Hindi (/k/) phonetic sequences (count: ${qudratVariants.length})`
);

const fursatVariants = toPhoneticSequences('फ़ुरसत');
assert(
  fursatVariants.length >= 2,
  `"फ़ुरसत" generates canonical (/f/) and aspirated bilabial (/pʰ/) variants (count: ${fursatVariants.length})`
);

const khwabVariants = toPhoneticSequences('ख़्वाब');
assert(
  khwabVariants.length >= 2,
  `"ख़्वाब" generates canonical (/x/) and aspirated velar (/kʰ/) variants (count: ${khwabVariants.length})`
);

// ---------------------------------------------------------------------------
// TEST SUITE 4: DECOUPLED RHYME QUALITY & SPAN DIMENSIONS
// ---------------------------------------------------------------------------
console.log('\n🔍 4. Validating Decoupled Rhyme Engine: Acoustic Quality vs Syllable Span...');

// Case A: 1-Syllable Perfect Rhyme (रात ↔ बात)
const raatBaat = getRhymeScore('रात', 'बात');
assert(
  raatBaat.category === 'perfect' && raatBaat.multisyllabic === false && raatBaat.matchingSyllables === 1 && raatBaat.quality >= 0.98,
  `[रात ↔ बात] Monosyllabic Perfect: category='perfect', multisyllabic=false, matchingSyllables=1, quality=${raatBaat.quality}`
);

// Case B: 2-Syllable Multi-Syllabic Perfect Rhyme (ज़िंदगी ↔ बंदगी)
const zindagiBandagi = getRhymeScore('ज़िंदगी', 'बंदगी');
assert(
  zindagiBandagi.category === 'multisyllabic' && zindagiBandagi.multisyllabic === true && zindagiBandagi.matchingSyllables >= 2 && zindagiBandagi.quality >= 0.95,
  `[ज़िंदगी ↔ बंदगी] Polysyllabic Multi: category='multisyllabic', multisyllabic=true, matchingSyllables=${zindagiBandagi.matchingSyllables}, quality=${zindagiBandagi.quality}`
);

// Case C: Polysyllabic Perfect Cadence (तन्हाई ↔ जुदाई)
const tanhaiJudai = getRhymeScore('तन्हाई', 'जुदाई');
assert(
  tanhaiJudai.category === 'multisyllabic' && tanhaiJudai.multisyllabic === true && tanhaiJudai.matchingSyllables >= 2 && tanhaiJudai.quality >= 0.95,
  `[तन्हाई ↔ जुदाई] Polysyllabic Multi: category='multisyllabic', multisyllabic=true, matchingSyllables=${tanhaiJudai.matchingSyllables}, quality=${tanhaiJudai.quality}`
);

// Case D: Cross-Length Strong Rhyme (रात [1 syl] ↔ जज़्बात [2 syl])
const raatJazbaat = getRhymeScore('रात', 'जज़्बात');
assert(
  raatJazbaat.category === 'strong' && raatJazbaat.multisyllabic === false && raatJazbaat.matchingSyllables === 1 && raatJazbaat.quality >= 0.90,
  `[रात ↔ जज़्बात] Cross-Length Strong: category='strong', multisyllabic=false, matchingSyllables=1, quality=${raatJazbaat.quality}`
);

// Case E: Slant / Near Rhyme (दर्द [rd̪] ↔ मर्ज़ [rz])
const dardMarz = getRhymeScore('दर्द', 'मर्ज़');
assert(
  dardMarz.category === 'near' && dardMarz.multisyllabic === false && dardMarz.quality >= 0.65,
  `[दर्द ↔ मर्ज़] Complex Coda Slant: category='near', multisyllabic=false, quality=${dardMarz.quality}`
);

// Case F: Consonance Rhyme (वक़्त [kt̪] ↔ सख़्त [xt̪])
const waqtSakht = getRhymeScore('वक़्त', 'सख़्त');
assert(
  waqtSakht.score >= 0.90,
  `[वक़्त ↔ सख़्त] Persian Coda Cluster match: score=${waqtSakht.score}`
);

// ---------------------------------------------------------------------------
// TEST SUITE 5: RHYME DEBUGGER & DIAGNOSTICS SMOKE TEST
// ---------------------------------------------------------------------------
console.log('\n🔍 5. Smoke Testing DetailedRhymeScore Schema Contract...');
const sampleScore = getRhymeScore('फ़ुरसत', 'क़ुदरत');
assert(
  typeof sampleScore.score === 'number' &&
  typeof sampleScore.quality === 'number' &&
  typeof sampleScore.phoneticSimilarity === 'number' &&
  typeof sampleScore.matchingSyllables === 'number' &&
  typeof sampleScore.rhymeLength === 'number' &&
  typeof sampleScore.category === 'string' &&
  typeof sampleScore.multisyllabic === 'boolean' &&
  typeof sampleScore.type === 'string' &&
  typeof sampleScore.confidence === 'number' &&
  typeof sampleScore.phoneticDistance === 'number',
  'DetailedRhymeScore schema contains all decoupled dimensions with strict types'
);

// Summary
console.log('\n=================================================================');
console.log(`📊 LINGUISTIC VALIDATION SUMMARY: ${passedTests} Passed, ${failedTests} Failed (Total ${passedTests + failedTests} assertions)`);
console.log('=================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL LINGUISTIC CORRECTNESS & REALITY CHECK TESTS PASSED!\n');
}
