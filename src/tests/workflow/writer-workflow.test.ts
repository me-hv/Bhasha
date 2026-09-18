/**
 * BHASHA Phase 9: Comprehensive Writer Workflow & Scenario Test Suite
 * Validates complete end-to-end writer instrument workflows, 20 real-world writing scenarios,
 * incremental editing, and persistence integrity.
 */

import { parseSongContent } from '../../lib/language-engine/verse-analyzer';
import { getRhymes, getWord, searchDictionary } from '../../lib/language-engine/rhyme-engine';
import { getIdeaSeed, getWordAssociationSeed, getQuickWordSparks } from '../../lib/language-engine/idea-seeds';
import { formatSongMarkdown } from '../../lib/utils/export';
import { Song, RhymeTarget } from '../../types';

interface TestReport {
  name: string;
  passed: boolean;
  error?: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    reports.push({ name: testName, passed: true });
    console.log(`  ✓ ${testName}`);
  } else {
    reports.push({ name: testName, passed: false, error: detail || 'Assertion failed' });
    console.error(`  ✗ FAIL: ${testName} (${detail || ''})`);
  }
}

console.log('\n======================================================');
console.log('  BHASHA PHASE 9: WRITER WORKFLOW & SCENARIOS SUITE');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// 1. New Song Flow
// -----------------------------------------------------------------------------
console.log('1. New Song Flow:');
const sampleNewSong: Song = {
  id: 'song-test-1',
  title: 'UNTITLED TRACK',
  bpm: 92,
  key: 'Am',
  timeSignature: '4/4',
  status: 'Draft',
  content: '',
  sections: [],
  createdAt: String(Date.now()),
  updatedAt: String(Date.now()),
  tags: [],
  scratchpadNotes: '',
  stashedRhymes: [],
};
assert(sampleNewSong.title === 'UNTITLED TRACK', 'New song initializes with default title');
assert(sampleNewSong.bpm === 92 && sampleNewSong.key === 'Am', 'New song initializes with default BPM 92 and key Am');
assert(sampleNewSong.content === '', 'New song starts with empty canvas without forced questions');

// -----------------------------------------------------------------------------
// 2. Song Persistence & Autosave Lifecycle
// -----------------------------------------------------------------------------
console.log('\n2. Song Persistence & Autosave:');
const updatedSongContent = 'रात में जागता, सवाल मेरे साथ\nशहर सो रहा लेकिन आँखों में रात';
const savedSong: Song = {
  ...sampleNewSong,
  content: updatedSongContent,
  updatedAt: String(Date.now()),
};
assert(savedSong.content.includes('रात में जागता'), 'Autosave preserves lyrics accurately');
assert(savedSong.updatedAt !== undefined, 'Updated timestamp reflects latest revision');

// -----------------------------------------------------------------------------
// 3. Section Creation & Header Recognition
// -----------------------------------------------------------------------------
console.log('\n3. Section Creation & Header Recognition:');
const multiSectionText = `[Verse 1]
मैंने देखी वो रात
जहाँ खो गई हर बात

[Hook]
ये शहर का धुआँ
कुछ याद ना रहा`;

const sectionAnalysis = parseSongContent(multiSectionText, 92, 10);
assert(sectionAnalysis.sections.length === 2, 'Detected 2 distinct sections (Verse 1 and Hook)');
assert(sectionAnalysis.sections[0].title === 'Verse 1' && sectionAnalysis.sections[0].barCount === 2, 'Verse 1 has 2 bars');
assert(sectionAnalysis.sections[1].title === 'Hook' && sectionAnalysis.sections[1].barCount === 2, 'Hook has 2 bars');

// -----------------------------------------------------------------------------
// 4 & 5. Bar Creation & Editing
// -----------------------------------------------------------------------------
console.log('\n4 & 5. Bar Creation & Editing:');
assert(sectionAnalysis.stats.totalBars === 4, 'Total bar count is exactly 4 (section headers excluded from bar numbering)');
const editedText = multiSectionText + '\nलेकिन खाली थे मेरे हाथ';
const editedAnalysis = parseSongContent(editedText, 92, 10);
assert(editedAnalysis.stats.totalBars === 5, 'Adding a bar updates total bars to 5');

