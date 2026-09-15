/**
 * BHASHA — 5-Stage Rhyme Quality Engine
 * Architecture:
 * 1. Candidate Retrieval (O(1) Inverted Index)
 * 2. Phonetic Sequence Comparison
 * 3. Deterministic Acoustic Scoring
 * 4. Rhyme Classification (PERFECT, MULTISYLLABIC, STRONG, NEAR, ASSONANCE, CONSONANCE)
 * 5. Intelligent Metric & Frequency-Informed Ranking
 */

import {
  LexicalEntry,
  RhymeResult,
  RhymeMatch,
  RhymeType,
  RhymeCategory,
  PhoneticSequence,
} from '../../types';
import { lexicalDatabase } from './lexical-database';
import { resolveToDevanagari, normalizeRomanHindi, isDevanagari } from './normalizer';
import {
  toPhoneticSequence,
  getRhymeScore,
  countWordSyllables,
  extractPhoneticKey,
} from './phonetics';

/**
 * Finds lexical entry by Roman Hindi, Hinglish, or Devanagari query
 */
export function getWord(query: string): LexicalEntry | null {
  if (!query) return null;
  const normalized = normalizeRomanHindi(query);
  if (!normalized) return null;

  return isDevanagari(normalized)
    ? lexicalDatabase.getByDevanagari(normalized)
    : lexicalDatabase.getBySearchForm(normalized);
}

/**
 * Helper to build a strongly-typed RhymeMatch
 */
function buildRhymeMatch(
  wordStr: string,
  type: RhymeType,
  score: number,
  matchingSyllables: number = 1,
  confidence: number = 0.90
): RhymeMatch {
  const existingWord = lexicalDatabase.getByDevanagari(wordStr);
  let category: RhymeCategory = 'near';
  if (type === 'perfect') category = 'perfect';
  else if (type === 'multisyllabic') category = 'multisyllabic';
  else if (type === 'strong') category = 'strong';
  else if (type === 'consonance') category = 'consonance';
  else if (type === 'assonance') category = 'assonance';
  else if (type === 'cadence') category = 'cadence';

  return {
    wordId: existingWord?.id || `word-${wordStr}`,
    word: wordStr,
    devanagari: wordStr,
    urdu: existingWord?.urdu,
    roman: existingWord ? existingWord.roman : wordStr,
    score,
    type,
    category,
    syllables: existingWord ? existingWord.syllables : countWordSyllables(wordStr),
    matchingSyllables,
    confidence,
    meaning: existingWord?.meaning,
    frequency: existingWord?.frequency || 80,
  };
}

/**
 * Primary Rhyme Discovery API: getRhymes(query)
 * 5-Stage deterministic pipeline for Hindustani lyricists.
 */
