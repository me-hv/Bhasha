/**
 * BHASHA Phase 11 Reliability Suite: Export Roundtrip & Normalizer Idempotence
 */

import { setupTestStorage, assert, assertDeepEqual } from './setup';
setupTestStorage();

import {
  createProjectBackup,
  exportProjectJson,
  atomicImportProject,
  normalizeProject,
} from '../../lib/utils/export';
import { Song, BhashaProjectBackup } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Export Roundtrip & Semantic Normalizer Test Suite\n');

// 1. Strict Lyric Immutability & Special Character Preservation
{
  const complexLyrics = `[Verse 1]
   पहला मिसरा — कुछ ख़ास अल्फ़ाज़...   
ग़ज़ब का था वो मंज़र!
कँवल, चाँद, ज़ुल्फ़ें, और तन्हाई...
  [Hook]  
ये शहर कंक्रीट का \t यहाँ कोई दिल नहीं
Line with mixed English & Devanagari: Hustle hard रात-दिन!`;

  const originalProject: BhashaProjectBackup = {
    schemaVersion: 2,
    exportedAt: '2026-03-01T12:00:00.000Z',
    bhashaVersion: '1.0.0',
    generator: 'BHASHA Songwriter OS',
    songs: [
      {
        id: 'song-complex-lyrics',
        title: 'अल्फ़ाज़ ओ आवाज़',
        content: complexLyrics,
        bpm: 92,
        key: 'F#m',
        timeSignature: '4/4',
        status: 'IN PROGRESS',
        revision: 3,
        tags: ['Poetic', 'Urdu-Influence'],
        notes: 'Preserve all punctuation and spacing',
        sectionNotes: { 'Verse 1': 'Expressive delivery' },
        songVocabulary: ['अल्फ़ाज़', 'ग़ज़ब', 'मंज़र', 'कँवल'],
        scratchpadNotes: 'Test scratchpad',
        stashedRhymes: ['तन्हाई', 'रुसवाई'],
        createdAt: '2026-03-01T10:00:00.000Z',
        updatedAt: '2026-03-01T11:00:00.000Z',
      },
    ],
    versions: [
      {
        id: 'v-1',
        songId: 'song-complex-lyrics',
        label: 'First Draft',
        timestamp: '2026-03-01T10:30:00.000Z',
        content: complexLyrics,
      },
    ],
    lexicon: [
      {
        id: 'w-1',
        devanagari: 'अल्फ़ाज़',
        roman: 'alfaaz',
        meaning: 'Words',
        tags: ['Urdu'],
        collections: ['Poetry'],
      },
    ],
    collections: ['Poetry'],
    ideas: [
      {
        id: 'idea-1',
        title: 'Midnight Ghazal',
        type: 'THEME',
        status: 'IN PROGRESS',
        content: 'Reflection on written words',
        tags: ['Urdu', 'Deep'],
        attachedSongIds: ['song-complex-lyrics'],
        createdAt: '2026-03-01T09:00:00.000Z',
        updatedAt: '2026-03-01T09:30:00.000Z',
      },
    ],
  };

  // Run normalization
  const normalized = normalizeProject(originalProject);

  // Assert Lyrics are 100% byte-for-byte identical
  assert(
    normalized.songs[0].content === complexLyrics,
    'Song lyrics content MUST be 100% identical and immutable after normalization'
  );
  assert(
    normalized.versions[0].content === complexLyrics,
    'Version lyrics content MUST be 100% identical and immutable after normalization'
  );

  console.log('  ✓ 1. Strict lyric immutability & special Devanagari character preservation verified');
}

// 2. Normalizer Idempotence: f(f(x)) === f(x)
{
  const inputProject: BhashaProjectBackup = {
    schemaVersion: 2,
    exportedAt: '2026-03-01T12:00:00.000Z',
    bhashaVersion: '1.0.0',
    generator: 'BHASHA Songwriter OS',
    songs: [
      {
        id: 'song-idempotent-1',
        title: '  UNTRIMMED TITLE  ',
        content: 'Bar 1\nBar 2\n',
        bpm: 90,
        key: 'Am',
        timeSignature: '4/4',
        status: 'DRAFT',
        tags: ['Tag A', 'Tag B', 'Tag A', '   '], // duplicate and empty tags
        songVocabulary: ['रात', 'बात', 'रात'],
        stashedRhymes: ['साथ', 'हाथ', 'साथ'],
        createdAt: '2026-03-01T10:00:00.000Z',
        updatedAt: '2026-03-01T11:00:00.000Z',
      },
    ],
    versions: [],
    lexicon: [
      { id: 'w1', devanagari: 'रात', roman: 'raat', meaning: 'Night', collections: ['Night'] },
      { id: 'w2', devanagari: 'रात', roman: 'raat', meaning: 'Night time', collections: ['Darkness'] }, // duplicate word
    ],
    collections: ['Night', 'Darkness', 'Night'],
    ideas: [],
  };

  const pass1 = normalizeProject(inputProject);
  const pass2 = normalizeProject(pass1);
  const pass3 = normalizeProject(pass2);

  const json1 = JSON.stringify(pass1);
  const json2 = JSON.stringify(pass2);
  const json3 = JSON.stringify(pass3);

  assert(json1 === json2, 'First normalizer pass matches second pass: f(x) === f(f(x))');
  assert(json2 === json3, 'Second pass matches third pass: f(f(x)) === f(f(f(x)))');

  // Verify duplicate removals
  assert(pass1.songs[0].tags?.length === 2, 'Duplicate and whitespace tags deduplicated');
  assert(pass1.songs[0].songVocabulary?.length === 2, 'Duplicate song vocabulary deduplicated');
  assert(pass1.lexicon.length === 1, 'Duplicate lexicon words merged cleanly');
  assert(pass1.lexicon[0].collections?.length === 2, 'Collections merged for deduplicated word');

  console.log('  ✓ 2. Semantic normalizer idempotence f(f(x)) === f(x) verified');
}

// 3. Full Export -> Import -> Export Roundtrip Consistency
{
  const originalJson = exportProjectJson();
  const importResult = atomicImportProject(originalJson);
  assert(importResult.success, 'Import of newly exported project must succeed');

  const roundtripJson = exportProjectJson(importResult.importedBackup);
  const roundtripObj1 = JSON.parse(originalJson);
  const roundtripObj2 = JSON.parse(roundtripJson);

  // Compare semantic data equality (excluding timestamp fields generated on export)
  assertDeepEqual(roundtripObj1.songs, roundtripObj2.songs, 'Songs array semantically preserved across roundtrip');
  assertDeepEqual(roundtripObj1.lexicon, roundtripObj2.lexicon, 'Lexicon array semantically preserved across roundtrip');
  assertDeepEqual([...roundtripObj1.collections].sort(), [...roundtripObj2.collections].sort(), 'Collections preserved across roundtrip');

  console.log('  ✓ 3. Full Export -> Import -> Export roundtrip verified with semantic equality');
}

console.log('\n✅ ALL EXPORT ROUNDTRIP & IDEMPOTENCY TESTS PASSED!\n');
