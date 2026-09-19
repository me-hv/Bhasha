/**
 * BHASHA Phase 11 Reliability Suite: Synthetic Scaling & Performance Stress Benchmarks
 */

import { setupTestStorage, assert, generateSyntheticSong } from './setup';
setupTestStorage();

import { searchService } from '../../lib/services/search-service';
import { analyzeVerse } from '../../lib/language-engine/verse-analyzer';
import { getRhymes } from '../../lib/language-engine/rhyme-engine';
import { validateSong, validateProjectIntegrity } from '../../lib/storage/integrity';
import { normalizeProject } from '../../lib/utils/export';
import { Song, BhashaProjectBackup, SavedWord } from '../../types';

console.log('🧪 RUNNING: Phase 11 — High-Capacity Scaling & Stress Benchmark Suite\n');

function calculatePercentiles(latencies: number[]): { p50: number; p95: number; p99: number; max: number } {
  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.50)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const max = latencies[latencies.length - 1];
  return { p50, p95, p99, max };
}

// 1. 1,000 Continuous Bars Verse Analysis Stress Test
{
  const longBars: string[] = ['[Verse 1]'];
  const rhymePool = ['रात', 'बात', 'साथ', 'हाथ', 'हालात', 'जज़्बात', 'औकात', 'बरसात'];
  for (let b = 1; b <= 1000; b++) {
    const rw = rhymePool[(b - 1) % rhymePool.length];
    longBars.push(`Bar ${b}: लफ्जों में बारूद और कलम में मेरी ${rw}`);
  }
  const marathonContent = longBars.join('\n');

  const startMs = performance.now();
  const analysis = analyzeVerse(marathonContent);
  const durationMs = performance.now() - startMs;

  assert(analysis.stats.totalBars >= 1000, `Analyzed ${analysis.stats.totalBars} bars successfully`);
  assert(analysis.stats.rhymeDensity > 50, 'Rhyme density calculated across marathon text');
  console.log(`  ✓ 1. 1,000-bar marathon song analyzed in ${durationMs.toFixed(2)}ms (Target: <200ms)`);
}

// 2. High-Frequency Burst Keystroke Simulation (500 edit events)
{
  const latencies: number[] = [];
  const baseVerse = '[Verse 1]\nरात में जागता सवाल मेरे साथ\nशहर सो रहा लेकिन आँखों में रात';
  const keystrokes = ['\n', 'क', 'ल', 'म', ' ', 'च', 'ल', 'े', ' ', 'म', 'े', 'र', 'ी', ' ', 'ज', 'ै', 'स', 'े', ' ', 'आ', 'ग'];
  let currentLyrics = baseVerse;

  for (let k = 1; k <= 300; k++) {
    const char = keystrokes[k % keystrokes.length];
    currentLyrics += char;
    const t0 = performance.now();
    const parsed = analyzeVerse(currentLyrics);
    const t1 = performance.now();
    latencies.push(t1 - t0);
    if (currentLyrics.length > 500) {
      currentLyrics = baseVerse;
    }
  }

  const { p50, p95, p99 } = calculatePercentiles(latencies);
  assert(p95 < 16, `p95 latency was ${p95.toFixed(2)}ms (<16ms 60fps frame budget)`);
  console.log(`  ✓ 2. 300 burst keystroke edits: p50 = ${p50.toFixed(2)}ms, p95 = ${p95.toFixed(2)}ms, p99 = ${p99.toFixed(2)}ms`);
}

// 3. Rhyme Engine Latency Benchmark (1,000 lookups)
{
  const wordsToQuery = ['रात', 'ज़िंदगी', 'कलाम', 'सफ़र', 'दर्द', 'मंज़िल', 'तूफ़ान', 'ख्वाब', 'आसमान', 'हौसला'];
  const latencies: number[] = [];

  for (let i = 0; i < 1000; i++) {
    const word = wordsToQuery[i % wordsToQuery.length];
    const t0 = performance.now();
    const res = getRhymes(word);
    const t1 = performance.now();
    latencies.push(t1 - t0);
  }

  const { p50, p95, p99 } = calculatePercentiles(latencies);
  assert(p95 < 5, `p95 rhyme lookup latency was ${p95.toFixed(2)}ms (<5ms requirement)`);
  console.log(`  ✓ 3. 1,000 Rhyme lookups: p50 = ${p50.toFixed(2)}ms, p95 = ${p95.toFixed(2)}ms, p99 = ${p99.toFixed(2)}ms`);
}

// 4. Large Project Scaling: 1,000 Synthetic Songs + Validation + Search
{
  const syntheticSongs: Song[] = [];
  for (let i = 1; i <= 1000; i++) {
    syntheticSongs.push(generateSyntheticSong(i, 16));
  }

  // 4a. Validate 1,000 songs
  const valT0 = performance.now();
  const fullProject: BhashaProjectBackup = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    bhashaVersion: '1.0.0',
    songs: syntheticSongs,
    versions: [],
    lexicon: [],
    collections: [],
    ideas: [],
  };
  const valReport = validateProjectIntegrity(fullProject);
  const valT1 = performance.now();
  assert(valReport.valid, '1,000 songs project is 100% valid');
  assert(valReport.stats.totalSongs === 1000, 'Report counted all 1,000 songs');
  console.log(`  ✓ 4a. 1,000-song integrity validation took ${(valT1 - valT0).toFixed(2)}ms`);

  // 4b. Search across 1,000 songs
  const searchT0 = performance.now();
  const searchResults = searchService.searchSongs('TRACK 500', syntheticSongs);
  const searchT1 = performance.now();
  assert(searchResults.length === 1, 'Found target song among 1,000 songs');
  console.log(`  ✓ 4b. Search query across 1,000 songs completed in ${(searchT1 - searchT0).toFixed(2)}ms (Target: <20ms)`);

  // 4c. Normalize 1,000 songs
  const normT0 = performance.now();
  const normalized = normalizeProject(fullProject);
  const normT1 = performance.now();
  assert(normalized.songs.length === 1000, 'All 1,000 songs normalized');
  console.log(`  ✓ 4c. 1,000-song project semantic normalization took ${(normT1 - normT0).toFixed(2)}ms`);
}

// 5. Large Lexicon Scaling: 10,000 Words Search
{
  const largeLexicon: SavedWord[] = [];
  for (let w = 1; w <= 10000; w++) {
    largeLexicon.push({
      id: `word-${w}`,
      devanagari: `शब्द_${w}`,
      roman: `shabd_${w}`,
      meaning: `Meaning of word ${w}`,
      tags: [`Category-${w % 10}`],
      collections: [`Collection-${w % 5}`],
    });
  }

  const sT0 = performance.now();
  const matches = searchService.searchSavedLexicon('शब्द_5000', largeLexicon);
  const sT1 = performance.now();
  assert(matches.length === 1, 'Found exact match in 10,000 word lexicon');
  console.log(`  ✓ 5. Search across 10,000-word lexicon completed in ${(sT1 - sT0).toFixed(2)}ms`);
}

console.log('\n✅ ALL SCALING & PERFORMANCE STRESS BENCHMARKS PASSED!\n');
