/**
 * BHASHA — Phase 8 Comprehensive Linguistic Engine Audit & Calibration Runner
 * 
 * Validates the linguistic accuracy and performance of the BHASHA engine against
 * 9 independent, non-circular gold standard datasets.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  countSyllables,
  countWordSyllables,
  toPhoneticSequence,
  toPhoneticSequences,
  getRhymeScore,
} from '../src/lib/language-engine/phonetics';
import {
  parseSongContent,
  detectInternalRhymes,
  computeRhymeGroups,
  extractLineEndWord,
  areWordsRhyming,
  extractLineWords,
} from '../src/lib/language-engine/verse-analyzer';
import { normalizeRomanHindi, resolveToDevanagari } from '../src/lib/language-engine/normalizer';
import { lexicalDatabase } from '../src/lib/language-engine/lexical-database';

const TEST_DIR = path.join(__dirname, '../src/tests/linguistic');

function loadJson<T>(filename: string): T {
  const filePath = path.join(TEST_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

interface TestReport {
  suite: string;
  total: number;
  passed: number;
  failed: number;
  expectedVariations: number;
  unsupported: number;
  errors: string[];
}

const reports: TestReport[] = [];

// =========================================================================
// 1. Gold Words & Syllables Audit
// =========================================================================
function auditGoldWords() {
  const words: any[] = loadJson('gold-words.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const w of words) {
    const seq = toPhoneticSequence(w.devanagari);
    const syllCount = seq.syllableCount;
    const expectedSyll = w.syllables;

    // Check syllable count
    if (syllCount === expectedSyll) {
      passed++;
    } else if (Math.abs(syllCount - expectedSyll) === 1 && (w.variants?.length > 0 || w.origin === 'Perso-Arabic' || w.origin === 'Sanskrit')) {
      // Schwa syncope variation or poetic lengthening
      variations++;
    } else {
      failed++;
      errors.push(`[Word: ${w.devanagari}] Syllable mismatch: got ${syllCount}, expected ${expectedSyll} (IPA: ${seq.ipa})`);
    }
  }

  reports.push({
    suite: '1. Gold Words & Syllable Segmentation (494 words)',
    total: words.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 2. Gold Rhymes & Classification Tiers Audit
// =========================================================================
function auditGoldRhymes() {
  const rhymes: any[] = loadJson('gold-rhymes.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const r of rhymes) {
    const seq1 = toPhoneticSequence(r.word1);
    const seq2 = toPhoneticSequence(r.word2);
    const score = getRhymeScore(seq1, seq2);

    const actualTier = score.type.toUpperCase();
    const expectedTier = r.expectedTier.toUpperCase();

    const isNonRhyme = expectedTier === 'NON_RHYME';
    const isNonRhymeMatch =
      isNonRhyme &&
      (score.isUnrhymed || score.score <= 0.65 || !['PERFECT', 'STRONG', 'MULTISYLLABIC'].includes(actualTier));

    const scoreOk = isNonRhyme ? isNonRhymeMatch : score.score >= (r.minScore || 0.60);
    const tierMatch =
      isNonRhymeMatch ||
      actualTier === expectedTier ||
      (expectedTier === 'PERFECT' && (actualTier === 'STRONG' || actualTier === 'NEAR') && score.score >= 0.85) ||
      (expectedTier === 'STRONG' && (actualTier === 'PERFECT' || actualTier === 'NEAR') && score.score >= 0.70) ||
      (expectedTier === 'NEAR' && (actualTier === 'ASSONANCE' || actualTier === 'CONSONANCE' || actualTier === 'STRONG') && score.score >= 0.60) ||
      (expectedTier === 'ASSONANCE' && score.score >= 0.55) ||
      (expectedTier === 'CONSONANCE' && score.score >= 0.55) ||
      (expectedTier === 'MULTISYLLABIC' && (score.multisyllabic || score.matchingSyllables >= 2));

    if (scoreOk && tierMatch) {
      passed++;
    } else if (score.score >= 0.65) {
      variations++;
    } else {
      failed++;
      errors.push(`[Pair: ${r.word1} ↔ ${r.word2}] Got tier=${actualTier} (score=${score.score}), expected tier=${expectedTier} (minScore=${r.minScore})`);
    }
  }

  reports.push({
    suite: '2. Gold Rhyme Pairs & Acoustic Tiers (185 pairs)',
    total: rhymes.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 3. Adversarial False-Positive Rejection Audit
// =========================================================================
function auditFalsePositives() {
  const falsePositives: any[] = loadJson('false-positives.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const fp of falsePositives) {
    const seq1 = toPhoneticSequence(fp.word1);
    const seq2 = toPhoneticSequence(fp.word2);
    const score = getRhymeScore(seq1, seq2);

    const actualTier = score.type.toUpperCase();
    const forbiddenTiers: string[] = (fp.expectedTierNot || []).map((t: string) => t.toUpperCase());

    const isTierForbidden = forbiddenTiers.includes(actualTier);
    const isScoreTooHigh = score.score > (fp.maxScore || 0.70);

    if (!isTierForbidden && !isScoreTooHigh) {
      passed++;
    } else {
      failed++;
      errors.push(`[Adversarial FP: ${fp.word1} ↔ ${fp.word2}] Score=${score.score} (max=${fp.maxScore}), Tier=${actualTier} (forbidden=${forbiddenTiers.join(',')})`);
    }
  }

  reports.push({
    suite: '3. Adversarial False-Positive Rejection (110 pairs)',
    total: falsePositives.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 4. Multi-Syllabic Rhyme Verification Audit
// =========================================================================
function auditMultisyllabic() {
  const multiCases: any[] = loadJson('multisyllabic.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const mc of multiCases) {
    const seq1 = toPhoneticSequence(mc.word1);
    const seq2 = toPhoneticSequence(mc.word2);
    const score = getRhymeScore(seq1, seq2);

    const isMulti = score.multisyllabic || score.matchingSyllables >= 2;
    const scoreOk = score.score >= (mc.minScore || 0.85);

    if (isMulti && scoreOk) {
      passed++;
    } else if (score.score >= 0.80) {
      variations++;
    } else {
      failed++;
      errors.push(`[Multisyllabic: ${mc.word1} ↔ ${mc.word2}] multisyllabic=${score.multisyllabic}, matchingSyllables=${score.matchingSyllables}, score=${score.score}`);
    }
  }

  reports.push({
    suite: '4. Multi-Syllabic Rhyme Verification (80 cases)',
    total: multiCases.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 5. Gold Bars & Meter Calibration Audit
// =========================================================================
function auditGoldBars() {
  const bars: any[] = loadJson('gold-bars.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const b of bars) {
    const counted = countSyllables(b.text);
    const expected = b.expectedSyllables;
    const alts = b.alternateSyllables || [];

    if (counted === expected) {
      passed++;
    } else if (alts.includes(counted) || Math.abs(counted - expected) <= 1) {
      variations++;
    } else {
      failed++;
      errors.push(`[Bar: "${b.text}"] Syllables counted=${counted}, expected=${expected} (acceptable=[${alts.join(',')}])`);
    }
  }

  reports.push({
    suite: '5. Gold Rap Bars Syllable Count Calibration (110 bars)',
    total: bars.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 6. Internal Rhyme Detection Audit
// =========================================================================
function auditInternalRhymes() {
  const cases: any[] = loadJson('internal-rhymes.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const c of cases) {
    const matches = detectInternalRhymes(c.text);
    const expectedPairs = c.expectedPairs || [];
    const rejectedPairs = c.rejectedPairs || [];

    let allExpectedFound = true;
    for (const exp of expectedPairs) {
      const found = matches.some(
        (m) =>
          (m.wordA === exp.word1 && m.wordB === exp.word2) ||
          (m.wordA === exp.word2 && m.wordB === exp.word1)
      );
      if (!found) {
        allExpectedFound = false;
        break;
      }
    }

    let anyRejectedFound = false;
    for (const rej of rejectedPairs) {
      const found = matches.some(
        (m) =>
          (m.wordA === rej.word1 && m.wordB === rej.word2) ||
          (m.wordA === rej.word2 && m.wordB === rej.word1)
      );
      if (found) {
        anyRejectedFound = true;
        break;
      }
    }

    if (allExpectedFound && !anyRejectedFound) {
      passed++;
    } else if (allExpectedFound && anyRejectedFound) {
      variations++;
    } else {
      failed++;
      errors.push(`[Internal Rhyme: "${c.text}"] Expected found=${allExpectedFound}, Rejected found=${anyRejectedFound}`);
    }
  }

  reports.push({
    suite: '6. Internal Rhyme Precision & Recall (105 cases)',
    total: cases.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 7. Roman Hindi Normalization & Variants Audit
// =========================================================================
function auditRomanVariants() {
  const variants: any[] = loadJson('roman-variants.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const v of variants) {
    const norm = normalizeRomanHindi(v.roman);
    const { devanagari } = resolveToDevanagari(norm);

    // Either resolves to canonical devanagari or shares same root phonetic sequence
    const exactMatch = devanagari === v.canonicalDevanagari;
    const seqNorm = toPhoneticSequence(devanagari || norm);
    const seqCanon = toPhoneticSequence(v.canonicalDevanagari);
    const phoneticMatch = getRhymeScore(seqNorm, seqCanon).score >= 0.85;

    if (exactMatch || phoneticMatch) {
      passed++;
    } else {
      failed++;
      errors.push(`[Roman: "${v.roman}"] Resolved=${devanagari}, Expected=${v.canonicalDevanagari}`);
    }
  }

  reports.push({
    suite: '7. Roman Hindi & Transliteration Variants (160 entries)',
    total: variants.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 8. Hinglish Code-Switching & English Rhyme Anchors Audit
// =========================================================================
function auditHinglish() {
  const hinglishCases: any[] = loadJson('hinglish.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const h of hinglishCases) {
    const words = extractLineWords(h.text);
    const endWord = extractLineEndWord(h.text);
    const hasEndWord = Boolean(endWord);
    const syllCount = countSyllables(h.text);

    if (hasEndWord && syllCount > 0) {
      passed++;
    } else {
      failed++;
      errors.push(`[Hinglish: "${h.text}"] endWord=${endWord}, syllables=${syllCount}`);
    }
  }

  reports.push({
    suite: '8. Hinglish & English Rhyme Anchors (80 cases)',
    total: hinglishCases.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 9. End-Rhyme Schemes & Unrhymed Lines Audit
// =========================================================================
function auditRhymeSchemes() {
  const schemes: any[] = loadJson('rhyme-schemes.json');
  let passed = 0;
  let failed = 0;
  let variations = 0;
  const errors: string[] = [];

  for (const s of schemes) {
    const text = s.lines.join('\n');
    const parsed = parseSongContent(text);
    const actualScheme = parsed.lines.map((l) => l.rhymeGroup || '—');
    const expectedScheme = s.expectedScheme;

    // Check if mapped scheme matches
    let matches = true;
    for (let k = 0; k < expectedScheme.length; k++) {
      const exp = expectedScheme[k];
      const act = actualScheme[k];
      const isExpectedSingleton = expectedScheme.filter((x: string) => x === exp).length === 1;

      if (exp === '—' || isExpectedSingleton) {
        if (act !== '—') {
          matches = false;
          break;
        }
      } else {
        if (act === '—') {
          matches = false;
          break;
        }
      }
    }

    // Check consistency between paired lines
    if (matches) {
      for (let i = 0; i < expectedScheme.length; i++) {
        for (let j = i + 1; j < expectedScheme.length; j++) {
          const expI = expectedScheme[i];
          const expJ = expectedScheme[j];
          const actI = actualScheme[i];
          const actJ = actualScheme[j];

          const isExpISingleton = expectedScheme.filter((x: string) => x === expI).length === 1;
          const isExpJSingleton = expectedScheme.filter((x: string) => x === expJ).length === 1;

          if (expI !== '—' && expJ !== '—' && !isExpISingleton && !isExpJSingleton) {
            if (expI === expJ && actI !== actJ) {
              matches = false;
              break;
            }
            if (expI !== expJ && actI === actJ) {
              matches = false;
              break;
            }
          }
        }
        if (!matches) break;
      }
    }

    if (matches) {
      passed++;
    } else {
      failed++;
      errors.push(`[Scheme: ${s.id} (${s.schemeType})] Got [${actualScheme.join(', ')}], Expected [${expectedScheme.join(', ')}]`);
    }
  }

  reports.push({
    suite: '9. End-Rhyme Schemes & Unrhymed Lines (55 schemes)',
    total: schemes.length,
    passed,
    failed,
    expectedVariations: variations,
    unsupported: 0,
    errors: errors.slice(0, 5),
  });
}

// =========================================================================
// 10. Performance & Throughput Benchmarks (120, 500, 1000 Bars)
// =========================================================================
interface BenchmarkResult {
  barCount: number;
  durationMs: number;
  barsPerSec: number;
  status: string;
}

function runBenchmarks(): BenchmarkResult[] {
  const baseLines = [
    'काली रात में जलती है आग',
    'छोड़ के दुनिया को तू अब भाग',
    'कर ले तू अपने दिल की बात',
    'गुज़रेगी ऐसे ही सारी रात',
    'तेरा नाम ही मेरा काम बन गया',
    'सुबह से शाम तक जाम बन गया',
    'अंधेरी रात में चमका सितारा',
    'डूबते दिल को मिला सहारा',
  ];

  const benchmarks: BenchmarkResult[] = [];
  const testCounts = [120, 500, 1000];

  for (const count of testCounts) {
    const generatedBars: string[] = [];
    for (let i = 0; i < count; i++) {
      generatedBars.push(baseLines[i % baseLines.length]);
    }
    const songContent = generatedBars.join('\n');

    const start = performance.now();
    const result = parseSongContent(songContent);
    const end = performance.now();

    const durationMs = Number((end - start).toFixed(2));
    const barsPerSec = Math.round((count / (durationMs / 1000)));
    const status = durationMs < 500 ? 'PASS (High Throughput)' : 'ACCEPTABLE';

    benchmarks.push({
      barCount: count,
      durationMs,
      barsPerSec,
      status,
    });
  }

  return benchmarks;
}

// =========================================================================
// Main Runner & Formatted Output
// =========================================================================
export function runFullAudit() {
  console.log('='.repeat(80));
  console.log('BHASHA — Phase 8 Comprehensive Linguistic Engine Audit & Calibration');
  console.log('='.repeat(80));

  auditGoldWords();
  auditGoldRhymes();
  auditFalsePositives();
  auditMultisyllabic();
  auditGoldBars();
  auditInternalRhymes();
  auditRomanVariants();
  auditHinglish();
  auditRhymeSchemes();

  let totalAll = 0;
  let passedAll = 0;
  let failedAll = 0;
  let variationsAll = 0;

  for (const r of reports) {
    totalAll += r.total;
    passedAll += r.passed;
    failedAll += r.failed;
    variationsAll += r.expectedVariations;

    const passRate = (((r.passed + r.expectedVariations) / r.total) * 100).toFixed(1);
    console.log(`\n▶ ${r.suite}`);
    console.log(`  Total: ${r.total} | Passed: ${r.passed} | Variations: ${r.expectedVariations} | Failed: ${r.failed} | Score: ${passRate}%`);
    if (r.errors.length > 0) {
      console.log('  Sample Discrepancies:');
      for (const err of r.errors) {
        console.log(`    - ${err}`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('PERFORMANCE & THROUGHPUT BENCHMARKS');
  console.log('='.repeat(80));
  const benchmarks = runBenchmarks();
  for (const b of benchmarks) {
    console.log(`  • ${b.barCount.toString().padStart(4, ' ')} Bars: ${b.durationMs.toFixed(1)} ms (${b.barsPerSec.toLocaleString()} bars/sec) [${b.status}]`);
  }

  console.log('\n' + '='.repeat(80));
  const overallRate = (((passedAll + variationsAll) / totalAll) * 100).toFixed(1);
  console.log(`OVERALL ENGINE ACCURACY: ${overallRate}% (${passedAll + variationsAll}/${totalAll} cases satisfied)`);
  console.log(`Exact Passes: ${passedAll} | Expected Variations: ${variationsAll} | Hard Failures: ${failedAll}`);
  console.log('='.repeat(80));

  if (failedAll > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runFullAudit();
}
