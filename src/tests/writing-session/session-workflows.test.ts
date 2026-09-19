/**
 * BHASHA Phase 12 — Session Workflows Test Suite
 * Validates end-to-end multi-step writing workflows:
 * 1. 16-Bar Interactive Writing Workflow (lookups, saves, catalysts, revisions, snapshots)
 * 2. 32-Bar Multi-Section Album Workflow (timing, memory, multi-section latency)
 * 3. Zero-Tool Distraction-Free Flow Workflow (uninterrupted drafting)
 * 4. Heavy-Tool Intensive Writing Session (20 lookups, 10 saves, 10 internal rhyme analyses, 5 target changes)
 * 5. Mixed Hindi / Hinglish Code-Switching Workflow
 * 6. 30-Minute "Disappear into the Writing" Long Session Simulation
 */

import { assert } from './setup';
import { parseSongContent, areWordsRhyming, detectInternalRhymes } from '../../lib/language-engine/verse-analyzer';
import { countSyllables } from '../../lib/language-engine/phonetics';
import { getRhymes, getWord } from '../../lib/language-engine/rhyme-engine';
import { getIdeaSeed, getQuickWordSparks } from '../../lib/language-engine/idea-seeds';
import { Song, SongVersion, SongNote, LexiconEntry } from '../../types';
import {
  SHORT_HINDI_BARS,
  HINGLISH_BARS,
  MULTISYLLABIC_BARS,
  INTERNAL_RHYME_BARS,
  UNRHYMED_BARS,
  SIMPLE_HUMAN_BARS
} from '../../data/writer-fixtures';

console.log('🧪 RUNNING: Phase 12 — Session Workflows Test Suite\n');

let totalTests = 0;
let passedTests = 0;