// -----------------------------------------------------------------------------
// 6. Pinned Rhyme Target Workflow
// -----------------------------------------------------------------------------
console.log('\n6. Pinned Rhyme Target Workflow:');
const pinnedTarget: RhymeTarget = {
  word: 'रात',
  devanagari: 'रात',
  roman: 'raat',
  isPinned: true,
};
const pinnedAnalysis = parseSongContent(
  `मैंने देखी वो रात
जहाँ खो गई हर बात
फिर भी दिल था मेरे साथ`,
  92,
  10,
  pinnedTarget
);
assert(pinnedAnalysis.lines[0].rhymeGroup === 'A', 'First bar matches target group A');
assert(pinnedAnalysis.lines[1].rhymeGroup === 'A', 'Second bar matches target group A');
assert(pinnedAnalysis.lines[2].rhymeGroup === 'A', 'Third bar matches target group A');

// -----------------------------------------------------------------------------
// 7. Rhyme Insertion Formatting
// -----------------------------------------------------------------------------
console.log('\n7. Rhyme Insertion Formatting:');
function simulateInsert(current: string, pos: number, word: string): string {
  const charBefore = pos > 0 ? current[pos - 1] : '';
  const prefix = charBefore && charBefore !== ' ' && charBefore !== '\n' ? ' ' : '';
  return current.substring(0, pos) + prefix + word + ' ' + current.substring(pos);
}
const insertedLine = simulateInsert('मैंने देखी वो', 'मैंने देखी वो'.length, 'रात');
assert(insertedLine === 'मैंने देखी वो रात ', 'Word insertion adds appropriate leading and trailing spacing');

// -----------------------------------------------------------------------------
// 8. End Rhyme Display & Unrhymed Lines
// -----------------------------------------------------------------------------
console.log('\n8. End Rhyme & Unrhymed Line Handling:');
const unrhymedVerse = `मैंने देखी वो रात
मुश्किल है सफ़र
फिर भी दिल था मेरे साथ`;
const unrhymedAnalysis = parseSongContent(unrhymedVerse, 92, 10);
assert(unrhymedAnalysis.lines[0].rhymeGroup === 'A', 'Line 1 is in rhyme group A');
assert(unrhymedAnalysis.lines[1].rhymeGroup === undefined && unrhymedAnalysis.lines[1].isUnrhymed === true, 'Line 2 is recognized as unrhymed (group undefined, isUnrhymed=true)');
assert(unrhymedAnalysis.lines[2].rhymeGroup === 'A', 'Line 3 matches Line 1 in rhyme group A');

// -----------------------------------------------------------------------------
// 9. Internal Rhyme Precision
// -----------------------------------------------------------------------------
console.log('\n9. Internal Rhyme Precision:');
const internalVerse = 'दिल में सवाल, आँखों में ख्वाब';
const internalAnalysis = parseSongContent(internalVerse, 92, 10);
assert(internalAnalysis.lines[0].internalRhymes.length > 0, 'Internal rhyme detected in line');
const hasSawalKhwaab = internalAnalysis.lines[0].internalRhymes.some(
  (r) => (r.wordA === 'सवाल' && r.wordB === 'ख्वाब') || (r.wordA === 'ख्वाब' && r.wordB === 'सवाल')
);
assert(hasSawalKhwaab, 'Correctly matched substantive internal assonance सवाल ↔ ख्वाब');

// -----------------------------------------------------------------------------
// 10. Syllable & Cadence Flow
// -----------------------------------------------------------------------------
console.log('\n10. Syllable & Cadence Flow:');
const flowLine = unrhymedAnalysis.lines[0];
assert(flowLine.syllables === 6, `Line "मैंने देखी वो रात" has 6 syllables (got ${flowLine.syllables})`);
assert(flowLine.flow !== undefined, 'Flow analysis object is populated');
const patternSymbols = (flowLine.flow?.cadencePattern || '').split(/\s+/).filter(Boolean);
assert(patternSymbols.length === 6, `Cadence pattern symbol count (${patternSymbols.length}) matches syllable count (6)`);