export function getRhymes(query: string): RhymeResult {
  const normalized = normalizeRomanHindi(query);
  if (!normalized) {
    return {
      query,
      resolvedDevanagari: '',
      perfect: [],
      multisyllabic: [],
      strong: [],
      near: [],
      assonance: [],
      consonance: [],
      cadence: [],
      multiSyllable: [],
      totalMatches: 0,
    };
  }

  const { devanagari: resolvedDevanagari } = resolveToDevanagari(normalized);
  const wordEntry = getWord(normalized) || getWord(resolvedDevanagari);
  const effectiveDeva = wordEntry ? wordEntry.devanagari : resolvedDevanagari;
  const targetSequence: PhoneticSequence = toPhoneticSequence(effectiveDeva);

  // =========================================================================
  // STAGE 1: CANDIDATE RETRIEVAL (Inverted Index)
  // =========================================================================
  const candidateMap = new Map<string, LexicalEntry>();
  const seenDevanagari = new Set<string>();

  // Exclude the search word itself and its orthographic variants
  seenDevanagari.add(effectiveDeva);
  seenDevanagari.add(resolvedDevanagari);
  if (wordEntry) {
    seenDevanagari.add(wordEntry.devanagari);
    if (wordEntry.variants) {
      for (const v of wordEntry.variants) seenDevanagari.add(v);
    }
  }

  // 1a. Fast Inverted Index Candidates (Ending buckets & Nucleus-Coda buckets)
  const endingKey = wordEntry?.rhymeKey || targetSequence.rhymeEnding;
  const endingIds = lexicalDatabase.getWordIdsByEnding(endingKey);
  for (const id of endingIds) {
    const entry = lexicalDatabase.getById(id);
    if (entry && !seenDevanagari.has(entry.devanagari)) {
      candidateMap.set(entry.devanagari, entry);
    }
  }

  const nucleusCodaKey = `${targetSequence.lastSyllable.nucleus}_${targetSequence.lastSyllable.coda || ''}`;
  const nucleusIds = lexicalDatabase.getWordIdsByNucleusCoda(nucleusCodaKey);
  for (const id of nucleusIds) {
    const entry = lexicalDatabase.getById(id);
    if (entry && !seenDevanagari.has(entry.devanagari)) {
      candidateMap.set(entry.devanagari, entry);
    }
  }

  // 1b. Broad Candidate Scan for Assonances & Near Rhymes
  for (const entry of lexicalDatabase.getAll()) {
    if (!seenDevanagari.has(entry.devanagari) && !candidateMap.has(entry.devanagari)) {
      candidateMap.set(entry.devanagari, entry);
    }
  }

  // =========================================================================
  // STAGE 2, 3 & 4: PHONETIC COMPARISON, SCORING & CLASSIFICATION
  // =========================================================================
  const perfectList: RhymeMatch[] = [];
  const multisyllabicList: RhymeMatch[] = [];
  const strongList: RhymeMatch[] = [];
  const nearList: RhymeMatch[] = [];
  const assonanceList: RhymeMatch[] = [];
  const consonanceList: RhymeMatch[] = [];
  const cadenceList: RhymeMatch[] = [];

  for (const [deva, candidate] of Array.from(candidateMap.entries())) {
    const candSequence = toPhoneticSequence(candidate.devanagari);
    const detailedScore = getRhymeScore(targetSequence, candSequence);

    if (detailedScore.score < 0.35) continue;

    const match = buildRhymeMatch(
      deva,
      detailedScore.type,
      detailedScore.score,
      detailedScore.matchingSyllables,
      detailedScore.confidence
    );

    switch (detailedScore.type) {
      case 'perfect':
        perfectList.push(match);
        break;
      case 'multisyllabic':
        multisyllabicList.push(match);
        break;
      case 'strong':
        strongList.push(match);
        break;
      case 'near':
        nearList.push(match);
        break;
      case 'assonance':
        assonanceList.push(match);
        break;
      case 'consonance':
        consonanceList.push(match);
        break;
    }
  }

  // Add Curated Cadences if available on WordEntry
  if (wordEntry?.cadenceRhymes) {
    for (const r of wordEntry.cadenceRhymes) {
      if (!seenDevanagari.has(r)) {
        seenDevanagari.add(r);
        cadenceList.push(buildRhymeMatch(r, 'cadence', 0.90, 2, 0.90));
      }
    }
  }

  // =========================================================================
  // STAGE 5: INTELLIGENT METRIC & FREQUENCY-INFORMED RANKING
  // =========================================================================
  const rankComparator = (a: RhymeMatch, b: RhymeMatch) => {
    // 1. Primary: Numerical Score
    if (b.score !== a.score) return b.score - a.score;
    // 2. Secondary: Matching syllables from end
    const bMatch = b.matchingSyllables || 1;
    const aMatch = a.matchingSyllables || 1;
    if (bMatch !== aMatch) return bMatch - aMatch;
    // 3. Syllable proximity to target word (e.g. 1-syllable raat prefers 1-syllable baat)
    const aDiff = Math.abs(a.syllables - targetSequence.syllableCount);
    const bDiff = Math.abs(b.syllables - targetSequence.syllableCount);
    if (aDiff !== bDiff) return aDiff - bDiff;
    // 4. Frequency / Songwriting Popularity tiebreaker
    return (b.frequency || 80) - (a.frequency || 80);
  };

  perfectList.sort(rankComparator);
  multisyllabicList.sort(rankComparator);
  strongList.sort(rankComparator);
  nearList.sort(rankComparator);
  assonanceList.sort(rankComparator);
  consonanceList.sort(rankComparator);
  cadenceList.sort(rankComparator);

  const totalMatches =
    perfectList.length +
    multisyllabicList.length +
    strongList.length +
    nearList.length +
    assonanceList.length +
    consonanceList.length +
    cadenceList.length;

  return {
    query,
    resolvedWord: wordEntry || undefined,
    resolvedDevanagari: effectiveDeva,
    perfect: perfectList,
    multisyllabic: multisyllabicList,
    strong: strongList,
    near: nearList,
    assonance: assonanceList,
    consonance: consonanceList,
    cadence: cadenceList,
    multiSyllable: wordEntry?.multiSyllableRhymes || [],
    totalMatches,
  };
}

/**
 * Searches the vocabulary database by query
 */
export function searchDictionary(query: string, limit: number = 30): LexicalEntry[] {
  return lexicalDatabase.search(query, limit);
}
