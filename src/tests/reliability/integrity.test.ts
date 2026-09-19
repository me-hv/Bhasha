/**
 * BHASHA Phase 11 Reliability Suite: Central Integrity & Validation Engine
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import {
  validateSong,
  validateVersion,
  validateLexiconEntry,
  validateIdea,
  detectOrphans,
  repairOrphans,
  validateProjectIntegrity,
  VALID_KEYS,
  VALID_TIME_SIGNATURES,
} from '../../lib/storage/integrity';
import { Song, BhashaProjectBackup } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Data Integrity & Diagnostics Test Suite\n');

// 1. Valid Song Validation
{
  const validSong: Song = {
    id: 'valid-song-1',
    title: 'ROSHNI',
    content: '[Verse 1]\nअंधेरे में जलती एक रोशनी',
    bpm: 95,
    key: 'Am',
    timeSignature: '4/4',
    status: 'IN PROGRESS',
    revision: 2,
    tags: ['Poetic'],
    notes: 'Vocal warmth',
    sectionNotes: { 'Verse 1': 'Soft acoustic feel' },
    songVocabulary: ['रोशनी', 'अंधेरा'],
    scratchpadNotes: 'Ideas for hook',
    stashedRhymes: ['चांदनी', 'रागिनी'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const diag = validateSong(validSong);
  assert(diag.valid, 'Valid song should pass validation');
  assert(diag.errors.length === 0, 'Valid song should produce 0 fatal errors');
  console.log('  ✓ 1. Valid song validation passed');
}

// 2. Fatal Song Errors (Missing ID, Missing Content)
{
  const invalidSongNoId = { title: 'No ID Track', content: 'Some lyrics' };
  const diag1 = validateSong(invalidSongNoId);
  assert(!diag1.valid, 'Song without ID must be invalid');
  assert(diag1.errors.some(e => e.code === 'MISSING_SONG_ID' && e.fatal), 'Should flag fatal MISSING_SONG_ID');

  const invalidSongNonStringLyrics = { id: 'song-bad', title: 'Bad Content', content: 12345 };
  const diag2 = validateSong(invalidSongNonStringLyrics);
  assert(!diag2.valid, 'Song with non-string content must be invalid');
  assert(diag2.errors.some(e => e.code === 'INVALID_SONG_CONTENT' && e.fatal), 'Should flag fatal INVALID_SONG_CONTENT');
  console.log('  ✓ 2. Fatal song error detection passed');
}

// 3. Musical Key & Time Signature Constraints
{
  assert(VALID_KEYS.has('Am') && VALID_KEYS.has('C#m') && VALID_KEYS.has('F'), 'Standard musical keys recognized');
  assert(VALID_TIME_SIGNATURES.has('4/4') && VALID_TIME_SIGNATURES.has('6/8'), 'Standard time signatures recognized');

  const songWithWeirdKey = {
    id: 'song-key',
    title: 'Key Test',
    content: 'test',
    key: 'H-Major-Fake',
    timeSignature: '13/9',
  };
  const diag = validateSong(songWithWeirdKey);
  assert(diag.warnings.some(w => w.code === 'UNKNOWN_MUSICAL_KEY'), 'Should warn about non-standard musical key');
  assert(diag.warnings.some(w => w.code === 'UNCONVENTIONAL_TIME_SIGNATURE'), 'Should warn about unconventional time signature');
  console.log('  ✓ 3. Musical key & time signature constraints validated');
}

// 4. Song Status Canonicalization & Legacy Map
{
  const songLegacyStatus = {
    id: 'song-status',
    title: 'Legacy Status',
    content: 'test',
    status: 'in progress',
  };
  const diag = validateSong(songLegacyStatus);
  assert(diag.warnings.some(w => w.code === 'LEGACY_SONG_STATUS'), 'Should flag legacy status for auto-repair');
  console.log('  ✓ 4. Song status validation & legacy status mapping verified');
}

// 5. Version Snapshots & Orphan Detection
{
  const knownSongIds = new Set(['song-100', 'song-200']);
  const validVersion = {
    id: 'ver-1',
    songId: 'song-100',
    label: 'Take 1',
    timestamp: new Date().toISOString(),
    content: 'Bar 1\nBar 2',
  };
  const vDiag1 = validateVersion(validVersion, knownSongIds);
  assert(vDiag1.valid, 'Valid version with known song ID should pass');

  const orphanVersion = {
    id: 'ver-orphan',
    songId: 'deleted-song-id',
    label: 'Lost Version',
    timestamp: new Date().toISOString(),
    content: 'Bar 1',
  };
  const vDiag2 = validateVersion(orphanVersion, knownSongIds);
  assert(!vDiag2.valid, 'Orphan version must fail validation when songId does not exist');
  assert(vDiag2.errors.some(e => e.code === 'ORPHAN_VERSION' && e.fatal), 'Should flag fatal ORPHAN_VERSION');
  console.log('  ✓ 5. Version snapshots and orphan version detection passed');
}

// 6. Lexicon & Idea Validation
{
  const knownSongIds = new Set(['song-100', 'song-200']);
  const validLexicon = {
    id: 'w-1',
    devanagari: 'इरादा',
    roman: 'iraada',
    meaning: 'Intention / Resolve',
    tags: ['Mindset'],
    collections: ['Ambition'],
  };
  const lDiag = validateLexiconEntry(validLexicon);
  assert(lDiag.valid, 'Valid lexicon entry should pass');

  const badLexicon = { roman: 'iraada' };
  const lDiagBad = validateLexiconEntry(badLexicon);
  assert(!lDiagBad.valid && lDiagBad.errors.some(e => e.code === 'MISSING_DEVANAGARI_WORD'), 'Missing Devanagari word must be fatal');

  const validIdea = {
    id: 'idea-1',
    title: 'Late Night Train',
    type: 'SCENE',
    content: 'Lone commuter looking outside window',
    tags: ['Midnight', 'City'],
    attachedSongIds: ['song-100'],
  };
  const iDiag = validateIdea(validIdea, knownSongIds);
  assert(iDiag.valid, 'Valid idea should pass');
  console.log('  ✓ 6. Lexicon entry and creative idea validation passed');
}

// 7. Orphan Detection & Non-Destructive Auto-Repair
{
  const testProject: BhashaProjectBackup = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    bhashaVersion: '1.0.0',
    songs: [
      {
        id: 'song-active-1',
        title: 'Active Song',
        content: 'Lyrics here',
        bpm: 90,
        key: 'Am',
        status: 'IN PROGRESS',
        songVocabulary: ['रात', 'ग़ैर-मौजूद-शब्द'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    versions: [
      {
        id: 'ver-valid',
        songId: 'song-active-1',
        label: 'Valid Ver',
        timestamp: new Date().toISOString(),
        content: 'Lyrics here',
      },
      {
        id: 'ver-dangling',
        songId: 'non-existent-song',
        label: 'Dangling Ver',
        timestamp: new Date().toISOString(),
        content: 'Old lyrics',
      },
    ],
    lexicon: [
      {
        id: 'w-1',
        devanagari: 'रात',
        roman: 'raat',
        meaning: 'Night',
        collections: ['Dark Poetry', 'NonExistentCollection'],
      },
    ],
    collections: ['Dark Poetry'],
    ideas: [
      {
        id: 'idea-1',
        title: 'Train Theme',
        type: 'THEME',
        content: 'Commute reflection',
        attachedSongIds: ['song-active-1', 'deleted-song-999'],
        tags: ['City'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'UNUSED',
      },
    ],
  };

  const orphans = detectOrphans(testProject);
  assert(orphans.versions.includes('ver-dangling'), 'Should detect dangling version');
  assert(orphans.ideas.includes('idea-1->deleted-song-999'), 'Should detect dangling idea-song link');
  assert(orphans.collections.includes('रात->NonExistentCollection'), 'Should detect collection referenced by word but not in project collections');

  const { repairedProject, repairs } = repairOrphans(testProject);
  assert(repairs.length >= 2, 'Should record non-destructive repairs');
  assert(
    repairedProject.ideas[0].attachedSongIds?.length === 1 &&
    repairedProject.ideas[0].attachedSongIds[0] === 'song-active-1',
    'Dangling song link removed from idea without deleting the idea'
  );
  assert(repairedProject.collections.includes('NonExistentCollection'), 'Missing collection added automatically to collections list');
  console.log('  ✓ 7. Orphan reference detection and non-destructive repair verified');
}

// 8. Full Project Integrity Report
{
  const fullProject = {
    schemaVersion: 2,
    songs: [
      { id: 's1', title: 'Track 1', content: 'Bar 1', bpm: 92, key: 'Am', status: 'DRAFT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's2', title: 'Track 2', content: 'Bar 2', bpm: 90, key: 'Cm', status: 'IN PROGRESS', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    versions: [
      { id: 'v1', songId: 's1', label: 'Take 1', timestamp: new Date().toISOString(), content: 'Bar 1' }
    ],
    lexicon: [
      { id: 'w1', devanagari: 'हवा', roman: 'hawa', meaning: 'Wind' }
    ],
    collections: ['Nature'],
    ideas: [
      { id: 'i1', title: 'Storm Idea', type: 'CONCEPT', content: 'Storm brewing', tags: ['Nature'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'UNUSED' }
    ],
  };

  const report = validateProjectIntegrity(fullProject);
  assert(report.valid, 'Valid full project must produce valid report');
  assert(report.stats.totalSongs === 2, 'Should report 2 songs');
  assert(report.stats.totalVersions === 1, 'Should report 1 version');
  assert(report.stats.totalLexiconWords === 1, 'Should report 1 word');
  console.log('  ✓ 8. Full project integrity report verified');
}

console.log('\n✅ ALL INTEGRITY & VALIDATION TESTS PASSED!\n');
