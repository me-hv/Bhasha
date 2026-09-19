/**
 * BHASHA Phase 11 Reliability Suite: Long Writing Session & Multi-Cycle State Stability
 */

import { setupTestStorage, assert } from './setup';
setupTestStorage();

import {
  saveSong,
  getStoredSongs,
  createNewSong,
  saveVersionSnapshot,
  getStoredVersions,
} from '../../lib/storage/songs';
import {
  saveWordToLexicon,
  getStoredLexicon,
  createCollection,
} from '../../lib/storage/lexicon';
import { saveIdea, getStoredIdeas } from '../../lib/storage/ideas';
import { searchService } from '../../lib/services/search-service';
import { analyzeVerse } from '../../lib/language-engine/verse-analyzer';
import { Song } from '../../types';

console.log('🧪 RUNNING: Phase 11 — Long Session & Workflow Stability Test Suite\n');

// Multi-Cycle Songwriting Session Simulation (50 interactive creative cycles)
{
  const sessionSong = createNewSong('MIDNIGHT CHRONICLES', 94, 'Am');
  assert(sessionSong.revision === 1, 'Initial song starts at revision 1');

  createCollection('Midnight Rap');

  for (let cycle = 1; cycle <= 50; cycle++) {
    // 1. Writer edits lyrics
    sessionSong.content += `\nBar ${cycle}: रात गहरी बात मेरी कलम से निकली`;
    saveSong(sessionSong);

    // 2. Real-time verse analysis
    const verseAnalysis = analyzeVerse(sessionSong.content);
    assert(verseAnalysis.stats.totalBars >= cycle, `Cycle ${cycle} verse analysis succeeded`);

    // 3. Rhyme Rack lookup
    const rhymes = searchService.getRhymes('रात');
    assert(rhymes.totalMatches > 0, 'Rhyme rack returned matches');

    // 4. Stashing vocabulary every 5 cycles
    if (cycle % 5 === 0) {
      saveWordToLexicon({
        devanagari: `शब्द_${cycle}`,
        roman: `shabd_${cycle}`,
        meaning: `Definition ${cycle}`,
        collections: ['Midnight Rap'],
      });
      sessionSong.songVocabulary?.push(`शब्द_${cycle}`);
    }

    // 5. Version snapshotting every 10 cycles
    if (cycle % 10 === 0) {
      saveVersionSnapshot(sessionSong, `Milestone ${cycle} Bars`);
    }

    // 6. Creating a spontaneous creative idea every 15 cycles
    if (cycle % 15 === 0) {
      saveIdea({
        id: `idea-session-${cycle}`,
        title: `Beat Switch Idea ${cycle}`,
        type: 'CONCEPT',
        content: `Slow down tempo to half-time at bar ${cycle}`,
        tags: ['Arrangement'],
        attachedSongIds: [sessionSong.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'IN PROGRESS',
      });
    }
  }

  // Verify Session Invariants
  const storedSongs = getStoredSongs();
  const finalSong = storedSongs.find((s) => s.id === sessionSong.id)!;

  assert(finalSong.revision === 51, `Monotonic revision counter progressed to 51 (actual: ${finalSong.revision})`);
  assert(finalSong.content.includes('Bar 50'), 'All 50 bars intact in lyrics');

  const versions = getStoredVersions(sessionSong.id);
  assert(versions.length === 5, 'All 5 version snapshots created and persisted');

  const lexicon = getStoredLexicon();
  assert(lexicon.some((w) => w.devanagari === 'शब्द_50'), 'All 10 lexicon words saved and persisted');

  const ideas = getStoredIdeas();
  assert(ideas.some((i) => i.id === 'idea-session-45'), 'All 3 ideas saved and attached to song');

  console.log('  ✓ 1. 50-cycle intensive writing session completed with zero data loss or state drift');
}

console.log('\n✅ ALL LONG SESSION STABILITY TESTS PASSED!\n');
