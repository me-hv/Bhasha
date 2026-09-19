/**
 * BHASHA Phase 11 Reliability Suite: Corruption Quarantine & Safe Recovery
 */

import { setupTestStorage, assert } from './setup';
const store = setupTestStorage();

import {
  STORAGE_KEYS,
  safeGetWithDiagnostics,
  emergencyCorruptedBackup,
  getFromStorage,
  setToStorage,
} from '../../lib/storage/storage';
import { getStoredSongs, saveSong } from '../../lib/storage/songs';
import { Song } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Corruption Quarantine & Data Recovery Test Suite\n');

// 1. Simulating LocalStorage JSON Corruption & Emergency Quarantine
{
  const testKey = 'bhasha_songs_v1';
  const rawCorruptedContent = '{"songs": [{"id": "broken-song-1", "title": "Incomplete Record", "content": "Lost';

  // Inject corrupted string into localStorage
  window.localStorage.setItem(testKey, rawCorruptedContent);

  // Attempt read via safeGetWithDiagnostics
  const result = safeGetWithDiagnostics<Song[]>(testKey, []);
  assert(result.corrupted === true, 'Corruption should be detected');
  assert(result.raw === rawCorruptedContent, 'Raw content preserved in diagnostic result');
  assert(Boolean(result.emergencyKey), 'Emergency quarantine backup key generated');

  // Verify that localStorage contains the emergency quarantine key with exact raw content
  const quarantinedRaw = window.localStorage.getItem(result.emergencyKey!);
  assert(
    quarantinedRaw === rawCorruptedContent,
    'Emergency quarantine saved exact raw unparseable content for manual recovery'
  );

  console.log(`  ✓ 1. Corrupted storage quarantined under "${result.emergencyKey}" without throwing unhandled exceptions`);
}

// 2. Recovery & Re-initialization
{
  // Now store valid song data
  const recoveredSong: Song = {
    id: 'recovered-track',
    title: 'RECOVERED ANTHEM',
    content: '[Verse 1]\nRecovered lyrics',
    bpm: 92,
    key: 'Am',
    status: 'IN PROGRESS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSong(recoveredSong);

  // Safe get should now return valid data and corrupted: false
  const freshRead = safeGetWithDiagnostics<Song[]>(STORAGE_KEYS.SONGS, []);
  assert(!freshRead.corrupted, 'Storage is now valid and healthy');
  assert(freshRead.data.some((s) => s.id === 'recovered-track'), 'Recovered song accessible');

  console.log('  ✓ 2. Safe re-initialization and recovery verified');
}

console.log('\n✅ ALL CORRUPTION QUARANTINE & RECOVERY TESTS PASSED!\n');
