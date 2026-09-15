/**
 * BHASHA — Automated Rhyme Quality & Human Evaluation Benchmark Test Suite
 * Tests 100+ human-reviewed pairs against the 5-stage deterministic rhyme scoring engine.
 */

import { HUMAN_EVALUATION_DATASET } from './evaluation-dataset';
import { getRhymeScore } from '../lib/language-engine/phonetics';
import { getRhymes } from '../lib/language-engine/rhyme-engine';

console.log('\n=================================================================');
console.log('🧪 RUNNING BHASHA PHASE 5 RHYME QUALITY & HUMAN BENCHMARK SUITE');
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

// 1. Benchmark 100+ Human Reviewed Pairs
console.log(`\n🔍 1. Evaluating ${HUMAN_EVALUATION_DATASET.length} Human-Reviewed Benchmark Pairs...`);

for (const pair of HUMAN_EVALUATION_DATASET) {
  const result = getRhymeScore(pair.query, pair.candidate);
  const tierMatch = result.type === pair.expectedTier;
  const scoreValid = result.score >= pair.minScore;

  assert(
    tierMatch && scoreValid,
    `[${pair.id}] ${pair.query} ↔ ${pair.candidate} -> Got: ${result.type.toUpperCase()} (${result.score}), Expected: ${pair.expectedTier.toUpperCase()} (>=${pair.minScore})`
  );
}

// 2. End-to-End Ranking Quality Tests
console.log('\n🔍 2. Verifying End-to-End Lyricist-Curated Search Ranking for "रात"...');
const raatRhymes = getRhymes('रात');
const topPerfect = raatRhymes.perfect.map(m => m.devanagari);
assert(
  topPerfect.includes('बात') && topPerfect.includes('साथ') && topPerfect.includes('हाथ'),
  `Top perfect rhymes for "रात" contain core anchors [बात, साथ, हाथ]. Got: [${topPerfect.slice(0, 5).join(', ')}]`
);

const topStrong = raatRhymes.strong.map(m => m.devanagari);
assert(
  topStrong.includes('जज़्बात') || topStrong.includes('हालात') || topStrong.includes('बरसात'),
  `Strong rhymes for "रात" include polysyllabic [जज़्बात, हालात, बरसात]. Got: [${topStrong.slice(0, 5).join(', ')}]`
);

// 3. Multi-Syllabic Recognition Tests
console.log('\n🔍 3. Verifying Multi-Syllabic Endings across Multiple Syllables...');
const zindagiRhymes = getRhymes('ज़िंदगी');
const zindagiMulti = (zindagiRhymes.multisyllabic || []).map(m => m.devanagari);
assert(
  zindagiMulti.includes('बंदगी') || zindagiMulti.includes('सादगी') || zindagiMulti.includes('ताज़गी'),
  `Multi-syllabic rhymes for "ज़िंदगी" recognize 2-syllable ending [-da-gee]. Got: [${zindagiMulti.join(', ')}]`
);

const tanhaiRhymes = getRhymes('तन्हाई');
const tanhaiMulti = (tanhaiRhymes.multisyllabic || []).map(m => m.devanagari);
assert(
  tanhaiMulti.includes('जुदाई') || tanhaiMulti.includes('रुसवाई') || tanhaiMulti.includes('गहराई') || tanhaiMulti.includes('सच्चाई'),
  `Multi-syllabic rhymes for "तन्हाई" recognize [-aa-ee] ending. Got: [${tanhaiMulti.join(', ')}]`
);

// Benchmark Summary
console.log('\n=================================================================');
console.log(`📊 BENCHMARK SUMMARY: ${passedTests} Passed, ${failedTests} Failed (Total ${passedTests + failedTests} assertions)`);
console.log('=================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL RHYME QUALITY & HUMAN BENCHMARK TESTS PASSED!\n');
}
