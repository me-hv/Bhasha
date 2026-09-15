/**
 * Inverted Rhyme & Search Index Builder
 * Builds multi-tiered phonetic buckets, search normalization maps, and variant resolvers.
 */

import { LexicalEntry, InvertedRhymeIndex } from '../../src/types';
import { RawLexicalItem, HINDUSTANI_RAW_SOURCES } from './raw-sources';
import { WORDS_DATABASE as SEED_WORDS } from '../../src/data/words';
import { analyzeDevanagariWord, generateRomanVariations, removeNuqta, addNuqtaStandard } from './phonetics-generator';

export function buildCompleteLexicon(): {
  lexicon: LexicalEntry[];
  index: InvertedRhymeIndex;
} {
  const wordMap = new Map<string, LexicalEntry>();
  const searchIndex: Record<string, string> = {};
  const variantIndex: Record<string, string> = {};
  const endingBuckets: Record<string, string[]> = {};
  const nucleusCodaBuckets: Record<string, string[]> = {};
  const cadenceBuckets: Record<string, string[]> = {};

  // 1. Process Raw Hindustani Items
  for (const item of HINDUSTANI_RAW_SOURCES) {
    const analysis = analyzeDevanagariWord(item.devanagari);
    const romanVariants = generateRomanVariations(item.devanagari, item.roman);
    const id = `lex-${item.roman.toLowerCase()}`;

    const variants = item.variants || [item.devanagari];
    const noNuqta = removeNuqta(item.devanagari);
    if (!variants.includes(noNuqta)) variants.push(noNuqta);
    const withNuqta = addNuqtaStandard(item.devanagari);
    if (!variants.includes(withNuqta)) variants.push(withNuqta);

    const entry: LexicalEntry = {
      id,
      devanagari: item.devanagari,
      urdu: item.urdu,
      roman: item.roman,
      aliases: romanVariants,
      normalizedSearchForms: [...romanVariants, ...variants, item.devanagari],
      pronunciation: analysis.pronunciation,
      phonemes: analysis.phonemes,
      syllables: analysis.syllableCount,
      syllableBreakdown: analysis.syllableBreakdown,
      meaning: item.meaning,
      hindiMeaning: item.hindiMeaning,
      origin: item.origin,
      register: item.register || ['common'],
      moods: item.moods || ['General'],
      category: item.category || ['LIFE'],
      frequency: item.frequency || 85,
      coda: analysis.coda,
      rhymeKey: analysis.rhymeKey,
      phoneticKey: {
        nucleus: analysis.nucleus,
        coda: analysis.coda,
        rhymeEnding: analysis.rhymeKey,
        syllables: analysis.syllableCount,
        phonemes: analysis.phonemes,
      },
      variants,
      perfectRhymes: [],
      strongRhymes: [],
      nearRhymes: [],
      cadenceRhymes: [],
      synonyms: item.synonyms || [],
      antonyms: item.antonyms || [],
      relatedImagery: item.relatedImagery || [],
      relatedGraph: {
        visual: item.visual,
        emotion: item.emotion,
        sound: item.sound,
        place: item.place,
      },
      sampleBars: item.sampleBars || [],
    };

    wordMap.set(entry.devanagari, entry);
  }

  // 2. Merge Seed Words from Phase 2/3 if not already present
  for (const seed of SEED_WORDS) {
    if (!wordMap.has(seed.devanagari)) {
      const analysis = analyzeDevanagariWord(seed.devanagari);
      const romanVariants = generateRomanVariations(seed.devanagari, seed.roman);
      const entry: LexicalEntry = {
        ...seed,
        aliases: Array.from(new Set([...seed.aliases, ...romanVariants])),
        normalizedSearchForms: Array.from(new Set([...seed.aliases, ...romanVariants, seed.devanagari])),
        phonemes: analysis.phonemes,
        syllables: seed.syllables || analysis.syllableCount,
        syllableBreakdown: analysis.syllableBreakdown,
        frequency: 90,
        rhymeKey: analysis.rhymeKey,
        variants: [seed.devanagari, removeNuqta(seed.devanagari), addNuqtaStandard(seed.devanagari)],
      };
      wordMap.set(entry.devanagari, entry);
    }
  }

  const allWords = Array.from(wordMap.values());

  // 3. Build Inverted Index Buckets
  for (const word of allWords) {
    const rhymeKey = word.rhymeKey || 'general';
    // Ending bucket (e.g. 'at', 'aat', 'il', 'ar', 'oon', 'da', 'gi', 'ai')
    if (!endingBuckets[rhymeKey]) {
      endingBuckets[rhymeKey] = [];
    }
    endingBuckets[rhymeKey].push(word.id);

    // Nucleus + Coda bucket (e.g. 'aː_t̪', 'ə_t̪')
    const nucleusCodaKey = `${word.phoneticKey?.nucleus || 'ə'}_${word.phoneticKey?.coda || 't̪'}`;
    if (!nucleusCodaBuckets[nucleusCodaKey]) {
      nucleusCodaBuckets[nucleusCodaKey] = [];
    }
    nucleusCodaBuckets[nucleusCodaKey].push(word.id);

    // Search Index Mapping (Roman variations & Devanagari forms -> word id)
    const forms = word.normalizedSearchForms || [word.devanagari, word.roman];
    for (const form of forms) {
      const cleanForm = form.toLowerCase().trim();
      searchIndex[cleanForm] = word.id;
    }
    searchIndex[word.devanagari] = word.id;
    searchIndex[word.roman.toLowerCase()] = word.id;

    // Variant mapping
    if (word.variants) {
      for (const v of word.variants) {
        variantIndex[v] = word.id;
        variantIndex[removeNuqta(v)] = word.id;
        variantIndex[addNuqtaStandard(v)] = word.id;
      }
    }
  }

  // 4. Sort index bucket lists by word frequency descending
  const wordIdToFreq = new Map<string, number>();
  for (const w of allWords) wordIdToFreq.set(w.id, w.frequency ?? 80);

  for (const key of Object.keys(endingBuckets)) {
    endingBuckets[key].sort((a, b) => (wordIdToFreq.get(b) || 0) - (wordIdToFreq.get(a) || 0));
  }
  for (const key of Object.keys(nucleusCodaBuckets)) {
    nucleusCodaBuckets[key].sort((a, b) => (wordIdToFreq.get(b) || 0) - (wordIdToFreq.get(a) || 0));
  }

  // 5. Automatically populate dynamic rhymes on each word entry from index buckets
  for (const word of allWords) {
    const perfectSet = new Set<string>();
    const strongSet = new Set<string>();
    const nearSet = new Set<string>();

    // Perfect matches: Same rhymeKey and same syllable count
    const rhymeKey = word.rhymeKey || 'general';
    const candidatesInEnding = endingBuckets[rhymeKey] || [];
    for (const candId of candidatesInEnding) {
      const cand = allWords.find(w => w.id === candId);
      if (!cand || cand.devanagari === word.devanagari) continue;

      if (cand.syllables === word.syllables) {
        perfectSet.add(cand.devanagari);
      } else {
        strongSet.add(cand.devanagari);
      }
    }

    // Strong matches from same nucleus + coda
    const nucleusCodaKey = `${word.phoneticKey?.nucleus || 'ə'}_${word.phoneticKey?.coda || 't̪'}`;
    const candidatesInNucleus = nucleusCodaBuckets[nucleusCodaKey] || [];
    for (const candId of candidatesInNucleus) {
      const cand = allWords.find(w => w.id === candId);
      if (!cand || cand.devanagari === word.devanagari) continue;
      if (!perfectSet.has(cand.devanagari)) {
        strongSet.add(cand.devanagari);
      }
    }

    // Retain manually curated rhymes if any
    for (const r of word.perfectRhymes || []) perfectSet.add(r);
    for (const r of word.strongRhymes || []) strongSet.add(r);
    for (const r of word.nearRhymes || []) nearSet.add(r);

    word.perfectRhymes = Array.from(perfectSet);
    word.strongRhymes = Array.from(strongSet).filter(s => !perfectSet.has(s));
    word.nearRhymes = Array.from(nearSet).filter(n => !perfectSet.has(n) && !strongSet.has(n));
  }

  return {
    lexicon: allWords,
    index: {
      endingBuckets,
      nucleusCodaBuckets,
      cadenceBuckets,
      searchIndex,
      variantIndex,
    },
  };
}
