/**
 * BHASHA — Phase 3 Language Engine Test Suite
 */

import { resolveToDevanagari, normalizeRomanHindi } from '../lib/language-engine/normalizer';
import { extractPhoneticKey, calculatePhoneticRhymeScore, countSyllables, countWordSyllables } from '../lib/language-engine/phonetics';
import { getRhymes, getWord } from '../lib/language-engine/rhyme-engine';
import { searchService } from '../lib/services/search-service';

export function runLanguageEngineTests(): { passed: number; failed: number; log: string[] } {
  const log: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      log.push(`✅ PASS: ${message}`);
      passed++;
    } else {
      log.push(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  log.push('=== 1. TESTING ROMAN HINDI NORMALIZATION ===');
  const normalizations = [
    { input: 'raat', expected: 'रात' },
    { input: 'raaaat', expected: 'रात' },
    { input: 'zindgi', expected: 'ज़िंदगी' },
    { input: 'zindagi', expected: 'ज़िंदगी' },
    { input: 'pyar', expected: 'प्यार' },
    { input: 'pyaar', expected: 'प्यार' },
    { input: 'shehar', expected: 'शहर' },
    { input: 'khwab', expected: 'ख्वाब' },
    { input: 'khwaab', expected: 'ख्वाब' },
    { input: 'fana', expected: 'फ़ना' },
    { input: 'fanaa', expected: 'फ़ना' },
    { input: 'barsaat', expected: 'बरसात' },
    { input: 'jazbaat', expected: 'जज़्बात' },
    { input: 'kalam', expected: 'कलम' },
    { input: 'mehfil', expected: 'महफ़िल' },
  ];

  for (const { input, expected } of normalizations) {
    const resolved = resolveToDevanagari(input).devanagari;
    assert(resolved === expected, `resolveToDevanagari("${input}") -> "${resolved}" (expected "${expected}")`);
  }

  log.push('\n=== 2. TESTING SYLLABLE COUNTING & PHONETICS ===');
  const syllableTests = [
    { text: 'रात', expected: 1 },
    { text: 'दिल', expected: 1 },
    { text: 'प्यार', expected: 1 },
    { text: 'बरसात', expected: 2 },
    { text: 'ज़िंदगी', expected: 3 },
    { text: 'रात में जागता सवाल मेरे साथ', expected: 10 },
  ];

  for (const { text, expected } of syllableTests) {
    const count = countSyllables(text);
    assert(count === expected || Math.abs(count - expected) <= 1, `countSyllables("${text}") -> ${count} (expected ~${expected})`);
  }

  const phoneticKeyRaat = extractPhoneticKey('रात');
  assert(phoneticKeyRaat.nucleus === 'aː', `extractPhoneticKey("रात").nucleus is "aː" (got "${phoneticKeyRaat.nucleus}")`);
  assert(phoneticKeyRaat.coda === 't̪', `extractPhoneticKey("रात").coda is dental-stop "t̪" (got "${phoneticKeyRaat.coda}")`);

  log.push('\n=== 3. TESTING RHYME ENGINE & SCORE RANKING ===');
  const rhymeResult = getRhymes('raat');

  assert(rhymeResult.resolvedDevanagari === 'रात', `Resolved query "raat" to "रात"`);
  assert(rhymeResult.perfect.length > 0, `Found ${rhymeResult.perfect.length} perfect rhymes for "raat"`);
  assert(rhymeResult.strong.length > 0, `Found ${rhymeResult.strong.length} strong rhymes for "raat"`);
  assert(rhymeResult.near.length > 0, `Found ${rhymeResult.near.length} near rhymes for "raat"`);

  // Check Perfect Rhymes have score 1.00
  const allPerfectOne = rhymeResult.perfect.every(r => r.score === 1.00);
  assert(allPerfectOne, `All perfect rhymes have exact score 1.00`);

  // Check Strong Rhymes are scored between 0.85 and 0.95
  const strongRange = rhymeResult.strong.every(r => r.score >= 0.85 && r.score <= 0.95);
  assert(strongRange, `All strong rhymes scored between 0.85 and 0.95`);

  // Check Near Rhymes are scored between 0.50 and 0.75
  const nearRange = rhymeResult.near.every(r => r.score >= 0.50 && r.score <= 0.75);
  assert(nearRange, `All near rhymes scored between 0.50 and 0.75`);

  // Check Descending Sort Order
  function isDescending(arr: { score: number }[]) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].score < arr[i + 1].score) return false;
    }
    return true;
  }

  assert(isDescending(rhymeResult.strong), `Strong rhymes strictly sorted descending by score`);
  assert(isDescending(rhymeResult.near), `Near rhymes strictly sorted descending by score`);

  // Key hip-hop rhyme pairs
  const perfectWords = rhymeResult.perfect.map(p => p.word);
  const strongWords = rhymeResult.strong.map(s => s.word);
  const nearWords = rhymeResult.near.map(n => n.word);

  assert(perfectWords.includes('बात') && perfectWords.includes('साथ') && perfectWords.includes('हाथ'), `Perfect rhymes include "बात", "साथ", "हाथ"`);
  assert(strongWords.includes('जज़्बात') || strongWords.includes('हालात') || strongWords.includes('बरसात'), `Strong rhymes include "जज़्बात" / "हालात" / "बरसात"`);
  assert(nearWords.includes('याद') || nearWords.includes('आग') || nearWords.includes('राह'), `Near rhymes include "याद" / "आग" / "राह"`);

  log.push('\n=== 4. TESTING MULTI-SYLLABLE & CADENCE FLOWS ===');
  assert(!!(rhymeResult.multiSyllable && rhymeResult.multiSyllable.length > 0), `Multi-syllable phrases found for "रात" (count: ${rhymeResult.multiSyllable?.length})`);
  const cadencePhrases = rhymeResult.multiSyllable?.map(m => m.phraseOrWord) || [];
  assert(cadencePhrases.some(p => p.includes('रात')), `Multi-syllable cadence phrases populated correctly: ${cadencePhrases.join(', ')}`);

  log.push('\n=== 5. TESTING RELATED WORD GRAPH (4 SUBGRAPHS) ===');
  const wordRaat = getWord('रात');
  assert(!!wordRaat, `Retrieved word entry for "रात"`);
  assert(!!wordRaat?.relatedGraph, `Word "रात" has structured relatedGraph`);

  if (wordRaat?.relatedGraph) {
    assert(Array.isArray(wordRaat.relatedGraph.visual) && wordRaat.relatedGraph.visual.length > 0, `Visual subgraph exists: ${wordRaat.relatedGraph.visual?.join(', ')}`);
    assert(Array.isArray(wordRaat.relatedGraph.emotion) && wordRaat.relatedGraph.emotion.length > 0, `Emotion subgraph exists: ${wordRaat.relatedGraph.emotion?.join(', ')}`);
    assert(Array.isArray(wordRaat.relatedGraph.sound) && wordRaat.relatedGraph.sound.length > 0, `Sound subgraph exists: ${wordRaat.relatedGraph.sound?.join(', ')}`);
    assert(Array.isArray(wordRaat.relatedGraph.place) && wordRaat.relatedGraph.place.length > 0, `Place subgraph exists: ${wordRaat.relatedGraph.place?.join(', ')}`);
  }

  log.push('\n=== 6. TESTING UNIFIED SEARCH SERVICE ===');
  const searchServiceResult = searchService.getRhymes('jazbaat');
  assert(searchServiceResult.resolvedDevanagari === 'जज़्बात', `searchService.getRhymes("jazbaat") resolved to "जज़्बात"`);
  assert(searchServiceResult.perfect.length > 0 || searchServiceResult.strong.length > 0, `searchService found rhymes for "जज़्बात"`);

  log.push(`\n📊 RESULT: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, log };
}

const { passed, failed, log } = runLanguageEngineTests();
log.forEach((l) => console.log(l));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL LANGUAGE ENGINE TESTS PASSED!\n');
}

