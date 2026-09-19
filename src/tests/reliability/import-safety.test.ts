/**
 * BHASHA Phase 11 Reliability Suite: Import Safety & Atomic Commits
 */

import { setupTestStorage, assert } from './setup';
const store = setupTestStorage();

import {
  atomicImportProject,
  generateImportPreview,
  createProjectBackup,
  exportProjectJson,
} from '../../lib/utils/export';
import { getStoredSongs, saveSong } from '../../lib/storage/songs';
import { STORAGE_KEYS, getFromStorage } from '../../lib/storage/storage';
import { Song } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Import Safety & Atomic Transaction Test Suite\n');

// Initialize existing song in storage
const initialSong: Song = {
  id: 'song-existing-1',
  title: 'EXISTING ANTHEM',
  content: '[Verse 1]\nExisting lyrics that must not be lost',
  bpm: 90,
  key: 'Am',
  timeSignature: '4/4',
  status: 'COMPLETE',
  revision: 5,
  tags: ['Classic'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};
saveSong(initialSong);

// 1. Generate Import Preview with conflict detection
{
  const incomingBackup = {
    schemaVersion: 1,
    exportedAt: '2026-02-01T00:00:00.000Z',
    songs: [
      {
        id: 'song-existing-1', // ID collision
        title: 'Existing Anthem', // Title collision (case insensitive)
        content: 'Different lyrics',
        bpm: 95,
        key: 'Cm',
      },
      {
        id: 'song-new-2',
        title: 'Brand New Track',
        content: 'Fresh lyrics',
        bpm: 92,
        key: 'Dm',
      },
    ],
    versions: [],
    lexicon: [{ id: 'w1', devanagari: 'सफ़र', roman: 'safar', meaning: 'Journey' }],
    collections: ['Travel'],
    ideas: [],
  };

  const preview = generateImportPreview(JSON.stringify(incomingBackup));
  assert(preview.valid, 'Import preview should report valid project');
  assert(preview.migrationRequired, 'v1 project requires migration');
  assert(preview.counts.songs === 2, 'Reports 2 incoming songs');
  assert(preview.counts.lexicon === 1, 'Reports 1 incoming word');
  assert(preview.conflicts.duplicateSongTitles.length > 0, 'Detects title collision with existing song');
  assert(preview.conflicts.overwritingExistingIds.length > 0, 'Detects ID collision with existing song');

  console.log('  ✓ 1. Import preview generation and conflict detection verified');
}

// 2. Atomic Import Success (Two-phase commit)
{
  const incomingValidBackup = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    songs: [
      {
        id: 'song-imported-100',
        title: 'IMPORTED MASTERPIECE',
        content: '[Verse 1]\nImported lyrics',
        bpm: 94,
        key: 'Gm',
        status: 'IN PROGRESS',
        revision: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    versions: [],
    lexicon: [{ id: 'w-imp', devanagari: 'मंज़िल', roman: 'manzil', meaning: 'Destination' }],
    collections: ['Milestones'],
    ideas: [],
  };

  const result = atomicImportProject(JSON.stringify(incomingValidBackup));
  assert(result.success, 'Valid project import must succeed');
  assert(result.report?.valid, 'Integrity report confirms valid');

  const storedSongs = getStoredSongs();
  assert(storedSongs.length === 1, 'Storage committed cleanly');
  assert(storedSongs[0].id === 'song-imported-100', 'Imported song exists in storage');
  assert(storedSongs[0].title === 'IMPORTED MASTERPIECE', 'Imported song title is correct');

  console.log('  ✓ 2. Atomic import commit succeeded and updated storage');
}

// 3. Rollback & Abort on Fatal Validation Errors (Zero storage pollution)
{
  // Take snapshot of current valid storage
  const songsBeforeBadImport = getFromStorage<Song[]>(STORAGE_KEYS.SONGS, []);
  assert(songsBeforeBadImport.length === 1, '1 song currently stored');

  const corruptProject = {
    schemaVersion: 2,
    songs: [
      {
        // Fatal: missing id & content is not a string
        title: 'Broken Track',
        content: 99999,
      },
    ],
  };

  const badResult = atomicImportProject(JSON.stringify(corruptProject));
  assert(!badResult.success, 'Corrupt project import must be rejected');
  assert(badResult.error?.includes('Import aborted due to data integrity errors'), 'Error explains validation failure');

  // Verify storage was untouched
  const songsAfterBadImport = getFromStorage<Song[]>(STORAGE_KEYS.SONGS, []);
  assert(songsAfterBadImport.length === songsBeforeBadImport.length, 'Storage songs array was NOT modified');
  assert(songsAfterBadImport[0].id === songsBeforeBadImport[0].id, 'Pre-existing song preserved completely');

  console.log('  ✓ 3. Fatal integrity failure caused atomic abort with zero storage mutation');
}

// 4. Invalid JSON String Rejection
{
  const invalidJson = '{ bad json content ...';
  const badJsonResult = atomicImportProject(invalidJson);
  assert(!badJsonResult.success, 'Invalid JSON must fail import');
  assert(badJsonResult.error?.includes('Failed to parse project JSON'), 'Error identifies JSON syntax failure');

  console.log('  ✓ 4. Malformed JSON string gracefully rejected without throwing unhandled exceptions');
}

console.log('\n✅ ALL IMPORT SAFETY & TRANSACTION TESTS PASSED!\n');
