/**
 * BHASHA Phase 7: Verse Analysis & Writing Studio Tests
 */

import {
  parseSongContent,
  areWordsRhyming,
  detectInternalRhymes,
  analyzeFlow,
  extractLineWords,
  extractLineEndWord,
  getIdeaSeed,
  getWordAssociationSeed,
} from '../lib/language-engine';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passCount++;
    console.log(`  ✓ ${message}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('  BHASHA PHASE 7: RAP WRITING OS & VERSE ANALYZER TESTS');
console.log('======================================================\n');

// 1. END-RHYME DETECTION TESTS
console.log('1. End-Rhyme Detection:');
assert(areWordsRhyming('रात', 'बात').rhymes, 'Detects raat ↔ baat');
assert(areWordsRhyming('रात', 'साथ').rhymes, 'Detects raat ↔ saath');
assert(areWordsRhyming('जज़्बात', 'हालात').rhymes, 'Detects jazbaat ↔ halaat');
assert(areWordsRhyming('तन्हाई', 'जुदाई').rhymes, 'Detects tanhai ↔ judai');
assert(areWordsRhyming('ख्वाब', 'जवाब').rhymes, 'Detects khwaab ↔ jawaab');
assert(areWordsRhyming('पहचान', 'आसमान').rhymes, 'Detects pehchaan ↔ aasmaan');
assert(!areWordsRhyming('रात', 'दिल').rhymes, 'Rejects raat ↔ dil (non-rhyming)');
assert(!areWordsRhyming('शहर', 'कामयाब').rhymes, 'Rejects shehar ↔ kaamyaab');

// 2. RHYME GROUPING (A A A A, A B A B)
console.log('\n2. Rhyme Grouping Scheme:');
const quadRhymeVerse = `मैंने देखी वो रात
जहाँ खो गई हर बात
फिर भी दिल था मेरे साथ
लेकिन खाली थे मेरे हाथ`;

const parsedQuad = parseSongContent(quadRhymeVerse);
assert(parsedQuad.lines[0].rhymeGroup === 'A', 'Line 1 assigned to Rhyme Group A');
assert(parsedQuad.lines[1].rhymeGroup === 'A', 'Line 2 assigned to Rhyme Group A');
assert(parsedQuad.lines[2].rhymeGroup === 'A', 'Line 3 assigned to Rhyme Group A');
assert(parsedQuad.lines[3].rhymeGroup === 'A', 'Line 4 assigned to Rhyme Group A');
assert(parsedQuad.rhymeGroups.length === 1, 'Exactly 1 rhyme group found for AAAA scheme');

const ababVerse = `काली ये रात
मुश्किल है सफ़र
खो गई हर बात
सूना ये शहर`;

const parsedABAB = parseSongContent(ababVerse);
assert(parsedABAB.lines[0].rhymeGroup === 'A', 'ABAB Line 1 is A (रात)');
assert(parsedABAB.lines[1].rhymeGroup === 'B', 'ABAB Line 2 is B (सफ़र)');
assert(parsedABAB.lines[2].rhymeGroup === 'A', 'ABAB Line 3 is A (बात)');
assert(parsedABAB.lines[3].rhymeGroup === 'B', 'ABAB Line 4 is B (शहर)');
assert(parsedABAB.rhymeGroups.length === 2, 'Exactly 2 rhyme groups found for ABAB scheme');

// 3. INTERNAL RHYMES DETECTION
console.log('\n3. Internal Rhyme Detection:');
const internalLine1 = 'दिल में सवाल, आँखों में ख्वाब';
const internalMatches1 = detectInternalRhymes(internalLine1);
assert(internalMatches1.length > 0, 'Detected internal rhyme in "दिल में सवाल, आँखों में ख्वाब"');
assert(
  internalMatches1.some((m) => (m.wordA === 'सवाल' && m.wordB === 'ख्वाब') || (m.wordA === 'ख्वाब' && m.wordB === 'सवाल')),
  'Matched सवाल ↔ ख्वाब internal rhyme'
);

const internalLine2 = 'मेरी ये ज़िंदगी, तेरी वो बंदगी';
const internalMatches2 = detectInternalRhymes(internalLine2);
assert(internalMatches2.length > 0, 'Detected internal rhyme in "मेरी ये ज़िंदगी, तेरी वो बंदगी"');
assert(
  internalMatches2.some((m) => (m.wordA === 'ज़िंदगी' && m.wordB === 'बंदगी') || (m.wordA === 'बंदगी' && m.wordB === 'ज़िंदगी')),
  'Matched ज़िंदगी ↔ बंदगी internal rhyme'
);

// 4. SYLLABLE & FLOW ANALYSIS
console.log('\n4. Syllable & Flow Analysis:');
const flowRes = analyzeFlow('मैंने देखी वो रात', 92, 10);
assert(flowRes.syllables === 6, `Correct syllable count: 6 for "मैंने देखी वो रात" (got ${flowRes.syllables})`);
assert(flowRes.density === 1.5, `Correct density 1.5 syl/beat for 6 syl in 4 beats`);
assert(flowRes.cadencePattern.length > 0, `Generated cadence pattern: ${flowRes.cadencePattern}`);

// 5. SONG STATS & RHYME DENSITY
console.log('\n5. Song Statistics & Rhyme Density:');
const fullSongText = `[Verse 1]
रात में जागता, सवाल मेरे साथ
शहर सो रहा लेकिन आँखों में रात
काली ये रातें और गहरी ये बातें
जेबें थीं खाली पर भरे थे इरादे

[Hook]
ये शहर कंक्रीट का यहाँ कोई दिल नहीं
दौड़ रहे सब अंधी राहों में कोई मंज़िल नहीं`;

const songParsed = parseSongContent(fullSongText, 92, 10);
assert(songParsed.sections.length === 2, `Detected 2 sections: Verse 1 and Hook (got ${songParsed.sections.length})`);
assert(songParsed.stats.totalBars === 6, `Detected 6 bars total (got ${songParsed.stats.totalBars})`);
assert(songParsed.stats.totalWords > 25, `Word count calculated: ${songParsed.stats.totalWords}`);
assert(songParsed.stats.rhymeDensity > 50, `Rhyme density is > 50% (got ${songParsed.stats.rhymeDensity}%)`);

// 6. IDEA SEEDS & WORD ASSOCIATION
console.log('\n6. Idea Seeds & Creative Tools:');
const seed = getIdeaSeed('CONCEPT');
assert(Boolean(seed.concept && seed.image && seed.contrast && seed.emotion), 'Idea seed has Concept, Image, Contrast, Emotion');

const wordAssoc = getWordAssociationSeed('रात');
assert(wordAssoc !== null, 'Generated word association seed for "रात"');
assert(wordAssoc?.keywords && wordAssoc.keywords.length > 0, 'Word association contains related keywords');

// 7. PERFORMANCE TEST (100+ BARS)
console.log('\n7. Performance Test (100+ Bars):');
const largeSongLines: string[] = [];
for (let i = 0; i < 30; i++) {
  largeSongLines.push(`[Verse ${i + 1}]`);
  largeSongLines.push('रात में जागता, सवाल मेरे साथ');
  largeSongLines.push('शहर सो रहा लेकिन आँखों में रात');
  largeSongLines.push('काली ये रातें और गहरी ये बातें');
  largeSongLines.push('जेबें थीं खाली पर भरे थे इरादे');
}
const largeSongText = largeSongLines.join('\n');

const start = performance.now();
const largeParsed = parseSongContent(largeSongText, 92, 10);
const duration = performance.now() - start;

assert(largeParsed.stats.totalBars === 120, `Parsed 120 bars (got ${largeParsed.stats.totalBars})`);
assert(duration < 50, `Parsed 120-bar song in ${duration.toFixed(2)}ms (< 50ms)`);

console.log('\n------------------------------------------------------');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
}
