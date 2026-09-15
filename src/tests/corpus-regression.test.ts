/**
 * BHASHA — Phase 4 Hindustani Corpus Regression & Language Test Suite
 * Tests all required words from User Prompt + checks performance & inverted indexing.
 */

import { searchService } from '../lib/services/search-service';
import { getRhymes, getWord } from '../lib/language-engine/rhyme-engine';
import { lexicalDatabase } from '../lib/language-engine/lexical-database';
import { resolveToDevanagari, normalizeRomanHindi } from '../lib/language-engine/normalizer';

export function runCorpusRegressionTests(): { passed: number; failed: number; log: string[] } {
  const log: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      log.push(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      log.push(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  log.push('=================================================================');
  log.push('🧪 1. TESTING THE 15 REQUIRED HINDUSTANI CORE WORDS');
  log.push('=================================================================');

  const requiredWords = [
    { devanagari: 'फ़ुरसत', romanQueries: ['fursat', 'phursat'], altDev: 'फुरसत', expectedRhymesSample: ['कसरत', 'हसरत', 'कुदरत', 'शोहरत'] },
    { devanagari: 'क़ुदरत', romanQueries: ['qudrat', 'kudrat'], altDev: 'कुदरत', expectedRhymesSample: ['कसरत', 'हसरत', 'फ़ुरसत', 'शोहरत'] },
    { devanagari: 'अलविदा', romanQueries: ['alvida', 'alwida'], altDev: 'अलविदा', expectedRhymesSample: ['दुआ', 'वफ़ा', 'सज़ा', 'ख़ुदा', 'अदा'] },
    { devanagari: 'मोहब्बत', romanQueries: ['mohabbat', 'muhabbat'], altDev: 'मुहब्बत', expectedRhymesSample: ['क़यामत', 'राहत', 'चाहत'] },
    { devanagari: 'वफ़ा', romanQueries: ['wafa', 'vafa'], altDev: 'वफा', expectedRhymesSample: ['जफ़ा', 'दुआ', 'सज़ा', 'ख़ुदा', 'अदा'] },
    { devanagari: 'जुदाई', romanQueries: ['judai', 'judaai'], altDev: 'जुदाई', expectedRhymesSample: ['तन्हाई', 'रुसवाई', 'गहराई', 'सच्चाई'] },
    { devanagari: 'तन्हाई', romanQueries: ['tanhai', 'tanhaai'], altDev: 'तनहाई', expectedRhymesSample: ['जुदाई', 'रुसवाई', 'गहराई', 'सच्चाई'] },
    { devanagari: 'कायनात', romanQueries: ['kainaat', 'kaynaat'], altDev: 'कायनात', expectedRhymesSample: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'रात', 'बात'] },
    { devanagari: 'जज़्बात', romanQueries: ['jazbaat', 'zazbaat'], altDev: 'जज्बात', expectedRhymesSample: ['हालात', 'बरसात', 'मुलाक़ात', 'औक़ात', 'कायनात', 'रात'] },
    { devanagari: 'हालात', romanQueries: ['halaat', 'halat'], altDev: 'हालात', expectedRhymesSample: ['जज़्बात', 'बरसात', 'मुलाक़ात', 'औक़ात', 'रात', 'बात'] },
    { devanagari: 'बरसात', romanQueries: ['barsaat', 'barsat'], altDev: 'बरसात', expectedRhymesSample: ['जज़्बात', 'हालात', 'मुलाक़ात', 'औक़ात', 'रात', 'बात'] },
    { devanagari: 'मुलाक़ात', romanQueries: ['mulaqat', 'mulaqaat', 'mulakat'], altDev: 'मुलाकात', expectedRhymesSample: ['जज़्बात', 'हालात', 'बरसात', 'रात'] },
    { devanagari: 'फ़ना', romanQueries: ['fana', 'fanaa'], altDev: 'फना', expectedRhymesSample: ['दुआ', 'वफ़ा', 'सज़ा', 'ख़ुदा', 'अदा', 'बक़ा'] },
    { devanagari: 'सुकून', romanQueries: ['sukoon', 'sukun'], altDev: 'सुकून', expectedRhymesSample: ['जुनून', 'खून', 'कानून'] },
    { devanagari: 'मुक़द्दर', romanQueries: ['muqaddar', 'mukaddar'], altDev: 'मुकद्दर', expectedRhymesSample: ['सिकंदर', 'समंदर', 'कलंदर', 'अंदर'] },
  ];

  for (const item of requiredWords) {
    log.push(`\n🔍 Validating Word Concept: "${item.devanagari}" (${item.romanQueries[0]})`);

    // 1. Direct Devanagari lookup
    const wordDev = searchService.getWord(item.devanagari);
    assert(!!wordDev, `Direct lookup for Devanagari "${item.devanagari}" succeeded`);

    // 2. Alternate nuqta variation lookup
    if (item.altDev) {
      const wordAlt = searchService.getWord(item.altDev);
      assert(!!wordAlt, `Nuqta variant lookup "${item.altDev}" resolves correctly`);
    }

    // 3. Roman queries resolution
    for (const roman of item.romanQueries) {
      const resolved = resolveToDevanagari(roman);
      assert(
        resolved.devanagari === item.devanagari || resolved.devanagari === item.altDev,
        `Roman query "${roman}" resolves to canonical Devanagari (got "${resolved.devanagari}")`
      );
    }

    // 4. Phonetics validation
    if (wordDev) {
      assert(!!wordDev.pronunciation, `Has IPA pronunciation: ${wordDev.pronunciation}`);
      assert(wordDev.syllables >= 1, `Has accurate syllable count: ${wordDev.syllables}`);
      assert(!!wordDev.rhymeKey, `Has indexed rhymeKey: "${wordDev.rhymeKey}"`);
    }

    // 5. Meaningful phonetic rhymes validation
    const rhymes = getRhymes(item.devanagari);
    assert(rhymes.totalMatches > 0, `getRhymes("${item.devanagari}") returned ${rhymes.totalMatches} matches`);
    
    const allRhymeWords = [
      ...rhymes.perfect.map(p => p.word),
      ...(rhymes.multisyllabic || []).map(m => m.word),
      ...rhymes.strong.map(s => s.word),
      ...rhymes.near.map(n => n.word),
      ...(rhymes.consonance || []).map(c => c.word),
    ];

    // Check if at least one expected sample rhyme is found
    const foundSampleRhymes = item.expectedRhymesSample.filter(sample => allRhymeWords.includes(sample));
    assert(
      foundSampleRhymes.length > 0,
      `Found meaningful rhyme matches for "${item.devanagari}": [${foundSampleRhymes.join(', ')}]`
    );
  }

  log.push('\n=================================================================');
  log.push('🧪 2. TESTING INVERTED RHYME INDEX & PERFORMANCE BENCHMARK');
  log.push('=================================================================');

  const corpusSize = searchService.getCorpusSize();
  assert(corpusSize > 100, `Corpus size is extensive (${corpusSize} entries indexed)`);

  // Performance benchmark: Measure 1000 rhyme lookups
  const startTime = Date.now();
  const testQueries = ['fursat', 'qudrat', 'alvida', 'raat', 'dil', 'pyaar', 'shehar', 'zindagi', 'mehfil', 'sukoon'];
  const iterations = 100;

  for (let i = 0; i < iterations; i++) {
    for (const q of testQueries) {
      getRhymes(q);
    }
  }

  const durationMs = Date.now() - startTime;
  const avgPerLookupMs = durationMs / (iterations * testQueries.length);
  assert(avgPerLookupMs < 1.0, `Average lookup time is sub-millisecond (${avgPerLookupMs.toFixed(3)} ms/lookup)`);

  log.push(`\n📊 REGRESSION TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, log };
}

const { passed, failed, log } = runCorpusRegressionTests();
log.forEach((l) => console.log(l));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL HINDUSTANI CORPUS REGRESSION TESTS PASSED!\n');
}
