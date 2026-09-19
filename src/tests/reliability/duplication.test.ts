/**
 * BHASHA Phase 11 Reliability Suite: Song Duplication & Deep Memory Isolation
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import {
  saveSong,
  getStoredSongs,
  duplicateSong,
  createNewSong,
} from '../../lib/storage/songs';
import { Song } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Song Duplication & Isolation Test Suite\n');

// 1. Memory Isolation & Mutability Independence
{
  const sourceSong: Song = {
    id: 'source-track-1',
    title: 'ORIGINAL ANTHEM',
    content: `[Verse 1]
रात में जलता सवाल मेरे साथ
शहर सो रहा लेकिन आँखों में रात
[Hook]
ये शहर कंक्रीट का यहाँ कोई दिल नहीं
दौड़ रहे सब अंधी राहों में कोई मंज़िल नहीं`,
    bpm: 92,
    key: 'Am',
    timeSignature: '4/4',
    status: 'COMPLETE',
    revision: 12,
    tags: ['Boom Bap', 'Midnight', 'Original'],
    notes: 'Original overarching notes',
    sectionNotes: {
      'Verse 1': 'Keep flow laid-back',
      'Hook': 'Double vocal layering',
    },
    songVocabulary: ['रात', 'सन्नाटा', 'जज़्बात'],
    scratchpadNotes: 'Original scratchpad notes',
    stashedRhymes: ['हालात', 'बरसात'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  };
  saveSong(sourceSong);

  // Duplicate the song
  const duplicated = duplicateSong(sourceSong.id, 'ORIGINAL ANTHEM (REMIX)');
  assert(duplicated !== null, 'Song duplication must succeed');
  assert(duplicated.id !== sourceSong.id, 'Duplicated song must receive a unique ID');
  assert(duplicated.title === 'ORIGINAL ANTHEM (REMIX)', 'Title applied correctly');
  assert(duplicated.status === 'DRAFT', 'Duplicated song status resets to DRAFT');
  assert(duplicated.revision === 1, 'Duplicated song revision counter starts at 1');

  // Mutate duplicated song's nested arrays and objects
  duplicated.tags?.push('NEW_MUTATED_TAG');
  duplicated.songVocabulary?.push('NEW_VOCAB');
  duplicated.stashedRhymes?.push('NEW_RHYME');
  duplicated.sectionNotes!['Verse 1'] = 'MUTATED VERSE NOTE';
  duplicated.sectionNotes!['Outro'] = 'NEW SECTION NOTE';
  duplicated.content = 'MUTATED LYRICS ONLY IN COPY';

  // Save the mutated duplicate
  saveSong(duplicated);

  // Fetch both from storage to verify complete memory isolation
  const allSongs = getStoredSongs();
  const freshSource = allSongs.find((s) => s.id === sourceSong.id)!;
  const freshDuplicated = allSongs.find((s) => s.id === duplicated.id)!;

  // Verify Source was NOT mutated
  assert(!freshSource.tags?.includes('NEW_MUTATED_TAG'), 'Source tags were NOT modified by mutating copy');
  assert(!freshSource.songVocabulary?.includes('NEW_VOCAB'), 'Source vocabulary was NOT modified');
  assert(!freshSource.stashedRhymes?.includes('NEW_RHYME'), 'Source stashed rhymes were NOT modified');
  assert(freshSource.sectionNotes!['Verse 1'] === 'Keep flow laid-back', 'Source sectionNotes was NOT modified');
  assert(!freshSource.sectionNotes!['Outro'], 'Source did not acquire new section notes');
  assert(freshSource.content.includes('रात में जलता'), 'Source content remained untouched');
  assert(freshSource.revision === 12, 'Source revision was preserved');

  console.log('  ✓ 1. Deep memory isolation verified (nested objects/arrays are independent)');
}

// 2. Duplication of Large Song (100+ bars)
{
  const longBars: string[] = ['[Verse 1]'];
  for (let b = 1; b <= 120; b++) {
    longBars.push(`Bar ${b}: लफ्जों में बारूद और कलम में मेरी आग`);
  }
  const largeSong: Song = {
    id: 'large-song-100',
    title: 'LARGE 120-BAR MARATHON',
    content: longBars.join('\n'),
    bpm: 88,
    key: 'Dm',
    status: 'IN PROGRESS',
    revision: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSong(largeSong);

  const startMs = Date.now();
  const dupLarge = duplicateSong(largeSong.id);
  const durationMs = Date.now() - startMs;

  assert(dupLarge !== null, 'Large song duplication succeeded');
  assert(dupLarge.content.split('\n').length === 121, 'All 120 bars preserved in duplicate');
  assert(durationMs < 50, `Duplication of 120-bar song took ${durationMs}ms (well under 50ms requirement)`);

  console.log(`  ✓ 2. 120-bar large song duplication passed in ${durationMs}ms`);
}

console.log('\n✅ ALL SONG DUPLICATION & ISOLATION TESTS PASSED!\n');