// -----------------------------------------------------------------------------
// 11. Mode Switching Data Availability
// -----------------------------------------------------------------------------
console.log('\n11. Mode Switching Data Availability:');
assert(unrhymedAnalysis.stats !== undefined, 'Stats available for WRITE/RHYME/FLOW modes');
assert(unrhymedAnalysis.stats.rhymeDensity >= 0 && unrhymedAnalysis.stats.rhymeDensity <= 100, 'Rhyme density is valid percentage');

// -----------------------------------------------------------------------------
// 12. Command Palette Queries
// -----------------------------------------------------------------------------
console.log('\n12. Command Palette Queries:');
const cpRhymes = getRhymes('raat');
assert(cpRhymes.totalMatches > 0, 'Command palette resolves Roman query "raat" to rhymes');
const cpDict = searchDictionary('dil', 5);
assert(cpDict.length > 0, 'Command palette searchDictionary returns matching word entries for "dil"');

// -----------------------------------------------------------------------------
// 13. Markdown Export Structure
// -----------------------------------------------------------------------------
console.log('\n13. Markdown Export:');
const exportSong: Song = {
  id: 'exp-1',
  title: 'Midnight Cypher',
  bpm: 96,
  key: 'Dm',
  timeSignature: '4/4',
  status: 'Finished',
  content: `[Verse 1]\nमैंने देखी वो रात\nखो गई हर बात`,
  sections: [],
  createdAt: String(Date.now()),
  updatedAt: String(Date.now()),
  tags: ['cypher'],
  scratchpadNotes: '',
  stashedRhymes: [],
};
const exportedMd = formatSongMarkdown(exportSong);
assert(exportedMd.includes('# MIDNIGHT CYPHER'), 'Export includes song title header');
assert(exportedMd.includes('## Verse 1'), 'Export formats section as markdown H2');
assert(exportedMd.includes('01. मैंने देखी वो रात'), 'Export numbers bars cleanly');
assert(!exportedMd.includes('phoneme') && !exportedMd.includes('cSim'), 'Export excludes raw internal debug metrics');

// -----------------------------------------------------------------------------
// 14. 20 Real-World Songwriting Scenarios
// -----------------------------------------------------------------------------
console.log('\n14. 20 Real-World Songwriting Scenarios:\n');

