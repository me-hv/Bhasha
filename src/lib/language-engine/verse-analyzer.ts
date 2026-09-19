/**
 * BHASHA — Verse & Lyric Analysis Engine (Phase 7)
 * 
 * Features:
 * - Deterministic End-Rhyme Detection & Rhyme Scheme Mapping (A, B, C...)
 * - High-Confidence Internal Rhyme Detection (Intra-line & Cross-line)
 * - Syllable Meter, Flow Cadence Pattern, and Density Analysis
 * - Structured Section & Bar Breakdown
 * - Non-Destructive Writing Statistics & Rhyme Density Metrics
 */

import {
  ParsedLine,
  ParsedSection,
  SongStats,
  RhymeGroup,
  InternalRhymeMatch,
  FlowAnalysis,
  RhymeTarget,
} from '../../types';
import { countSyllables, toPhoneticSequence, getRhymeScore } from './phonetics';
import { resolveToDevanagari, normalizeRomanHindi } from './normalizer';
import { lexicalDatabase } from './lexical-database';

const RHYME_GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const RHYME_GROUP_COLORS: Record<string, { badge: string; text: string; bg: string; border: string }> = {
  A: { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' },
  B: { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/50', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40' },
  C: { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/40' },
  D: { badge: 'bg-purple-500/20 text-purple-400 border-purple-500/50', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/40' },
  E: { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/50', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/40' },
  F: { badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50', text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/40' },
  G: { badge: 'bg-lime-500/20 text-lime-400 border-lime-500/50', text: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/40' },
  H: { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/50', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
};

// Common grammatical particles / stop words in Hindi/Hinglish to exclude from internal rhyme matching
const STOP_WORDS = new Set([
  'है', 'हैं', 'हूँ', 'था', 'थी', 'थे', 'में', 'का', 'के', 'की', 'को', 'से', 'भी', 'ना', 'तो', 'पर', 'ये', 'वो', 'एक', 'जो', 'कर', 'रहे', 'रहा', 'रही', 'ने', 'पे', 'ही', 'हो', 'हुई', 'हुआ', 'हुए', 'जा', 'गई', 'गया', 'गए', 'ले', 'दी', 'दिया', 'दिए', 'और',
  'hai', 'hain', 'hun', 'hoon', 'tha', 'thi', 'the', 'me', 'mein', 'main', 'ka', 'ke', 'ki', 'ko', 'se', 'bhi', 'na', 'to', 'par', 'ye', 'wo', 'ek', 'jo', 'kar', 'rahe', 'raha', 'rahi', 'ne', 'pe', 'hi', 'ho', 'hui', 'hua', 'hue', 'ja', 'gai', 'gaya', 'gae', 'le', 'di', 'diya', 'diye', 'aur', 'or'
]);

/**
 * Strips punctuation and returns cleaned word
 */
export function cleanWord(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥0-9]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥0-9]+$/g, '')
    .trim();
}

const LINE_WORDS_CACHE = new Map<string, string[]>();

/**
 * Extracts list of clean words from a line
 */
export function extractLineWords(line: string): string[] {
  if (!line || !line.trim()) return [];
  const trimmed = line.trim();
  if (LINE_WORDS_CACHE.has(trimmed)) return LINE_WORDS_CACHE.get(trimmed)!;

  const result = trimmed
    .split(/\s+/)
    .map(cleanWord)
    .filter((w) => w.length > 0 && /[a-zA-Z\u0900-\u097F]/.test(w));

  LINE_WORDS_CACHE.set(trimmed, result);
  return result;
}

/**
 * Extracts the last meaningful word of a line
 */
export function extractLineEndWord(line: string): string | null {
  const words = extractLineWords(line);
  if (words.length === 0) return null;
  return words[words.length - 1];
}

const WORDS_RHYME_CACHE = new Map<string, { rhymes: boolean; score: number; type: string }>();

/**
 * Checks if two words rhyme with high confidence
 */
export function areWordsRhyming(
  wordA: string,
  wordB: string,
  minScore = 0.70
): { rhymes: boolean; score: number; type: string } {
  if (!wordA || !wordB) return { rhymes: false, score: 0, type: 'none' };
  const cleanA = cleanWord(wordA);
  const cleanB = cleanWord(wordB);
  if (!cleanA || !cleanB) return { rhymes: false, score: 0, type: 'none' };

  // Identical words are exact matches
  if (cleanA === cleanB) {
    return { rhymes: true, score: 1.0, type: 'perfect' };
  }

  const cacheKey = cleanA < cleanB ? `${cleanA}__${cleanB}__${minScore}` : `${cleanB}__${cleanA}__${minScore}`;
  if (WORDS_RHYME_CACHE.has(cacheKey)) {
    return WORDS_RHYME_CACHE.get(cacheKey)!;
  }

  // Check dictionary variants (e.g. कुदरत ↔ क़ुदरत)
  const normA = normalizeRomanHindi(cleanA);
  const normB = normalizeRomanHindi(cleanB);
  if (normA === normB) {
    const res = { rhymes: true, score: 1.0, type: 'perfect' };
    WORDS_RHYME_CACHE.set(cacheKey, res);
    return res;
  }

  const { devanagari: devA } = resolveToDevanagari(normA);
  const { devanagari: devB } = resolveToDevanagari(normB);

  const seqA = toPhoneticSequence(devA || cleanA);
  const seqB = toPhoneticSequence(devB || cleanB);

  const detailedScore = getRhymeScore(seqA, seqB);

  const isRhyming =
    detailedScore.score >= minScore &&
    (detailedScore.type === 'perfect' ||
      detailedScore.type === 'multisyllabic' ||
      detailedScore.type === 'strong' ||
      detailedScore.type === 'near' ||
      detailedScore.type === 'consonance' ||
      (minScore <= 0.60 ? detailedScore.type === 'assonance' : detailedScore.score >= 0.75) ||
      detailedScore.score >= 0.85);

  const result = {
    rhymes: isRhyming,
    score: detailedScore.score,
    type: detailedScore.type,
  };

  WORDS_RHYME_CACHE.set(cacheKey, result);
  return result;
}

const LINE_CADENCE_CACHE = new Map<string, string>();

/**
 * Generates visual rhythm cadence pattern (e.g. "● — ● ● — ●")
 */
export function generateCadencePattern(line: string): string {
  const words = extractLineWords(line);
  if (words.length === 0) return '';
  const trimmed = line.trim();
  if (LINE_CADENCE_CACHE.has(trimmed)) return LINE_CADENCE_CACHE.get(trimmed)!;

  const symbols: string[] = [];
  for (const word of words) {
    const { devanagari } = resolveToDevanagari(word);
    const seq = toPhoneticSequence(devanagari || word);
    for (const syl of seq.syllables) {
      const isLong = ['aː', 'iː', 'uː', 'eː', 'ɛː', 'oː', 'ɔː'].includes(syl.nucleus);
      symbols.push(isLong ? '—' : '●');
    }
  }

  const result = symbols.join(' ');
  LINE_CADENCE_CACHE.set(trimmed, result);
  return result;
}

/**
 * Analyzes flow and syllable metrics for a single line
 */
export function analyzeFlow(line: string, bpm = 92, targetSyllables = 10): FlowAnalysis {
  const syllables = countSyllables(line);
  const cadencePattern = generateCadencePattern(line);

  // Assuming 4/4 time signature (4 beats per bar)
  const density = Number((syllables / 4).toFixed(1));
  const isDense = density > 4.25; // Over 17 syllables in 4 beats

  return {
    syllables,
    targetSyllables,
    density,
    cadencePattern,
    isDense,
  };
}

const INTERNAL_RHYMES_CACHE = new Map<string, { wordA: string; wordB: string; score: number; type: any }[]>();

/**
 * Detects internal rhymes within a single line
 */
export function detectInternalRhymes(line: string, lineIndex = 0): InternalRhymeMatch[] {
  const words = extractLineWords(line);
  if (words.length < 2) return [];

  const wordsKey = words.join(' ');
  if (INTERNAL_RHYMES_CACHE.has(wordsKey)) {
    return INTERNAL_RHYMES_CACHE.get(wordsKey)!.map((m) => ({ ...m, lineIndex }));
  }

  const matches: InternalRhymeMatch[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < words.length; i++) {
    const wordA = words[i];
    if (STOP_WORDS.has(wordA.toLowerCase()) || wordA.length < 2 || !/[a-zA-Z\u0900-\u097F]/.test(wordA)) continue;

    for (let j = i + 1; j < words.length; j++) {
      const wordB = words[j];
      if (STOP_WORDS.has(wordB.toLowerCase()) || wordB.length < 2 || !/[a-zA-Z\u0900-\u097F]/.test(wordB)) continue;
      if (wordA.toLowerCase() === wordB.toLowerCase()) continue; // Skip exact same word

      const pairKey = wordA < wordB ? `${wordA}:::${wordB}` : `${wordB}:::${wordA}`;
      if (seenPairs.has(pairKey)) continue;

      const { rhymes, score, type } = areWordsRhyming(wordA, wordB, 0.55);
      if (rhymes) {
        seenPairs.add(pairKey);
        matches.push({
          wordA,
          wordB,
          lineIndex,
          score,
          type: type as any,
        });
      }
    }
  }

  INTERNAL_RHYMES_CACHE.set(
    wordsKey,
    matches.map((m) => ({ wordA: m.wordA, wordB: m.wordB, score: m.score, type: m.type }))
  );
  return matches;
}

const AUXILIARY_STOP_WORDS = new Set([
  'है', 'हैं', 'हूँ', 'हूं', 'था', 'थी', 'थे',
  'गया', 'गई', 'गए', 'गयी', 'गये',
  'रहा', 'रहे', 'रही',
  'हो', 'हुआ', 'हुई', 'हुए', 'होगा', 'होगी', 'होंगे',
  'में', 'पे', 'पर', 'से', 'का', 'के', 'की', 'को', 'तक', 'ने',
  'नहीं', 'नही', 'ना', 'मत',
  'तू', 'मुझे', 'मेरा', 'मेरी', 'मेरे', 'तुझे', 'तेरा', 'तेरी', 'तेरे', 'हम', 'हमें', 'हमारा', 'हमारी', 'हमारे', 'आप', 'वो', 'ये', 'इस', 'उस', 'भी', 'तो', 'ही',
  'hai', 'hain', 'hun', 'hoon', 'tha', 'thi', 'the',
  'gaya', 'gai', 'gae',
  'raha', 'rahe', 'rahi',
  'hua', 'hui', 'hue', 'ho', 'hoga', 'hogi',
  'mein', 'me', 'pe', 'par', 'se', 'ka', 'ke', 'ki', 'ko', 'tak', 'ne',
  'nahi', 'nahin', 'na', 'mat',
  'tu', 'mujhe', 'mera', 'meri', 'mere', 'tujhe', 'tera', 'teri', 'tere', 'hum', 'humein', 'hamara', 'hamari', 'hamare', 'aap', 'wo', 'ye', 'is', 'us', 'bhi', 'to', 'hi'
]);

export function extractLineRhymeAnchor(line: string): { endWord: string; substantiveWord: string; precedingWord?: string } | null {
  const words = extractLineWords(line);
  if (words.length === 0) return null;
  const endWord = words[words.length - 1];

  let idx = words.length - 1;
  while (idx > 0 && AUXILIARY_STOP_WORDS.has(words[idx].toLowerCase())) {
    idx--;
  }

  const substantiveWord = idx >= 0 ? words[idx] : endWord;
  const precedingWord = idx > 0 ? words[idx - 1] : undefined;
  return { endWord, substantiveWord, precedingWord };
}

/**
 * Automatically groups line endings into rhyme groups (A, B, C...)
 */
export function computeRhymeGroups(
  lines: { index: number; endWord: string | null; isBar: boolean; line?: string }[],
  pinnedTarget?: RhymeTarget
): { lineGroupMap: Map<number, string>; groups: RhymeGroup[] } {
  const lineGroupMap = new Map<number, string>();
  const groups: RhymeGroup[] = [];
  let nextGroupIdx = 0;

  // Filter to valid bars with meaningful end words
  const validBars = lines
    .filter((l) => l.isBar && l.endWord)
    .map((l) => {
      const anchor = l.line ? extractLineRhymeAnchor(l.line) : { endWord: l.endWord!, substantiveWord: l.endWord!, precedingWord: undefined };
      return {
        ...l,
        endWord: l.endWord!,
        substantiveWord: anchor?.substantiveWord || l.endWord!,
        precedingWord: anchor?.precedingWord,
      };
    });

  // Precalculate refrain counts once (O(N)) instead of re-filtering inside nested loop
  const refrainCounts = new Map<string, number>();
  for (const b of validBars) {
    const key = `${b.substantiveWord.toLowerCase()}_${b.endWord.toLowerCase()}`;
    refrainCounts.set(key, (refrainCounts.get(key) || 0) + 1);
  }

  // Local rhyme pair cache to avoid redundant phonetics calls on repeated words
  const rhymePairCache = new Map<string, { rhymes: boolean; score: number }>();
  const checkRhymeCached = (w1: string, w2: string, minScore = 0.65) => {
    const cacheKey = `${w1}__${w2}__${minScore}`;
    if (rhymePairCache.has(cacheKey)) return rhymePairCache.get(cacheKey)!;
    const res = areWordsRhyming(w1, w2, minScore);
    rhymePairCache.set(cacheKey, res);
    return res;
  };

  const MAX_RHYME_HORIZON = 64; // Max bars lookahead for rhyme scheme grouping

  for (let i = 0; i < validBars.length; i++) {
    const current = validBars[i];
    if (!current.endWord) continue;

    // Check if this line already assigned
    if (lineGroupMap.has(current.index)) continue;

    // Look for matching lines within the rhyme horizon
    const matchingIndices: number[] = [current.index];
    const maxJ = Math.min(validBars.length, i + MAX_RHYME_HORIZON);

    for (let j = i + 1; j < maxJ; j++) {
      const candidate = validBars[j];
      if (!candidate.endWord || lineGroupMap.has(candidate.index)) continue;

      const isCurrentStop = AUXILIARY_STOP_WORDS.has(current.endWord.toLowerCase());
      const isCandStop = AUXILIARY_STOP_WORDS.has(candidate.endWord.toLowerCase());

      let isMatch = false;

      // Case 1: Both lines end in auxiliary stop words
      if (isCurrentStop && isCandStop) {
        const refrainKey = `${current.substantiveWord.toLowerCase()}_${current.endWord.toLowerCase()}`;
        const totalWithSameRefrain = refrainCounts.get(refrainKey) || 0;

        // 1a. If all lines share the identical refrain (Ghazal-wide Radif across >= 4 lines), check preceding Qafiya word
        if (
          totalWithSameRefrain >= 4 &&
          current.substantiveWord.toLowerCase() === candidate.substantiveWord.toLowerCase() &&
          current.endWord.toLowerCase() === candidate.endWord.toLowerCase()
        ) {
          if (current.precedingWord && candidate.precedingWord) {
            const precRes = checkRhymeCached(current.precedingWord, candidate.precedingWord, 0.65);
            if (precRes.rhymes && precRes.score >= 0.65) {
              isMatch = true;
            }
          }
        }
        // 1b. Couplet/alternate refrain match
        else if (
          current.substantiveWord.toLowerCase() === candidate.substantiveWord.toLowerCase() &&
          current.endWord.toLowerCase() === candidate.endWord.toLowerCase()
        ) {
          isMatch = true;
        }
        // 1c. Distinct substantive words (Qafiya) must rhyme
        else {
          const subRes = checkRhymeCached(current.substantiveWord, candidate.substantiveWord, 0.65);
          if (subRes.rhymes && subRes.score >= 0.65) {
            isMatch = true;
          }
        }
      }
      // Case 2: One line ends in auxiliary stop word
      else if (isCurrentStop) {
        const resSub = checkRhymeCached(current.substantiveWord, candidate.endWord, 0.65);
        if (resSub.rhymes && resSub.score >= 0.65) {
          isMatch = true;
        }
      }
      else if (isCandStop) {
        const resSub = checkRhymeCached(current.endWord, candidate.substantiveWord, 0.65);
        if (resSub.rhymes && resSub.score >= 0.65) {
          isMatch = true;
        }
      }
      // Case 3: Both lines end in substantive content words
      else {
        const res = checkRhymeCached(current.endWord, candidate.endWord, 0.65);
        if (res.rhymes && res.score >= 0.65) {
          isMatch = true;
        }
      }

      if (isMatch) {
        matchingIndices.push(candidate.index);
      }
    }

    // Only assign a group if at least 2 lines participate, OR if it matches the pinned target
    const matchesTarget =
      pinnedTarget &&
      (areWordsRhyming(current.endWord, pinnedTarget.devanagari, 0.70).rhymes ||
       areWordsRhyming(current.substantiveWord, pinnedTarget.devanagari, 0.70).rhymes);

    if (matchingIndices.length > 1 || matchesTarget) {
      const letter = RHYME_GROUP_LETTERS[nextGroupIdx % RHYME_GROUP_LETTERS.length];
      const colorData = RHYME_GROUP_COLORS[letter] || RHYME_GROUP_COLORS['A'];

      const group: RhymeGroup = {
        id: `group-${letter}-${current.index}`,
        letter,
        color: colorData.badge,
        lines: matchingIndices,
        anchorWord: current.endWord,
      };

      groups.push(group);
      for (const idx of matchingIndices) {
        lineGroupMap.set(idx, letter);
      }

      nextGroupIdx++;
    }
  }

  return { lineGroupMap, groups };
}

/**
 * Primary Parse Function: Analyzes complete song text into sections, bars, rhymes, flow, and stats
 */
export function parseSongContent(
  content: string,
  bpm = 92,
  targetSyllables = 10,
  pinnedTarget?: RhymeTarget
): {
  lines: ParsedLine[];
  sections: ParsedSection[];
  stats: SongStats;
  rhymeGroups: RhymeGroup[];
} {
  const rawLines = content.split('\n');
  let barCounter = 0;

  // 1. Initial line extraction
  const preLines = rawLines.map((raw, idx) => {
    const trimmed = raw.trim();
    const isHeader = trimmed.startsWith('[') && trimmed.endsWith(']');
    const headerTitle = isHeader ? trimmed.slice(1, -1).trim() : undefined;
    const isBlank = !trimmed;
    const isBar = !isHeader && !isBlank;

    if (isBar) barCounter++;

    const words = isBar ? extractLineWords(raw) : [];
    const endWord = isBar ? extractLineEndWord(raw) : null;
    const syllables = isBar ? countSyllables(raw) : null;
    const internalRhymes = isBar ? detectInternalRhymes(raw, idx) : [];
    const flow = isBar ? analyzeFlow(raw, bpm, targetSyllables) : undefined;

    return {
      index: idx,
      line: raw,
      rawText: raw,
      isHeader,
      headerTitle,
      isBlank,
      barNumber: isBar ? barCounter : null,
      words,
      endWord,
      syllables,
      flow,
      internalRhymes,
      isBar,
    };
  });

  // 2. Rhyme Group Assignment
  const { lineGroupMap, groups: rhymeGroups } = computeRhymeGroups(
    preLines.map((l) => ({ index: l.index, endWord: l.endWord, isBar: l.isBar, line: l.line })),
    pinnedTarget
  );

  // 3. Assemble full ParsedLine array
  const lines: ParsedLine[] = preLines.map((l) => {
    const groupLetter = lineGroupMap.get(l.index);
    const colorData = groupLetter ? RHYME_GROUP_COLORS[groupLetter] || RHYME_GROUP_COLORS['A'] : undefined;

    return {
      index: l.index,
      line: l.line,
      rawText: l.rawText,
      isHeader: l.isHeader,
      headerTitle: l.headerTitle,
      isBlank: l.isBlank,
      barNumber: l.barNumber,
      words: l.words,
      endWord: l.endWord,
      syllables: l.syllables,
      rhymeGroup: groupLetter,
      rhymeGroupColor: colorData?.badge,
      isUnrhymed: !groupLetter && l.isBar,
      flow: l.flow,
      internalRhymes: l.internalRhymes,
    };
  });

  // 4. Group into ParsedSections
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = {
    id: 'section-0',
    title: 'Main',
    type: 'Verse',
    startLineIndex: 0,
    endLineIndex: 0,
    lines: [],
    barCount: 0,
  };

  for (let i = 0; i < lines.length; i++) {
    const lineObj = lines[i];

    if (lineObj.isHeader) {
      if (currentSection.lines.length > 0) {
        currentSection.endLineIndex = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        id: `section-${sections.length + 1}`,
        title: lineObj.headerTitle || 'Section',
        type: lineObj.headerTitle?.split(' ')[0] || 'Verse',
        startLineIndex: i,
        endLineIndex: i,
        lines: [lineObj],
        barCount: 0,
      };
    } else {
      currentSection.lines.push(lineObj);
      if (lineObj.barNumber !== null) {
        currentSection.barCount++;
      }
    }
  }

  if (currentSection.lines.length > 0) {
    currentSection.endLineIndex = lines.length - 1;
    sections.push(currentSection);
  }

  // 5. Compute Overall Song Writing Statistics
  const barLines = lines.filter((l) => l.barNumber !== null);
  const totalBars = barLines.length;
  let totalWords = 0;
  let totalSyllables = 0;
  let totalInternalRhymes = 0;
  let rhymingBarsCount = 0;

  for (const bar of barLines) {
    totalWords += bar.words.length;
    totalSyllables += bar.syllables || 0;
    totalInternalRhymes += bar.internalRhymes.length;
    if (bar.rhymeGroup || bar.internalRhymes.length > 0) {
      rhymingBarsCount++;
    }
  }

  const avgSyllables = totalBars > 0 ? Number((totalSyllables / totalBars).toFixed(1)) : 0;
  const rhymeDensity = totalBars > 0 ? Math.round((rhymingBarsCount / totalBars) * 100) : 0;

  const stats: SongStats = {
    totalWords,
    totalBars,
    totalSyllables,
    avgSyllables,
    rhymeGroups: rhymeGroups.length,
    internalRhymes: totalInternalRhymes,
    rhymeDensity,
  };

  return {
    lines,
    sections,
    stats,
    rhymeGroups,
  };
}

export const analyzeVerse = parseSongContent;

