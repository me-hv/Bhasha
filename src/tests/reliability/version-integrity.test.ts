/**
 * BHASHA Phase 11 Reliability Suite: Version Snapshot Integrity & Safety Snapshots
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import {
  saveSong,
  getStoredSongs,
  saveVersionSnapshot,
  getStoredVersions,
  restoreVersionSnapshot,
} from '../../lib/storage/songs';
import { compareLyrics } from '../../lib/utils/diff';
import { Song, SongVersion } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Version Integrity & Safety Snapshots Test Suite\n');

// 1. Version Snapshot Creation & Automatic Safety Snapshots
{
  const activeSong: Song = {
    id: 'song-version-test-1',
    title: 'VERSION TEST TRACK',
    content: '[Verse 1]\nEarly draft line 1\nEarly draft line 2',
    bpm: 90,
    key: 'Am',
    timeSignature: '4/4',
    status: 'DRAFT',
    revision: 1,
    notes: 'Draft note',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSong(activeSong);

  // Save Version 1
  const ver1 = saveVersionSnapshot(activeSong, 'Draft 1 — Opening lines');
  assert(ver1.songId === activeSong.id, 'Version linked to active song');
  assert(ver1.content === activeSong.content, 'Version captured exact lyrics');

  // Update song lyrics and save Version 2
  activeSong.content = '[Verse 1]\nPolished line 1 with rhyme\nPolished line 2 with flow';
  activeSong.revision = 2;
  saveSong(activeSong);
  const ver2 = saveVersionSnapshot(activeSong, 'Draft 2 — Polished lines');

  // Modify active song further without snapshotting
  activeSong.content = '[Verse 1]\nExperimental uncommitted changes';
  activeSong.revision = 3;
  saveSong(activeSong);

  // Now Restore Version 1
  const restoreResult = restoreVersionSnapshot(ver1.id);
  assert(restoreResult !== null, 'Version restore must succeed');
  assert(
    restoreResult.safetySnapshot.isAutoSafetySnapshot === true,
    'Safety snapshot must be flagged as automatic safety snapshot'
  );
  assert(
    restoreResult.safetySnapshot.content === '[Verse 1]\nExperimental uncommitted changes',
    'Safety snapshot preserved experimental changes before overwrite'
  );

  // Verify active song now matches Version 1
  const songs = getStoredSongs();
  const restoredSong = songs.find((s) => s.id === activeSong.id)!;
  assert(restoredSong.content === ver1.content, 'Active song lyrics restored to Version 1');

  // Verify all 3 snapshots exist (ver1, ver2, safetySnapshot)
  const versions = getStoredVersions(activeSong.id);
  assert(versions.length === 3, 'All 3 version snapshots preserved in history');

  console.log('  ✓ 1. Automatic safety snapshot created and verified on restore');
}

// 2. High-Capacity Scaling: 100+ Version Snapshots
{
  const scaleSong: Song = {
    id: 'scale-version-song',
    title: '100 SNAPSHOT SONG',
    content: '[Verse 1]\nBase bar',
    bpm: 92,
    key: 'Cm',
    status: 'IN PROGRESS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSong(scaleSong);

  const startMs = Date.now();
  for (let i = 1; i <= 100; i++) {
    scaleSong.content = `[Verse 1]\nBar variant ${i}: लफ्जों में आग`;
    saveVersionSnapshot(scaleSong, `Snapshot #${i}`);
  }
  const totalDurationMs = Date.now() - startMs;

  const allSnapshots = getStoredVersions(scaleSong.id);
  assert(allSnapshots.length === 100, 'All 100 version snapshots stored');
  assert(totalDurationMs < 500, `Creating 100 snapshots took ${totalDurationMs}ms (avg ${(totalDurationMs / 100).toFixed(2)}ms/snapshot)`);

  // Verify lyric diff between snapshot 1 and snapshot 100
  const snap1 = allSnapshots[allSnapshots.length - 1]; // oldest
  const snap100 = allSnapshots[0]; // newest
  const diff = compareLyrics(snap1.content, snap100.content);
  assert(diff.hasDifferences, 'Diff detected changes between snapshots');
  assert(diff.lines.length > 0, 'Diff returned line comparisons');

  console.log(`  ✓ 2. 100 version snapshots scaled in ${totalDurationMs}ms with accurate lyric diff`);
}

console.log('\n✅ ALL VERSION INTEGRITY & SAFETY SNAPSHOT TESTS PASSED!\n');