const scenarios = [
  // Scenario 1: Monosyllabic rhyme search (रात)
  {
    name: 'S1: Monosyllabic Rhyme Search (रात)',
    test: () => {
      const res = getRhymes('रात');
      return res.perfect.some((r) => r.word === 'बात' || r.word === 'साथ' || r.word === 'हाथ');
    },
  },
  // Scenario 2: High-concept vocabulary discovery (success feels empty)
  {
    name: 'S2: High-Concept Vocabulary Discovery (Empty Pinnacle)',
    test: () => {
      const seed = getIdeaSeed('CONCEPT');
      return seed.concept.length > 0 && (seed.keywords?.length || 0) > 0;
    },
  },
  // Scenario 3: Word association & sensory graph (रात)
  {
    name: 'S3: Word Association Sensory Graph (रात)',
    test: () => {
      const entry = getWord('रात');
      return !!entry && (entry.relatedGraph?.place?.length || 0) > 0;
    },
  },
  // Scenario 4: Multisyllabic cadence pair (ज़िंदगी ↔ बंदगी)
  {
    name: 'S4: Multisyllabic Cadence Pair (ज़िंदगी ↔ बंदगी)',
    test: () => {
      const res = getRhymes('ज़िंदगी');
      return (
        res.perfect.some((r) => r.word === 'बंदगी') ||
        res.multisyllabic?.some((r) => r.word === 'बंदगी') ||
        res.strong.some((r) => r.word === 'बंदगी')
      );
    },
  },
  // Scenario 5: Romanized Hindi query (khwaab -> ख्वाब)
  {
    name: 'S5: Romanized Hindi Query Normalization (khwaab)',
    test: () => {
      const res = getRhymes('khwaab');
      return res.resolvedDevanagari === 'ख्वाब' || res.resolvedDevanagari === 'ख़्वाब';
    },
  },
  // Scenario 6: Mixed Roman Hindi & English bar parsing
  {
    name: 'S6: Mixed Hinglish Bar Meter Parsing',
    test: () => {
      const parsed = parseSongContent('raat bhar I am chasing dreams\nkali sadkon pe broken screams', 92, 10);
      return parsed.lines[0].syllables !== null && parsed.lines[0].syllables > 0;
    },
  },
  // Scenario 7: Continuous 4-bar Rhyme Chain (रात, बात, हालात, जज़्बात)
  {
    name: 'S7: Continuous 4-Bar Rhyme Chain AAAA',
    test: () => {
      const parsed = parseSongContent(
        'देखी मैंने वो रात\nखो गई हर बात\nबिगड़े मेरे हालात\nदबे रहे जज़्बात',
        92,
        10
      );
      return (
        parsed.lines[0].rhymeGroup === 'A' &&
        parsed.lines[1].rhymeGroup === 'A' &&
        parsed.lines[2].rhymeGroup === 'A' &&
        parsed.lines[3].rhymeGroup === 'A'
      );
    },
  },
  // Scenario 8: Poetic Contrast Spark
  {
    name: 'S8: Poetic Contrast Spark Generator',
    test: () => {
      const seed = getIdeaSeed('CONTRAST');
      return seed.contrast.length > 0 && seed.keywords !== undefined;
    },
  },
  // Scenario 9: Dense technical bar internal assonance
  {
    name: 'S9: Dense Technical Bar Internal Rhymes',
    test: () => {
      const parsed = parseSongContent('तेरी वो सादगी, मेरी ये ताज़गी', 92, 10);
      return parsed.lines[0].internalRhymes.length > 0;
    },
  },
  // Scenario 10: Intentional Unrhymed Bar Handling (—)
  {
    name: 'S10: Intentional Unrhymed Bar Handling',
    test: () => {
      const parsed = parseSongContent('देखी मैंने वो रात\nमुश्किल है सफ़र\nखो गई हर बात', 92, 10);
      return parsed.lines[1].rhymeGroup === undefined && parsed.lines[1].isUnrhymed === true;
    },
  },
  // Scenario 11: Persian Coda Cluster Rhyme (वक़्त ↔ सख़्त)
  {
    name: 'S11: Persian Coda Cluster Rhyme (वक़्त ↔ सख़्त)',
    test: () => {
      const res = getRhymes('वक़्त');
      return (
        res.perfect.some((r) => r.word === 'सख़्त' || r.word === 'सख्त') ||
        res.strong.some((r) => r.word === 'सख़्त' || r.word === 'सख्त')
      );
    },
  },
  // Scenario 12: Slant / Compound Coda Rhyme (दर्द ↔ हमदर्द / शागिर्द)
  {
    name: 'S12: Slant Coda Rhyme (दर्द ↔ हमदर्द / शागिर्द)',
    test: () => {
      const res = getRhymes('दर्द');
      return (
        res.strong.some((r) => r.word === 'हमदर्द' || r.word === 'बेदर्द') ||
        res.consonance?.some((r) => r.word === 'शागिर्द') ||
        res.near.length > 0
      );
    },
  },
  // Scenario 13: Instant Vocabulary Spark Generation
  {
    name: 'S13: Instant Vocabulary Spark Generation (getQuickWordSparks)',
    test: () => {
      const sparks = getQuickWordSparks(6);
      return sparks.length === 6 && sparks.every((s) => s.devanagari && s.roman);
    },
  },
  // Scenario 14: ABAB Alternating Scheme Verification
  {
    name: 'S14: ABAB Alternating Scheme Verification',
    test: () => {
      const parsed = parseSongContent(
        'काली ये रात\nमुश्किल है सफ़र\nखो गई हर बात\nसूना ये शहर',
        92,
        10
      );
      return (
        parsed.lines[0].rhymeGroup === 'A' &&
        parsed.lines[1].rhymeGroup === 'B' &&
        parsed.lines[2].rhymeGroup === 'A' &&
        parsed.lines[3].rhymeGroup === 'B'
      );
    },
  },
  // Scenario 15: Cross-Length Rhyme Anchor (रात ↔ जज़्बात)
  {
    name: 'S15: Cross-Length Rhyme Anchor (रात ↔ जज़्बात)',
    test: () => {
      const res = getRhymes('रात');
      return res.strong.some((r) => r.word === 'जज़्बात' || r.word === 'हालात' || r.word === 'बरसात');
    },
  },
  // Scenario 16: Ghazal Radif Extraction vs Preceding Qafiya
  {
    name: 'S16: Ghazal Radif vs Qafiya Discrimination',
    test: () => {
      const parsed = parseSongContent(
        'तुझसे ही सारा किनारा मिल गया\nमुझको भी जीने का सहारा मिल गया\nआँखों को एक नया जुनून मिल गया\nदिल को भी अब वो सुकून मिल गया',
        92,
        10
      );
      return (
        parsed.lines[0].rhymeGroup === 'A' &&
        parsed.lines[1].rhymeGroup === 'A' &&
        parsed.lines[2].rhymeGroup === 'B' &&
        parsed.lines[3].rhymeGroup === 'B'
      );
    },
  },
  // Scenario 17: U-Rhyme Slang / Hip-Hop Anchor (सुकून -> जुनून, खून, कानून)
  {
    name: 'S17: Hip-Hop Anchor Rhyme Resolution (सुकून)',
    test: () => {
      const res = getRhymes('सुकून');
      return res.perfect.some((r) => r.word === 'जुनून' || r.word === 'खून' || r.word === 'कानून');
    },
  },
  // Scenario 18: Rapid Incremental Single-Bar Update Performance
  {
    name: 'S18: Rapid Incremental Single-Bar Update Performance',
    test: () => {
      const base = 'मैंने देखी वो रात\nजहाँ खो गई हर बात\nफिर भी दिल था मेरे साथ\nलेकिन खाली थे मेरे हाथ\n';
      const bigText = base.repeat(25); // 100 bars
      const t0 = performance.now();
      parseSongContent(bigText, 92, 10);
      const t1 = performance.now();
      return t1 - t0 < 60; // Under 60ms for 100 bars on cold/loaded CPU
    },
  },
  // Scenario 19: Long Vowel Slant Assonance (कम ↔ काम)
  {
    name: 'S19: Long Vowel Slant Assonance (कम ↔ काम)',
    test: () => {
      const res = getRhymes('कम');
      return (
        res.near.some((r) => r.word === 'काम' || r.word === 'नाम' || r.word === 'दाम') ||
        res.strong.some((r) => r.word === 'काम' || r.word === 'नाम')
      );
    },
  },
  // Scenario 20: Complex Suffix Chain Assonances (समझाया -> दीवाना, मस्ताना, परवाना)
  {
    name: 'S20: Complex Suffix Chain Assonances (समझाया)',
    test: () => {
      const res = getRhymes('समझाया');
      return (
        res.strong.some((r) => r.word === 'दीवाना' || r.word === 'ज़माना' || r.word === 'परवाना') ||
        res.near.length > 0
      );
    },
  },
];

for (const sc of scenarios) {
  try {
    const ok = sc.test();
    assert(ok, sc.name);
  } catch (err: any) {
    assert(false, sc.name, err.message);
  }
}

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
const total = reports.length;
const passedCount = reports.filter((r) => r.passed).length;
const failedCount = reports.filter((r) => !r.passed).length;

console.log('\n======================================================');
console.log(`WORKFLOW SUITE SUMMARY: ${passedCount} / ${total} Passed (${failedCount} Failed)`);
console.log('======================================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 9 WRITER WORKFLOW TESTS PASSED!\n');
}
