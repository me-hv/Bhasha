/**
 * BHASHA Phase 10: Songwriter Workspace Test Suite
 * Validates all 25 criteria for the songwriter operating environment,
 * song library, versioning, lexicon collections, creative ideas, and project portability.
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
  deleteSong,
  archiveSong,
  restoreSong,
  duplicateSong,
  saveVersionSnapshot,
  getStoredVersions,
  restoreVersionSnapshot,
  deleteVersionSnapshot,
  searchSongs,
  filterSongsByStatus,
} from '../../lib/storage/songs';
import {
  getStoredLexicon,
  saveWordToLexicon,
  removeWordFromLexicon,
  isWordSavedInLexicon,
  getStoredCollections,
  createCollection,
  toggleWordCollection,
  getRecentWords,
  recordWordInteraction,
} from '../../lib/storage/lexicon';
import {
  getStoredIdeas,
  saveIdea,
  deleteIdea,
  attachIdeaToSong,
  attachWordToIdea,
} from '../../lib/storage/ideas';
import { searchService } from '../../lib/services/search-service';
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
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, detail?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } else {
    results.push({ name, passed: false, error: detail || 'Assertion failed' });
    console.error(`  ✗ FAIL: ${name} (${detail || ''})`);
  }
}

console.log('\n======================================================');
console.log('  BHASHA PHASE 10: 25 WORKSPACE CRITERIA TEST SUITE');
console.log('======================================================\n');

// Clean storage
window.localStorage.clear();

// -----------------------------------------------------------------------------
// 1. Song Creation
// -----------------------------------------------------------------------------
console.log('1. Song Creation:');
const song1: Song = {
  id: 'song-c1-dastak',
  title: 'DASTAK (THE KNOCK)',
  content: `[Verse 1]\nरात के अंधेरे में एक दस्तक हुई\nदिल की वीरानियों में हरकत हुई`,
  bpm: 88,
  key: 'Dm',
  timeSignature: '4/4',
  status: 'IN PROGRESS',
  tags: ['Underground', 'Poetic', 'Acoustic'],
  mood: 'Melancholic',
  notes: 'Write this from the perspective of an unexpected visitor at 3 AM.',
  sectionNotes: {
    'Verse 1': 'Soft whispers, build up dynamics towards bar 8.',
  },
  songVocabulary: ['दस्तक', 'हरकत', 'वीरानियों'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
saveSong(song1);
const allSongs1 = getStoredSongs();
const fetchedSong1 = allSongs1.find((s) => s.id === song1.id);
assert(fetchedSong1 !== undefined, 'Song is persisted with custom ID');
assert(fetchedSong1?.title === 'DASTAK (THE KNOCK)', 'Persisted song title matches');
assert(fetchedSong1?.bpm === 88 && fetchedSong1?.key === 'Dm', 'BPM and Key are persisted accurately');
assert(fetchedSong1?.mood === 'Melancholic', 'Song mood metadata is preserved');
assert(fetchedSong1?.songVocabulary?.includes('दस्तक') ?? false, 'Song vocabulary is initialized');

// -----------------------------------------------------------------------------
// 2. Song Editing
// -----------------------------------------------------------------------------
console.log('\n2. Song Editing:');
const editedSong1: Song = {
  ...fetchedSong1!,
  content: `${fetchedSong1!.content}\nखामोशी से बातें करने लगा साया\nजो कभी गया था आज फिर लौट आया`,
  bpm: 90,
  songVocabulary: [...(fetchedSong1!.songVocabulary || []), 'खामोशी', 'साया'],
};
saveSong(editedSong1);
const reFetchedSong1 = getStoredSongs().find((s) => s.id === song1.id);
assert(reFetchedSong1?.bpm === 90, 'BPM edit successfully saved');
assert(reFetchedSong1?.content.includes('खामोशी से बातें'), 'Lyrics append is preserved');
assert(reFetchedSong1?.songVocabulary?.includes('साया') ?? false, 'Updated song vocabulary preserved');

// -----------------------------------------------------------------------------
// 3. Song Search
// -----------------------------------------------------------------------------
console.log('\n3. Song Search:');
const song2: Song = {
  id: 'song-c3-junoon',
  title: 'JUNOON E BEKHUDI',
  content: `[Verse 1]\nजुनून है रगों में आग है`,
  bpm: 140,
  key: 'F#m',
  timeSignature: '4/4',
  status: 'DRAFT',
  tags: ['Trap', 'Aggressive'],
  mood: 'Energetic',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
saveSong(song2);
const searchResultsTitle = searchSongs(getStoredSongs(), 'JUNOON');
assert(searchResultsTitle.length === 1 && searchResultsTitle[0].id === song2.id, 'Search by title finds exact matches');
const searchResultsTag = searchSongs(getStoredSongs(), 'Trap');
assert(searchResultsTag.length === 1 && searchResultsTag[0].id === song2.id, 'Search by tag finds matches');

// -----------------------------------------------------------------------------
// 4. Lyric Search
// -----------------------------------------------------------------------------
console.log('\n4. Lyric Search:');
const searchResultsLyric = searchSongs(getStoredSongs(), 'दस्तक हुई');
assert(searchResultsLyric.length === 1 && searchResultsLyric[0].id === song1.id, 'Search queries deep lyric text');

// -----------------------------------------------------------------------------
// 5. Song Duplication (Deep Copy)
// -----------------------------------------------------------------------------
console.log('\n5. Song Duplication:');
const duplicated = duplicateSong(song1.id);
assert(duplicated !== null, 'Duplication succeeds');
assert(duplicated!.id !== song1.id, 'Duplicated song receives a fresh unique ID');
assert(duplicated!.title.includes('(Copy)'), 'Duplicated song title appends (Copy)');
assert(duplicated!.content === editedSong1.content, 'Duplicated song preserves lyrics intact');
// Ensure deep copy isolation
duplicated!.songVocabulary?.push('अलग_शब्द');
saveSong(duplicated!);
const originalAfterDup = getStoredSongs().find((s) => s.id === song1.id);
assert(!originalAfterDup?.songVocabulary?.includes('अलग_शब्द'), 'Duplication is deep: mutating copy does not mutate original');

// -----------------------------------------------------------------------------
// 6. Archive Song
// -----------------------------------------------------------------------------
console.log('\n6. Archive Song:');
archiveSong(song2.id);
const archivedList = getStoredSongs();
const archivedSong = archivedList.find((s) => s.id === song2.id);
assert(archivedSong?.status === 'ARCHIVED', 'Archived song status is ARCHIVED');
const activeSongs = filterSongsByStatus(archivedList, 'ALL');
assert(!activeSongs.some((s) => s.id === song2.id), 'Active filter excludes ARCHIVED songs');

// -----------------------------------------------------------------------------
// 7. Restore Song
// -----------------------------------------------------------------------------
console.log('\n7. Restore Song:');
restoreSong(song2.id);
const restoredList = getStoredSongs();
const restoredSong = restoredList.find((s) => s.id === song2.id);
assert(restoredSong?.status === 'IN PROGRESS', 'Restored song transitions from ARCHIVED to active status');

// -----------------------------------------------------------------------------
// 8. Version Creation
// -----------------------------------------------------------------------------
console.log('\n8. Version Creation:');
const v1 = saveVersionSnapshot(
  reFetchedSong1!,
  'Initial 2-Bar Draft'
);
assert(v1.id.startsWith('ver-'), 'Version snapshot receives unique ID');
assert(v1.label === 'Initial 2-Bar Draft', 'Version snapshot name/label preserved');
assert(v1.content === reFetchedSong1!.content, 'Version snapshot captures full lyric state');

// -----------------------------------------------------------------------------
// 9. Version Comparison (Lyric Diff)
// -----------------------------------------------------------------------------
console.log('\n9. Version Comparison:');
const newLyrics = `[Verse 1]\nरात के अंधेरे में एक दस्तक हुई\nदिल की वीरानियों में हरकत हुई\n(नया हुक) ये शहर नहीं सोता कभी\nजो कभी गया था आज फिर लौट आया`;
const diff = compareLyrics(v1.content, newLyrics);
assert(diff.hasDifferences === true, 'Diff accurately detects modified lyrics');
assert(diff.changedCount > 0 || diff.addedCount > 0, 'Diff reports changed or added lines');
assert(diff.lines.some((l) => l.type === 'changed' || l.type === 'added'), 'Diff marks modified sections correctly');

// Also test explicit line addition
const additionLyrics = `${v1.content}\n[Outro]\nसफर अभी बाकी है`;
const additionDiff = compareLyrics(v1.content, additionLyrics);
assert(additionDiff.addedCount >= 1, 'Diff detects explicitly added bars');
assert(additionDiff.lines.some((l) => l.type === 'added' && l.lineB?.includes('सफर अभी बाकी है')), 'Diff identifies added line text');

// -----------------------------------------------------------------------------
// 10. Version Restoration
// -----------------------------------------------------------------------------
console.log('\n10. Version Restoration:');
// First mutate current song lyrics
saveSong({ ...reFetchedSong1!, content: newLyrics });
const restoreRes = restoreVersionSnapshot(v1.id);
assert(restoreRes !== null, 'Restore function executes successfully');
assert(restoreRes?.restoredSong.content === v1.content, 'Restored song content matches version 1 lyrics exactly');

// -----------------------------------------------------------------------------
// 11. Safety Snapshot on Restore
// -----------------------------------------------------------------------------
console.log('\n11. Safety Snapshot on Restore:');
const versionsAfterRestore = getStoredVersions(song1.id);
const safetySnapshot = versionsAfterRestore.find((v) => v.label.startsWith('Before restore'));
assert(safetySnapshot !== undefined, 'Safety snapshot was automatically created before restoration');
assert(safetySnapshot?.content === newLyrics, 'Safety snapshot preserved the lyrics that were overwritten');

// -----------------------------------------------------------------------------
// 12. Notes Management (Song & Section Level)
// -----------------------------------------------------------------------------
console.log('\n12. Notes Management:');
const songWithNotes: Song = {
  ...restoreRes!.restoredSong,
  notes: 'Creative premise: A conversation between shadow and light.',
  sectionNotes: {
    'Verse 1': 'Keep flow steady at 16th notes.',
    'Hook': 'Chant style with choir harmonies.',
  },
};
saveSong(songWithNotes);
const verifiedNotesSong = getStoredSongs().find((s) => s.id === song1.id);
assert(verifiedNotesSong?.notes?.includes('shadow and light') ?? false, 'Creative song notes saved');
assert(verifiedNotesSong?.sectionNotes?.['Hook'] === 'Chant style with choir harmonies.', 'Section notes saved per section');

// -----------------------------------------------------------------------------
// 13. Lexicon Save
// -----------------------------------------------------------------------------
console.log('\n13. Lexicon Save:');
saveWordToLexicon({
  devanagari: 'जज़्बात',
  roman: 'jazbaat',
  meaning: 'emotions, deep sentiments',
  tags: ['emotion', 'urdu'],
  personalNote: 'Best for reflective second verse.',
});
assert(isWordSavedInLexicon('जज़्बात'), 'Word saved to personal lexicon');
const allSavedWords = getStoredLexicon();
const savedWordEntry = allSavedWords.find((w) => w.devanagari === 'जज़्बात');
assert(savedWordEntry !== undefined, 'Saved word retrieved from lexicon storage');

// -----------------------------------------------------------------------------
// 14. Lexicon Collections
// -----------------------------------------------------------------------------
console.log('\n14. Lexicon Collections:');
const collectionsList = createCollection('Poetic Urdu Bars');
assert(collectionsList.includes('POETIC URDU BARS'), 'Custom collection created');
toggleWordCollection('जज़्बात', 'POETIC URDU BARS');
const lexiconAfterCollection = getStoredLexicon();
const wordWithColl = lexiconAfterCollection.find((w) => w.devanagari === 'जज़्बात');
assert(wordWithColl?.collections?.includes('POETIC URDU BARS') ?? false, 'Word assigned to custom collection');

// -----------------------------------------------------------------------------
// 15. Personal Word Notes
// -----------------------------------------------------------------------------
console.log('\n15. Personal Word Notes:');
saveWordToLexicon({
  devanagari: 'जज़्बात',
  personalNote: 'Use in bar 4 rhyming with हालात and औकात',
  tags: ['emotion', 'urdu', 'climax'],
});
const updatedWord = getStoredLexicon().find((w) => w.devanagari === 'जज़्बात');
assert(updatedWord?.personalNote?.includes('bar 4') ?? false, 'Personal usage notes saved to word');
assert(updatedWord?.tags?.includes('climax') ?? false, 'Personal tags added to word');

// -----------------------------------------------------------------------------
// 16. Song Vocabulary Bank
// -----------------------------------------------------------------------------
console.log('\n16. Song Vocabulary:');
const songWithVocab = getStoredSongs().find((s) => s.id === song1.id)!;
assert(songWithVocab.songVocabulary?.length! >= 3, 'Song vocabulary bank holds curated word list');
assert(songWithVocab.songVocabulary?.includes('दस्तक') ?? false, 'Target word present in song vocabulary bank');

// -----------------------------------------------------------------------------
// 17. Ideas Management
// -----------------------------------------------------------------------------
console.log('\n17. Creative Ideas:');
const ideaList = saveIdea({
  id: 'idea-midnight-shadow',
  title: 'Midnight Shadow Couplet',
  content: 'साए से बात की तो उसने भी मुंह फेर लिया,\nरात ने अपनी बाहों में मुझे घेर लिया।',
  type: 'COUPLET',
  tags: ['midnight', 'solitude'],
  attachedSongIds: [song1.id],
  relatedWords: ['साया', 'रात'],
});
const storedIdeas = getStoredIdeas();
const idea1 = storedIdeas.find((i) => i.title === 'Midnight Shadow Couplet');
assert(idea1 !== undefined, 'Idea persisted in storage');

// -----------------------------------------------------------------------------
// 18. Idea-Song Relationships
// -----------------------------------------------------------------------------
console.log('\n18. Idea-Song Relationship:');
attachIdeaToSong(idea1!.id, song1.id);
const updatedIdeasForSong = getStoredIdeas().filter((i) => i.attachedSongIds.includes(song1.id));
assert(updatedIdeasForSong.length >= 1 && updatedIdeasForSong.some((i) => i.id === idea1!.id), 'Idea linked to attached song ID');

// -----------------------------------------------------------------------------
// 19. Idea-Word Relationships
// -----------------------------------------------------------------------------
console.log('\n19. Idea-Word Relationship:');
attachWordToIdea(idea1!.id, 'वीरान');
const updatedIdeasForWord = getStoredIdeas().filter((i) => i.relatedWords.includes('वीरान'));
assert(updatedIdeasForWord.length >= 1, 'Idea retrieved by linked keyword/word');

// -----------------------------------------------------------------------------
// 20. Global Search
// -----------------------------------------------------------------------------
console.log('\n20. Global Search:');
const allSongsNow = getStoredSongs();
const allLexNow = getStoredLexicon();
const allIdeasNow = getStoredIdeas();
const searchHits = searchService.globalSearch('दस्तक', allSongsNow, allLexNow, allIdeasNow);
assert(searchHits.songs.length >= 1, 'Global search returns song title/content match');

const lyricHits = searchService.globalSearch('अंधेरे', allSongsNow, allLexNow, allIdeasNow);
assert(lyricHits.songs.some((s) => s.matchType === 'lyrics'), 'Global search finds exact lyric line matches');

// -----------------------------------------------------------------------------
// 21. Project Export
// -----------------------------------------------------------------------------
console.log('\n21. Project Export:');
const projectJsonStr = exportProjectJson();
assert(typeof projectJsonStr === 'string' && projectJsonStr.length > 50, 'Project backup exported as valid JSON string');
const parsedBackup: BhashaProjectBackup = JSON.parse(projectJsonStr);
assert(parsedBackup.schemaVersion === 1, 'Project backup schemaVersion is 1');
assert(parsedBackup.bhashaVersion === '1.0.0', 'BHASHA version matches 1.0.0');
assert(parsedBackup.songs.length >= 2, 'Export contains all created songs');
assert(parsedBackup.lexicon.length >= 1, 'Export contains saved lexicon');
assert(parsedBackup.ideas.length >= 1, 'Export contains creative ideas');
assert(parsedBackup.versions.length >= 2, 'Export contains version snapshots');

// -----------------------------------------------------------------------------
// 22. Project Import in Clean Environment
// -----------------------------------------------------------------------------
console.log('\n22. Project Import:');
// Wipe localStorage completely
window.localStorage.clear();
assert(getFromStorage<Song[]>('bhasha_songs_v1', []).length === 0, 'Storage wiped clean');

const importResult = validateAndImportProjectJson(projectJsonStr);
assert(importResult.success === true, 'Valid project JSON imports successfully');
assert(importResult.counts?.songs === parsedBackup.songs.length, 'Imported songs count matches backup');
assert(importResult.counts?.lexicon === parsedBackup.lexicon.length, 'Imported lexicon count matches backup');
assert(importResult.counts?.ideas === parsedBackup.ideas.length, 'Imported ideas count matches backup');
assert(importResult.counts?.versions === parsedBackup.versions.length, 'Imported versions count matches backup');

// -----------------------------------------------------------------------------
// 23. Schema Validation & Rejection of Corrupted Files
// -----------------------------------------------------------------------------
console.log('\n23. Schema Validation:');
const corruptJson = '{"schemaVersion": "invalid", "songs": "not-an-array"}';
const invalidImport = validateAndImportProjectJson(corruptJson);
assert(invalidImport.success === false, 'Invalid schema structure is safely rejected');
assert(invalidImport.error !== undefined, 'Descriptive error message returned for invalid JSON');

// -----------------------------------------------------------------------------
// 24. Data Integrity & Loss Prevention
// -----------------------------------------------------------------------------
console.log('\n24. Data Integrity:');
const restoredImportSongs = getStoredSongs();
const originalDastak = restoredImportSongs.find((s) => s.id === song1.id);
assert(originalDastak !== undefined, 'Original song preserved across export-import cycle');
assert(originalDastak?.content === songWithNotes.content, 'Lyric content perfectly identical after full roundtrip');
assert(originalDastak?.bpm === 90, 'Metadata intact after roundtrip');

// -----------------------------------------------------------------------------
// 25. Offline & Local-First Execution
// -----------------------------------------------------------------------------
console.log('\n25. Offline Execution:');
const txtExport = formatSongTxt(originalDastak!);
assert(txtExport.includes('DASTAK (THE KNOCK)'), 'Plain text export generated synchronously in memory');
assert(txtExport.includes('BPM: 90'), 'Plain text export includes metadata header');
const mdExport = formatSongMarkdown(originalDastak!);
assert(mdExport.includes('# DASTAK (THE KNOCK)'), 'Markdown export generated synchronously without network');

// -----------------------------------------------------------------------------
// Final Summary
// -----------------------------------------------------------------------------
console.log('\n======================================================');
const totalTests = results.length;
const passedTests = results.filter((r) => r.passed).length;
const failedTests = totalTests - passedTests;
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
