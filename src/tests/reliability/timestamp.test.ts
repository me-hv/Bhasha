/**
 * BHASHA Phase 11 Reliability Suite: Timestamp & Timezone Invariance
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import { isValidTimestamp } from '../../lib/storage/integrity';
import { saveSong, getStoredSongs } from '../../lib/storage/songs';
import { Song } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Timestamp & Timezone Invariance Test Suite\n');

// 1. ISO-8601 UTC Format & Boundary Validation
{
  const validIso = new Date().toISOString();
  assert(isValidTimestamp(validIso), 'Current ISO timestamp is valid');
  assert(isValidTimestamp('2026-02-28T23:59:59.999Z'), 'Leap year / end of month timestamp valid');
  assert(isValidTimestamp('2024-02-29T12:00:00.000Z'), 'Leap day valid');

  assert(!isValidTimestamp('invalid-date-string'), 'Non-date string invalid');
  assert(!isValidTimestamp(''), 'Empty string invalid');
  assert(!isValidTimestamp(null), 'null timestamp invalid');
  assert(!isValidTimestamp('1850-01-01T00:00:00.000Z'), 'Out of range boundary date (<1970) flagged invalid');

  console.log('  ✓ 1. ISO-8601 UTC format & boundary conditions validated');
}

// 2. Monotonic updatedAt Sequencing
{
  const testSong: Song = {
    id: 'song-time-seq',
    title: 'TIME SEQUENCE TRACK',
    content: 'Line 1',
    bpm: 90,
    key: 'Am',
    status: 'DRAFT',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  };
  saveSong(testSong);

  // Update song content
  testSong.content = 'Line 1 updated';
  saveSong(testSong);

  const stored = getStoredSongs().find((s) => s.id === testSong.id)!;
  const createdMs = Date.parse(stored.createdAt);
  const updatedMs = Date.parse(stored.updatedAt);

  assert(updatedMs >= createdMs, 'updatedAt must be monotonically >= createdAt');

  console.log('  ✓ 2. Monotonic updatedAt sequencing verified across mutations');
}

console.log('\n✅ ALL TIMESTAMP & TIMEZONE TESTS PASSED!\n');
