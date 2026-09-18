/**
 * BHASHA Phase 10: End-to-End Writer Integration Cycle Test
 * Validates the complete creative loop:
 * CREATE SONG → WRITE VERSE → SAVE RHYME WORD → SAVE TO SONG VOCABULARY →
 * SAVE IDEA → ATTACH IDEA TO SONG → WRITE HOOK → SAVE VERSION → MODIFY HOOK →
 * COMPARE VERSIONS → SAVE NEW VERSION → RESTORE V1 (SAFETY SNAPSHOT) →
 * EXPORT PROJECT → IMPORT INTO CLEAN ENVIRONMENT → VERIFY EVERYTHING
 */

// In-memory localStorage mock for Node/CLI environment
if (typeof globalThis.window === 'undefined') {
  const store = new Map<string, string>();
  (globalThis as any).window = {
    localStorage: {
      getItem: (key: string) => store.get(key) || null,
      setItem: (key: string, value: string) => store.set(key, String(value)),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
  };
}

import {
  getStoredSongs,
  saveSong,
  createNewSong,
  duplicateSong,
  saveVersionSnapshot,
  getStoredVersions,
  restoreVersionSnapshot,
} from '../../lib/storage/songs';
import {
  getStoredLexicon,
  saveWordToLexicon,
  isWordSavedInLexicon,
  createCollection,
  toggleWordCollection,
  addWordToSongVocabulary,
  getRecentWords,
} from '../../lib/storage/lexicon';
import {
  getStoredIdeas,
  saveIdea,
  attachIdeaToSong,
  attachWordToIdea,
} from '../../lib/storage/ideas';
import { getRhymes, getWord } from '../../lib/language-engine/rhyme-engine';
import { parseSongContent } from '../../lib/language-engine/verse-analyzer';
import { compareLyrics } from '../../lib/utils/diff';
import {
  exportProjectJson,
  validateAndImportProjectJson,
  formatSongTxt,
  formatSongMarkdown,
} from '../../lib/utils/export';
import { Song, SongVersion, CreativeIdea, SavedWord, BhashaProjectBackup } from '../../types';
import { getFromStorage } from '../../lib/storage/storage';

interface TestResult {
  step: string;
  passed: boolean;
  error?: string;
}

const steps: TestResult[] = [];

function assertStep(condition: boolean, step: string, detail?: string) {
  if (condition) {
    steps.push({ step, passed: true });
    console.log(`  ✓ ${step}`);
  } else {
    steps.push({ step, passed: false, error: detail || 'Step failed' });
    console.error(`  ✗ FAIL: ${step} (${detail || ''})`);
  }
}

console.log('\n================================================================');
console.log('  BHASHA PHASE 10: END-TO-END WRITER INTEGRATION CYCLE TEST');
console.log('================================================================\n');

// Initialize clean slate
window.localStorage.clear();

// -----------------------------------------------------------------------------
// STEP 1: CREATE SONG
// -----------------------------------------------------------------------------
console.log('Step 1: CREATE SONG');
let song = createNewSong('DARYA E KHOON', 94, 'G#m');
song.mood = 'Dark, Philosophical';
song.tags = ['Underground', 'Conscious Hip-Hop'];
song.notes = 'Concept: Crossing the inner river of blood and doubt to reach clarity.';
song.sectionNotes = {
  'Verse 1': 'Intimate, close-mic delivery with minimal 808s.',
};
saveSong(song);

assertStep(song.id.startsWith('song-'), 'Step 1.1: Song initialized with unique project ID');
assertStep(song.title === 'DARYA E KHOON', 'Step 1.2: Song title stored correctly');
assertStep(song.bpm === 94 && song.key === 'G#m', 'Step 1.3: Song tempo and key stored correctly');

// -----------------------------------------------------------------------------
// STEP 2: WRITE VERSE
// -----------------------------------------------------------------------------
console.log('\nStep 2: WRITE VERSE');
const verseLyrics = `[Verse 1]
सन्नाटे की चादर ओढ़े बैठा हूँ मैं रात में
हर एक सवाल का जवाब छुपा है मेरी बात में
काली ये राहें और तन्हा ये सफर है
कलम से निकली जो बात वो असर है`;

song.content = verseLyrics;
saveSong(song);

const parsedVerse = parseSongContent(song.content);
assertStep(parsedVerse.sections.length === 1, 'Step 2.1: Verse 1 section detected');
const verseBars = parsedVerse.lines.filter((l) => l.barNumber !== null);
assertStep(verseBars.length === 4, 'Step 2.2: 4 bars parsed and analyzed');
assertStep((verseBars[0]?.syllables ?? 0) > 0, 'Step 2.3: Real-time phonetic syllable counting active');

// -----------------------------------------------------------------------------
// STEP 3: DISCOVER & SAVE RHYME WORD TO LEXICON
// -----------------------------------------------------------------------------
console.log('\nStep 3: SAVE RHYME WORD TO LEXICON');
const rhymesForRaat = getRhymes('रात');
assertStep(rhymesForRaat.perfect.length > 0, 'Step 3.1: Perfect rhymes discovered for anchor "रात"');

saveWordToLexicon({
  devanagari: 'जज़्बात',
  roman: 'jazbaat',
  meaning: 'deep sentiments, raw emotion',
  tags: ['emotion', 'urdu'],
  personalNote: 'Anchor rhyme candidate for Verse 2 climax',
  sourceSongId: song.id,
  sourceContext: 'Written during DARYA E KHOON session',
});

assertStep(isWordSavedInLexicon('जज़्बात'), 'Step 3.2: Word saved to personal lexicon bank');
const collections = createCollection('CONSCIOUS WORDS');
toggleWordCollection('जज़्बात', 'CONSCIOUS WORDS');
const savedLexicon = getStoredLexicon();
const savedWord = savedLexicon.find((w) => w.devanagari === 'जज़्बात');
assertStep(savedWord?.collections?.includes('CONSCIOUS WORDS') ?? false, 'Step 3.3: Word filed in custom collection');

// -----------------------------------------------------------------------------
// STEP 4: SAVE TO SONG VOCABULARY BANK
// -----------------------------------------------------------------------------
console.log('\nStep 4: SAVE TO SONG VOCABULARY BANK');
addWordToSongVocabulary(song.id, 'सन्नाटा');
addWordToSongVocabulary(song.id, 'जज़्बात');
addWordToSongVocabulary(song.id, 'असर');
addWordToSongVocabulary(song.id, 'सफर');

song = getStoredSongs().find((s) => s.id === song.id)!;
assertStep(song.songVocabulary?.length === 4, 'Step 4.1: 4 words curated in Song Vocabulary Bank');
assertStep(song.songVocabulary?.includes('जज़्बात') ?? false, 'Step 4.2: Target anchor word linked to song');

// -----------------------------------------------------------------------------
// STEP 5: SAVE CREATIVE IDEA & ATTACH TO SONG
// -----------------------------------------------------------------------------
console.log('\nStep 5: SAVE CREATIVE IDEA & ATTACH TO SONG');
saveIdea({
  id: 'idea-darya-hook-concept',
  title: 'River of Fire Hook Concept',
  type: 'CONCEPT',
  content: 'पार करना है दरिया तो पानी में आग लगानी होगी। खामोश बैठ के किनारे जिंदगी नहीं कटती।',
  tags: ['hook-seed', 'defiance'],
  attachedSongIds: [song.id],
  relatedWords: ['दरिया', 'आग', 'किनारे', 'सन्नाटा'],
});

const storedIdeas = getStoredIdeas();
const attachedIdea = storedIdeas.find((i) => i.id === 'idea-darya-hook-concept');
assertStep(attachedIdea !== undefined, 'Step 5.1: Creative Idea saved in private repository');
assertStep(attachedIdea?.attachedSongIds.includes(song.id) ?? false, 'Step 5.2: Idea explicitly linked to song');

// -----------------------------------------------------------------------------
// STEP 6: WRITE HOOK
// -----------------------------------------------------------------------------
console.log('\nStep 6: WRITE HOOK');
const hookLyrics = `
[Hook]
बहता ये दरिया खूं का, रुकना मना है
इस अंधेरी रात में चलना ही अपनी रज़ा है
खोया जो कल था वो आज वापस पाना है
ज़माने को अपनी औकात दिखाना है`;

song.content = `${song.content}\n${hookLyrics}`;
song.sectionNotes['Hook'] = 'High octane vocal delivery, double tracking on "मना है" and "रज़ा है".';
saveSong(song);

const parsedSongWithHook = parseSongContent(song.content);
assertStep(parsedSongWithHook.sections.length === 2, 'Step 6.1: Both Verse 1 and Hook sections parsed');
const allBars = parsedSongWithHook.lines.filter((l) => l.barNumber !== null);
assertStep(allBars.length === 8, 'Step 6.2: 8 total bars written and parsed');

// -----------------------------------------------------------------------------
// STEP 7: SAVE VERSION 1 SNAPSHOT
// -----------------------------------------------------------------------------
console.log('\nStep 7: SAVE VERSION 1 SNAPSHOT');
const v1 = saveVersionSnapshot(song, 'V1 - First Draft with Hook');
assertStep(v1.label === 'V1 - First Draft with Hook', 'Step 7.1: Named snapshot V1 created');
assertStep(v1.content === song.content, 'Step 7.2: V1 content snapshot matches song lyrics');
assertStep(v1.songVocabulary?.length === 4, 'Step 7.3: V1 snapshot captures song vocabulary bank');

// -----------------------------------------------------------------------------
// STEP 8: MODIFY HOOK & COMPARE VERSIONS
// -----------------------------------------------------------------------------
console.log('\nStep 8: MODIFY HOOK & COMPARE VERSIONS');
const modifiedHookLyrics = `[Verse 1]
सन्नाटे की चादर ओढ़े बैठा हूँ मैं रात में
हर एक सवाल का जवाब छुपा है मेरी बात में
काली ये राहें और तन्हा ये सफर है
कलम से निकली जो बात वो असर है

[Hook]
बहता ये दरिया खूं का, सीने में आग है
सोया हुआ जो कल था आज वो जाग है
खोया जो कल था वो आज वापस पाना है
ज़माने को अपनी असली औकात दिखाना है`;

song.content = modifiedHookLyrics;
saveSong(song);

const diffResult = compareLyrics(v1.content, song.content);
assertStep(diffResult.hasDifferences === true, 'Step 8.1: Diff engine identifies lyric modifications');
assertStep(diffResult.changedCount >= 2, 'Step 8.2: Revised lyric bars identified as changed');
assertStep(diffResult.lines.some((l) => l.type === 'changed' && l.lineB?.includes('सीने में आग है')), 'Step 8.3: Specific bar revision tracked accurately');

// -----------------------------------------------------------------------------
// STEP 9: SAVE VERSION 2 SNAPSHOT
// -----------------------------------------------------------------------------
console.log('\nStep 9: SAVE VERSION 2 SNAPSHOT');
const v2 = saveVersionSnapshot(song, 'V2 - Polished Hook');
assertStep(v2.label === 'V2 - Polished Hook', 'Step 9.1: Named snapshot V2 created');
const songVersions = getStoredVersions(song.id);
assertStep(songVersions.length === 2, 'Step 9.2: 2 distinct versions in version history');

// -----------------------------------------------------------------------------
// STEP 10: RESTORE V1 & VERIFY AUTOMATIC SAFETY SNAPSHOT
// -----------------------------------------------------------------------------
console.log('\nStep 10: RESTORE V1 & VERIFY SAFETY SNAPSHOT');
const restoreResult = restoreVersionSnapshot(v1.id);
assertStep(restoreResult !== null, 'Step 10.1: Version restore executed');
assertStep(restoreResult?.restoredSong.content === v1.content, 'Step 10.2: Active song content reverted to V1');

const allVersionsAfterRestore = getStoredVersions(song.id);
const autoSafety = allVersionsAfterRestore.find((v) => v.label.startsWith('Before restore'));
assertStep(autoSafety !== undefined, 'Step 10.3: Automatic safety snapshot generated before restore');
assertStep(autoSafety?.content === modifiedHookLyrics, 'Step 10.4: Safety snapshot captured the overwritten V2 lyrics safely');

// -----------------------------------------------------------------------------
// STEP 11: EXPORT ENTIRE PROJECT BACKUP
// -----------------------------------------------------------------------------
console.log('\nStep 11: EXPORT ENTIRE PROJECT BACKUP');
const projectJsonStr = exportProjectJson();
assertStep(typeof projectJsonStr === 'string' && projectJsonStr.length > 50, 'Step 11.1: Project exported as valid JSON string');
const parsedBackup: BhashaProjectBackup = JSON.parse(projectJsonStr);
assertStep(parsedBackup.schemaVersion === 1, 'Step 11.2: Backup exported in Schema v1');
assertStep(parsedBackup.songs.length >= 1, 'Step 11.3: Backup includes all active songs');
assertStep(parsedBackup.versions.length >= 3, 'Step 11.4: Backup includes all version snapshots (V1, V2, Safety)');
assertStep(parsedBackup.lexicon.length >= 1, 'Step 11.5: Backup includes saved lexicon bank');
assertStep(parsedBackup.ideas.length >= 1, 'Step 11.6: Backup includes private creative ideas');

// -----------------------------------------------------------------------------
// STEP 12: IMPORT INTO CLEAN ENVIRONMENT & VERIFY EVERYTHING
// -----------------------------------------------------------------------------
console.log('\nStep 12: IMPORT INTO CLEAN ENVIRONMENT & VERIFY EVERYTHING');
// Wipe localStorage to simulate clean install or secondary device
window.localStorage.clear();
assertStep(getFromStorage<Song[]>('bhasha_songs_v1', []).length === 0, 'Step 12.1: Local storage completely wiped');

const importResult = validateAndImportProjectJson(projectJsonStr);
assertStep(importResult.success === true, 'Step 12.2: Backup file successfully validated and imported');

const importedSongs = getStoredSongs();
const restoredSong = importedSongs.find((s) => s.id === song.id);
assertStep(restoredSong !== undefined, 'Step 12.3: Song restored with identical ID');
assertStep(restoredSong?.title === 'DARYA E KHOON', 'Step 12.4: Song title preserved');
assertStep(restoredSong?.bpm === 94 && restoredSong?.key === 'G#m', 'Step 12.5: Tempo and Key preserved');
assertStep(restoredSong?.notes === song.notes, 'Step 12.6: Creative notes preserved');
assertStep(restoredSong?.sectionNotes?.['Hook'] !== undefined, 'Step 12.7: Section-level notes preserved');
assertStep(restoredSong?.songVocabulary?.includes('जज़्बात') ?? false, 'Step 12.8: Song vocabulary bank preserved');

const importedVersions = getStoredVersions(song.id);
assertStep(importedVersions.length >= 3, 'Step 12.9: All version history restored');

const importedLexicon = getStoredLexicon();
const restoredWord = importedLexicon.find((w) => w.devanagari === 'जज़्बात');
assertStep(restoredWord !== undefined, 'Step 12.10: Lexicon entry restored');
assertStep(restoredWord?.personalNote === 'Anchor rhyme candidate for Verse 2 climax', 'Step 12.11: Personal word note preserved');

const importedIdeas = getStoredIdeas();
const restoredIdea = importedIdeas.find((i) => i.id === 'idea-darya-hook-concept');
assertStep(restoredIdea !== undefined, 'Step 12.12: Creative idea restored');
assertStep(restoredIdea?.attachedSongIds.includes(song.id) ?? false, 'Step 12.13: Idea-song link intact');

// -----------------------------------------------------------------------------
// Final Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
const total = steps.length;
const passed = steps.filter((s) => s.passed).length;
const failed = total - passed;
console.log(`E2E INTEGRATION CYCLE: ${total} STEPS | PASSED: ${passed} | FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
