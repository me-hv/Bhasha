/**
 * BHASHA Phase 11 Reliability Suite: Deletion Safety & Non-Destructive Archiving
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import {
  saveSong,
  getStoredSongs,
  archiveSong,
  restoreSong,
  deleteSong,
  saveVersionSnapshot,
  getStoredVersions,
  filterSongsByStatus,
} from '../../lib/storage/songs';
import {
  saveWordToLexicon,
  getStoredLexicon,
  removeWordFromLexicon,
} from '../../lib/storage/lexicon';
import {
  saveIdea,
  getStoredIdeas,
  deleteIdea,
} from '../../lib/storage/ideas';
import { Song } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Deletion Safety & Archiving Test Suite\n');

// 1. Archiving vs Hard Deletion
{
  const songToArchive: Song = {
    id: 'song-to-archive-1',
    title: 'OLD ARCHIVE TRACK',
    content: 'Old lyrics',
    bpm: 90,
    key: 'Am',
    status: 'IN PROGRESS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSong(songToArchive);
  saveVersionSnapshot(songToArchive, 'Archive snapshot v1');

  // Archive Song
  archiveSong(songToArchive.id);
  const activeSongs = filterSongsByStatus(getStoredSongs(), 'ALL');
  assert(!activeSongs.some((s) => s.id === songToArchive.id), 'Archived song is hidden from active song list');

  const archivedSongs = filterSongsByStatus(getStoredSongs(), 'ARCHIVED');
  assert(archivedSongs.some((s) => s.id === songToArchive.id), 'Song exists in ARCHIVED view');

  // Versions must still be accessible while archived
  const archivedVersions = getStoredVersions(songToArchive.id);
  assert(archivedVersions.length === 1, 'Version snapshots remain intact while song is archived');

  // Restore Song
  restoreSong(songToArchive.id);
  const activeAfterRestore = filterSongsByStatus(getStoredSongs(), 'ALL');
  assert(activeAfterRestore.some((s) => s.id === songToArchive.id), 'Restored song is back in active song list');

  console.log('  ✓ 1. Non-destructive archiving and restoration verified (history preserved)');
}

// 2. Hard Delete Cascade Cleanup (Versions cleaned, other songs untouched)
{
  const songA: Song = {
    id: 'song-a',
    title: 'SONG A',
    content: 'Song A Lyrics',
    bpm: 90,
    key: 'Am',
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const songB: Song = {
    id: 'song-b',
    title: 'SONG B',
    content: 'Song B Lyrics',
    bpm: 90,
    key: 'Am',
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSong(songA);
  saveSong(songB);

  saveVersionSnapshot(songA, 'Song A snapshot 1');
  saveVersionSnapshot(songA, 'Song A snapshot 2');
  saveVersionSnapshot(songB, 'Song B snapshot 1');

  // Delete Song A
  deleteSong(songA.id);

  const songsAfterDelete = getStoredSongs();
  assert(!songsAfterDelete.some((s) => s.id === songA.id), 'Song A removed from storage');
  assert(songsAfterDelete.some((s) => s.id === songB.id), 'Song B preserved in storage');

  const versionsA = getStoredVersions(songA.id);
  const versionsB = getStoredVersions(songB.id);
  assert(versionsA.length === 0, 'Versions for Song A were cleanly cascaded and deleted');
  assert(versionsB.length === 1, 'Versions for Song B were preserved untouched');

  console.log('  ✓ 2. Hard deletion cleanly cleans orphaned versions without corrupting other songs');
}

// 3. Idea Deletion Independence
{
  const idea = {
    id: 'idea-indep-1',
    title: 'Sample Idea',
    type: 'CONCEPT' as const,
    content: 'Idea content',
    tags: ['Theme'],
    attachedSongIds: ['song-b'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'UNUSED' as const,
  };
  saveIdea(idea);
  assert(getStoredIdeas().some((i) => i.id === idea.id), 'Idea saved');

  deleteIdea(idea.id);
  assert(!getStoredIdeas().some((i) => i.id === idea.id), 'Idea deleted');

  // Verify song-b still exists
  const remainingSongs = getStoredSongs();
  assert(remainingSongs.some((s) => s.id === 'song-b'), 'Song attached to deleted idea is NOT deleted');

  console.log('  ✓ 3. Idea deletion preserves attached songs without cascade side-effects');
}

console.log('\n✅ ALL DELETION & ARCHIVING SAFETY TESTS PASSED!\n');
