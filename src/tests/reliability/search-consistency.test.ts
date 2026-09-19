/**
 * BHASHA Phase 11 Reliability Suite: Search Consistency & Index Reconstruction
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import { searchService } from '../../lib/services/search-service';
import { Song, SavedWord, CreativeIdea } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Search Consistency & Nuqta Invariance Test Suite\n');

// 1. Search Index Reconstruction
{
  const testSongs: Song[] = [
    {
      id: 's-search-1',
      title: 'क़िस्मत की लकीरें',
      content: '[Verse 1]\nग़ैरों से क्या शिकवा करें जब अपने ही ज़ुल्म करें',
      bpm: 92,
      key: 'Am',
      status: 'IN PROGRESS',
      tags: ['Urdu-Hindi', 'Dark'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 's-search-2',
      title: 'रास्ते और मंज़िल',
      content: '[Hook]\nसफ़र है लंबा लेकिन इरादे हैं फ़ौलादी',
      bpm: 95,
      key: 'Dm',
      status: 'COMPLETE',
      tags: ['Ambition'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const testLexicon: SavedWord[] = [
    {
      id: 'w-1',
      devanagari: 'क़िस्मत',
      roman: 'kismat',
      meaning: 'Destiny / Fate',
      tags: ['Deep'],
      collections: ['Philosophy'],
    },
    {
      id: 'w-2',
      devanagari: 'फ़ौलाद',
      roman: 'faulaad',
      meaning: 'Steel',
      tags: ['Strength'],
      collections: ['Metaphors'],
    },
  ];

  const testIdeas: CreativeIdea[] = [
    {
      id: 'idea-1',
      title: 'ग़ैरों का शहर',
      type: 'CONCEPT',
      status: 'UNUSED',
      content: 'Alone in an alien city where everyone is a stranger',
      tags: ['Midnight', 'Isolation'],
      relatedWords: ['ग़ैर', 'शहर'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const indexStats = searchService.rebuildSearchIndex(testSongs, testLexicon, testIdeas);
  assert(indexStats.indexedSongs === 2, 'Indexed 2 songs');
  assert(indexStats.indexedLexicon === 2, 'Indexed 2 lexicon words');
  assert(indexStats.indexedIdeas === 1, 'Indexed 1 idea');
  assert(indexStats.indexedCorpus > 0, 'Corpus indexed');

  console.log('  ✓ 1. Search index reconstruction and corpus status verified');

  // 2. Nuqta Invariance (क़ vs क, ग़ vs ग, ज़ vs ज, फ़ vs फ)
  // Searching 'किस्मत' (no nuqta) should find 'क़िस्मत' (with nuqta)
  const resultsNoNuqta = searchService.searchSongs('किस्मत', testSongs);
  assert(resultsNoNuqta.length > 0, 'Searching without nuqta (किस्मत) matches title with nuqta (क़िस्मत)');

  // Searching Roman 'kismat' should find 'क़िस्मत'
  const resultsRoman = searchService.searchSongs('kismat', testSongs);
  assert(resultsRoman.length > 0, 'Searching Roman "kismat" matches "क़िस्मत"');

  // Searching 'गैर' (no nuqta) should find 'ग़ैरों' in lyrics
  const resultsGair = searchService.searchSongs('गैर', testSongs);
  assert(resultsGair.length > 0, 'Searching "गैर" matches lyric snippet with "ग़ैरों"');

  // Searching 'faulad' should match 'फ़ौलादी' in lyrics
  const resultsFaulad = searchService.searchSongs('faulad', testSongs);
  assert(resultsFaulad.length > 0, 'Searching Roman "faulad" matches lyrics with "फ़ौलादी"');

  console.log('  ✓ 2. Nuqta invariance verified across Devanagari & Roman query permutations');

  // 3. Global Search Aggregation
  const globalRes = searchService.globalSearch('ग़ैर', testSongs, testLexicon, testIdeas);
  assert(globalRes.songs.length > 0, 'Global search matched songs for "ग़ैर"');
  assert(globalRes.ideas.length > 0, 'Global search matched ideas for "ग़ैर"');

  console.log('  ✓ 3. Unified global search aggregation verified across all entities');
}

console.log('\n✅ ALL SEARCH CONSISTENCY & NUQTA TESTS PASSED!\n');