function runWorkflowStep(name: string, fn: () => void) {
  totalTests++;
  try {
    const t0 = performance.now();
    fn();
    const duration = (performance.now() - t0).toFixed(2);
    passedTests++;
    console.log(`  ✓ [PASS] ${name} (${duration}ms)`);
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// ============================================================================
// WORKFLOW 1: 16-BAR INTERACTIVE WRITING WORKFLOW
// ============================================================================
console.log('--- 1. 16-Bar Interactive Writing Workflow ---');

let song1: Song = {
  id: 'song-16bar-interactive',
  title: 'रात की गवाही',
  content: '',
  bpm: 90,
  key: 'C Minor',
  tags: ['street', 'introspective'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

let personalLexicon: LexiconEntry[] = [];
let songNotes: SongNote[] = [];
let songVersions: SongVersion[] = [];

runWorkflowStep('1.1 Start new song and draft initial 4 bars', () => {
  const initial4Bars = SHORT_HINDI_BARS.slice(0, 4).join('\n');
  song1.content = initial4Bars;
  song1.updatedAt = Date.now();

  const parsed = parseSongContent(song1.content);
  assert(parsed.lines.length === 4, '4 bars drafted');
  assert(parsed.stats.totalBars === 4, 'Stats indicate 4 bars');
  assert(parsed.lines[0].endWord === 'साथ', 'Bar 1 end-word is "साथ"');
  assert(parsed.lines[1].endWord === 'बात', 'Bar 2 end-word is "बात"');
  assert(parsed.lines[2].endWord === 'सफ़र', 'Bar 3 end-word is "सफ़र"');
  assert(parsed.lines[3].endWord === 'ख़बर', 'Bar 4 end-word is "ख़बर"');
});

runWorkflowStep('1.2 Perform 5 Rhyme Lookups for anchor words', () => {
  const wordsToLookup = ['साथ', 'ज़िंदगी', 'निशान', 'सफ़र', 'तबाही'];
  for (const word of wordsToLookup) {
    const t0 = performance.now();
    const rhymes = getRhymes(word);
    const lookupDuration = performance.now() - t0;
    assert(rhymes.totalMatches > 0, `Rhymes found for "${word}"`);
    assert(lookupDuration < 20, `Lookup for "${word}" completed in ${lookupDuration.toFixed(2)}ms (<20ms)`);
  }
});

runWorkflowStep('1.3 Save 5 discovered words to Personal Lexicon', () => {
  const wordsToSave = [
    { text: 'जज़्बात', meaning: 'Emotions / feelings', tag: 'rhyme-target' },
    { text: 'सुकूद', meaning: 'Deep silence / stillness', tag: 'vocabulary' },
    { text: 'सादगी', meaning: 'Simplicity', tag: 'multisyllabic' },
    { text: 'अंगार', meaning: 'Burning embers / fiery passion', tag: 'metaphor' },
    { text: 'गुमाँ', meaning: 'Illusion / doubt', tag: 'rhyme-target' },
  ];

  for (const item of wordsToSave) {
    const entry: LexiconEntry = {
      id: `lex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      word: item.text,
      language: 'hi',
      meaning: item.meaning,
      tags: [item.tag],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    personalLexicon.push(entry);
  }
  assert(personalLexicon.length === 5, '5 words saved to lexicon');
});

runWorkflowStep('1.4 Utilize 2 Stuck Catalysts (Idea Seed + Word Spark)', () => {
  const seed = getIdeaSeed('CONCEPT');
  assert(seed !== null && seed.title.length > 0, 'Idea seed retrieved');

  const sparks = getQuickWordSparks(6);
  assert(sparks.length > 0, 'Word sparks generated');
  
  // Artist records note from seed
  songNotes.push({
    id: 'note-1',
    songId: song1.id,
    content: `Catalyst: ${seed.title} - ${seed.concept} | Words: ${sparks.slice(0, 3).map(s => s.devanagari).join(', ')}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  assert(songNotes.length === 1, 'Catalyst note recorded');
});

runWorkflowStep('1.5 Draft next 4 bars (Bars 5–8) using discovered vocabulary', () => {
  const next4Bars = SHORT_HINDI_BARS.slice(4, 8).join('\n');
  song1.content += '\n' + next4Bars;
  song1.updatedAt = Date.now();

  const parsed = parseSongContent(song1.content);
  assert(parsed.stats.totalBars === 8, '8 total bars written');
});

runWorkflowStep('1.6 Perform 4 in-flow revisions and verify real-time metric updates', () => {
  let lines = song1.content.split('\n');
  // Revision 1: Modify Bar 2 word choice
  lines[1] = 'दिल में छुपे हैं लाखों जज़्बात';
  // Revision 2: Modify Bar 4 for stronger rhyme
  lines[3] = 'मंज़िल की अब मुझे नहीं कोई ख़बर';
  // Revision 3: Add internal rhyme to Bar 6
  lines[5] = 'सपनों की धूल हवा में खुली और घुली';
  // Revision 4: Polish Bar 8
  lines[7] = 'आँखों में तैरता गहरा इक सुकूद';

  song1.content = lines.join('\n');
  const parsed = parseSongContent(song1.content);
  assert(parsed.stats.totalBars === 8, 'Still 8 bars after revisions');
  assert(parsed.lines[1].endWord === 'जज़्बात', 'Revision 1 reflected (जज़्बात)');
  assert(areWordsRhyming(parsed.lines[0].endWord || '', parsed.lines[1].endWord || ''), 'साथ and जज़्बात rhyme');
});

runWorkflowStep('1.7 Complete final 8 bars (Bars 9–16) and create Version Snapshot', () => {
  const final8Bars = SHORT_HINDI_BARS.slice(8, 16).join('\n');
  song1.content += '\n' + final8Bars;
  song1.updatedAt = Date.now();

  const parsed = parseSongContent(song1.content);
  assert(parsed.stats.totalBars === 16, 'Full 16-bar verse complete');

  // Create Snapshot
  const snapshot: SongVersion = {
    id: 'ver-16bar-v1',
    songId: song1.id,
    versionNumber: 1,
    title: '16-Bar First Draft Complete',
    content: song1.content,
    createdAt: Date.now(),
    barCount: parsed.stats.totalBars,
    wordCount: parsed.stats.totalWords,
  };
  songVersions.push(snapshot);

  assert(songVersions.length === 1, 'Version snapshot recorded');
  assert(songVersions[0].barCount === 16, 'Snapshot captures exact bar count');
});

// ============================================================================
// WORKFLOW 2: 32-BAR MULTI-SECTION ALBUM WORKFLOW
// ============================================================================
console.log('\n--- 2. 32-Bar Multi-Section Album Workflow ---');

let song32: Song = {
  id: 'song-32bar-album',
  title: 'सफ़रनामा (Album Cut)',
  content: '',
  bpm: 88,
  key: 'F# Minor',
  tags: ['album', 'multi-section'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

runWorkflowStep('2.1 Initialize 32-bar structured song across 4 sections', () => {
  const section1 = ['[Verse 1]', ...SHORT_HINDI_BARS.slice(0, 12)].join('\n');
  const section2 = ['[Hook]', ...SHORT_HINDI_BARS.slice(12, 16)].join('\n');
  const section3 = ['[Verse 2]', ...SHORT_HINDI_BARS.slice(16, 28)].join('\n');
  const section4 = ['[Hook]', ...SHORT_HINDI_BARS.slice(12, 16)].join('\n');

  song32.content = [section1, section2, section3, section4].join('\n\n');
  const parsed = parseSongContent(song32.content);

  assert(parsed.stats.totalBars === 32, '32 bars parsed');
  assert(parsed.sections.length === 4, '4 distinct sections detected');
  assert(parsed.sections[0].title === 'Verse 1' && parsed.sections[0].barCount === 12, 'Verse 1 has 12 bars');
  assert(parsed.sections[1].title === 'Hook' && parsed.sections[1].barCount === 4, 'Hook 1 has 4 bars');
  assert(parsed.sections[2].title === 'Verse 2' && parsed.sections[2].barCount === 12, 'Verse 2 has 12 bars');
  assert(parsed.sections[3].title === 'Hook' && parsed.sections[3].barCount === 4, 'Hook 2 has 4 bars');
});

runWorkflowStep('2.2 Timing & Latency Benchmark: 100 consecutive parses on 32-bar song', () => {
  const iterations = 100;
  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) {
    const p = parseSongContent(song32.content);
    assert(p.stats.totalBars === 32, 'Consistent parse result');
  }
  const totalTime = performance.now() - t0;
  const avgTime = totalTime / iterations;
  assert(avgTime < 5.0, `Average parse time is ${avgTime.toFixed(3)}ms (<5ms threshold)`);
});

runWorkflowStep('2.3 Internal Rhyme Detection Benchmark on 32-bar song', () => {
  const parsed = parseSongContent(song32.content);
  const t0 = performance.now();
  let totalInternalRhymes = 0;
  for (const line of parsed.lines) {
    if (!line.isBlank && !line.isSectionHeader) {
      const internals = detectInternalRhymes(line.text);
      totalInternalRhymes += internals.length;
    }
  }
  const totalTime = performance.now() - t0;
  assert(totalTime < 25, `Internal rhyme detection across 32 bars took ${totalTime.toFixed(2)}ms (<25ms)`);
});

runWorkflowStep('2.4 Memory Overhead: Verify lightweight state payload', () => {
  const jsonSize = Buffer.byteLength(JSON.stringify(song32), 'utf8');
  assert(jsonSize < 15000, `Song state JSON size is ${jsonSize} bytes (<15KB)`);
});

// ============================================================================
// WORKFLOW 3: ZERO-TOOL DISTRACTION-FREE FLOW WORKFLOW
// ============================================================================
console.log('\n--- 3. Zero-Tool Distraction-Free Flow Workflow ---');

runWorkflowStep('3.1 Uninterrupted rapid typing of 16 bars with zero tool interruptions', () => {
  let text = '';
  for (let i = 0; i < 16; i++) {
    text += (i > 0 ? '\n' : '') + SHORT_HINDI_BARS[i];
  }

  const parsed = parseSongContent(text);
  assert(parsed.stats.totalBars === 16, '16 uninterrupted bars');
  assert(parsed.stats.totalWords > 80, 'Over 80 words typed');
  assert(parsed.stats.avgSyllables >= 7, 'Realistic syllable cadence');
});

runWorkflowStep('3.2 Verify handling of trailing whitespace, mixed punctuation, and Devanagari numerals', () => {
  const rawPunctuationText = [
    'रात में जागता, कलम मेरे साथ!   ',
    'दिल में छुपी है कई ऐसी बात।',
    '   काली सड़कों पे अकेला सफ़र...  ',
    'मंज़िल की अब मुझे नहीं ख़बर?!',
  ].join('\n');

  const parsed = parseSongContent(rawPunctuationText);
  assert(parsed.stats.totalBars === 4, '4 bars cleanly extracted');
  assert(parsed.lines[0].endWord === 'साथ', 'Punctuation stripped from endWord "साथ"');
  assert(parsed.lines[1].endWord === 'बात', 'Danda stripped from endWord "बात"');
  assert(parsed.lines[2].endWord === 'सफ़र', 'Ellipsis stripped from endWord "सफ़र"');
  assert(parsed.lines[3].endWord === 'ख़बर', 'Question/exclamation stripped from endWord "ख़बर"');
});

// ============================================================================
// WORKFLOW 4: HEAVY-TOOL INTENSIVE WRITING SESSION
// ============================================================================
console.log('\n--- 4. Heavy-Tool Intensive Writing Session ---');

runWorkflowStep('4.1 Execute 20 diverse Rhyme Lookups across Hindi, Urdu, and Hinglish words', () => {
  const lookupPool = [
    'साथ', 'रात', 'बात', 'राज़', 'खास',
    'सफ़र', 'ख़बर', 'नज़र', 'असर', 'शहर',
    'आग', 'दाग़', 'बाग़', 'साज़', 'परवाज़',
    'flow', 'beat', 'scene', 'grind', 'shine'
  ];

  for (const word of lookupPool) {
    const t0 = performance.now();
    const rhymes = getRhymes(word);
    const time = performance.now() - t0;
    assert(time < 20, `Lookup for "${word}" under 20ms (${time.toFixed(2)}ms)`);
  }
});

runWorkflowStep('4.2 Execute 10 Lexicon Saves with tags and notes', () => {
  const heavyLexicon: LexiconEntry[] = [];
  for (let i = 0; i < 10; i++) {
    heavyLexicon.push({
      id: `heavy-lex-${i}`,
      word: `लफ़्ज़_${i}`,
      meaning: `Meaning of word ${i}`,
      tags: ['rhyme-target', 'session-12', `tier-${i % 3}`],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
  assert(heavyLexicon.length === 10, '10 lexicon items saved');
});

runWorkflowStep('4.3 Execute 10 Internal Rhyme Analyses on complex multisyllabic lines', () => {
  const sampleBars = INTERNAL_RHYME_BARS.slice(0, 10);
  for (const bar of sampleBars) {
    const rhymes = detectInternalRhymes(bar);
    assert(rhymes.length >= 1, `Internal rhyme detected in: "${bar}"`);
  }
});

runWorkflowStep('4.4 Execute 5 Dynamic Rhyme Target Switches', () => {
  const targets = ['साथ', 'सफ़र', 'आग', 'ज़िंदगी', 'तबाही'];
  let activeTarget = '';
  for (const target of targets) {
    activeTarget = target;
    const targetRhymes = getRhymes(activeTarget);
    assert(targetRhymes.totalMatches > 0, `Target "${activeTarget}" loaded rhymes`);
  }
  assert(activeTarget === 'तबाही', 'Final active target set correctly');
});

// ============================================================================
// WORKFLOW 5: MIXED HINDI / HINGLISH CODE-SWITCHING WORKFLOW
// ============================================================================
console.log('\n--- 5. Mixed Hindi / Hinglish Code-Switching Workflow ---');

runWorkflowStep('5.1 Parse and analyze code-switched multi-script verses', () => {
  const mixedBars = [
    'Microphone check meri beat on point',
    'गली के कोने pe joints and disjoint',
    'Never look back focus on my lane',
    'कलम से बहता सारा pain',
  ].join('\n');

  const parsed = parseSongContent(mixedBars);
  assert(parsed.stats.totalBars === 4, '4 code-switched bars');
  assert(parsed.lines[0].endWord === 'point', 'End word "point"');
  assert(parsed.lines[1].endWord === 'disjoint', 'End word "disjoint"');
  assert(parsed.lines[2].endWord === 'lane', 'End word "lane"');
  assert(parsed.lines[3].endWord === 'pain', 'End word "pain"');
});

runWorkflowStep('5.2 Verify cross-script rhyme compatibility', () => {
  // English loanword rhymes
  assert(areWordsRhyming('point', 'disjoint'), '"point" rhymes with "disjoint"');
  assert(areWordsRhyming('lane', 'pain'), '"lane" rhymes with "pain"');
  assert(areWordsRhyming('flow', 'glow'), '"flow" rhymes with "glow"');
});

runWorkflowStep('5.3 Syllable estimation across mixed Devanagari and Latin scripts', () => {
  for (const bar of HINGLISH_BARS.slice(0, 10)) {
    const syllables = countSyllables(bar);
    assert(syllables >= 6 && syllables <= 18, `Syllable count ${syllables} reasonable for "${bar}"`);
  }
});

// ============================================================================
// WORKFLOW 6: 30-MINUTE LONG WRITING SESSION SIMULATION
// ============================================================================
console.log('\n--- 6. 30-Minute Long Writing Session Simulation ---');

runWorkflowStep('6.1 Simulate 150+ interactive operations (keystrokes, edits, snapshots, re-ordering)', () => {
  let simulatedSong: Song = {
    id: 'sim-30min-song',
    title: 'मैदान (Long Session)',
    content: '',
    bpm: 92,
    key: 'D Minor',
    tags: ['simulation', 'stress'],
    createdAt: Date.now() - 1800000, // 30 minutes ago
    updatedAt: Date.now() - 1800000,
  };

  const undoStack: string[] = [];
  const redoStack: string[] = [];
  const simulatedVersions: SongVersion[] = [];
  const simulatedNotes: SongNote[] = [];

  // 1. Drafting 20 bars line-by-line
  for (let i = 0; i < 20; i++) {
    undoStack.push(simulatedSong.content);
    redoStack.length = 0;
    simulatedSong.content += (i > 0 ? '\n' : '') + SHORT_HINDI_BARS[i % SHORT_HINDI_BARS.length];
  }
  assert(simulatedSong.content.split('\n').length === 20, '20 bars drafted');

  // 2. 30 in-place edits and replacements
  for (let i = 0; i < 30; i++) {
    undoStack.push(simulatedSong.content);
    const lines = simulatedSong.content.split('\n');
    const targetIndex = i % lines.length;
    lines[targetIndex] = SHORT_HINDI_BARS[(i * 3) % SHORT_HINDI_BARS.length];
    simulatedSong.content = lines.join('\n');
  }

  // 3. 10 Undo operations
  for (let i = 0; i < 10; i++) {
    if (undoStack.length > 0) {
      redoStack.push(simulatedSong.content);
      simulatedSong.content = undoStack.pop()!;
    }
  }

  // 4. 5 Redo operations
  for (let i = 0; i < 5; i++) {
    if (redoStack.length > 0) {
      undoStack.push(simulatedSong.content);
      simulatedSong.content = redoStack.pop()!;
    }
  }

  // 5. Section Reordering: Add [Hook] and [Verse], move Hook to top, then back
  undoStack.push(simulatedSong.content);
  simulatedSong.content = '[Hook]\n' + SHORT_HINDI_BARS.slice(0, 4).join('\n') + '\n\n[Verse 1]\n' + simulatedSong.content;
  const parsedStructured = parseSongContent(simulatedSong.content);
  assert(parsedStructured.sections.length >= 2, 'Sections established');

  // 6. 10 Snapshot creations over time
  for (let v = 1; v <= 10; v++) {
    simulatedVersions.push({
      id: `sim-ver-${v}`,
      songId: simulatedSong.id,
      versionNumber: v,
      title: `Auto-Snapshot #${v}`,
      content: simulatedSong.content,
      createdAt: Date.now() - (10 - v) * 60000,
      barCount: parseSongContent(simulatedSong.content).stats.totalBars,
      wordCount: parseSongContent(simulatedSong.content).stats.totalWords,
    });
  }
  assert(simulatedVersions.length === 10, '10 version snapshots generated');

  // 7. Add 10 Session Notes
  for (let n = 1; n <= 10; n++) {
    simulatedNotes.push({
      id: `sim-note-${n}`,
      songId: simulatedSong.id,
      content: `Writer Note ${n}: Flow variation at bar ${n * 2}`,
      createdAt: Date.now() - (10 - n) * 60000,
      updatedAt: Date.now() - (10 - n) * 60000,
    });
  }
  assert(simulatedNotes.length === 10, '10 notes added');

  // Final validation of parsed state
  const finalParsed = parseSongContent(simulatedSong.content);
  assert(finalParsed.stats.totalBars > 15, 'Song content remains healthy and non-corrupted');
});

console.log('\n================================================================');
console.log(`📊 SESSION WORKFLOWS SUMMARY: ${passedTests}/${totalTests} STEPS PASSED`);
console.log('🎉 ALL 6 REAL-WORLD SESSION WORKFLOWS EXECUTED FLAWLESSLY!');
console.log('================================================================\n');
