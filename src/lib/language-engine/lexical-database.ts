/**
 * Scalable In-Memory Lexical Database & Inverted Index Runtime
 * Provides O(1) indexed lookups across tens of thousands of Hindustani entries.
 */

import { LexicalEntry, InvertedRhymeIndex } from '../../types';
import {
  HINDUSTANI_CORPUS,
  HINDUSTANI_RHYME_INDEX,
  HINDUSTANI_WORD_BY_ID,
  HINDUSTANI_WORD_BY_DEVANAGARI,
} from '../../data/lexicon';

export class LexicalDatabase {
  private corpus: LexicalEntry[];
  private index: InvertedRhymeIndex;
  private wordById: Map<string, LexicalEntry>;
  private wordByDevanagari: Map<string, LexicalEntry>;

  constructor() {
    this.corpus = HINDUSTANI_CORPUS;
    this.index = HINDUSTANI_RHYME_INDEX;
    this.wordById = HINDUSTANI_WORD_BY_ID;
    this.wordByDevanagari = HINDUSTANI_WORD_BY_DEVANAGARI;
  }

  /**
   * Retrieves word by exact or variant Devanagari spelling
   */
  public getByDevanagari(devanagari: string): LexicalEntry | null {
    if (!devanagari) return null;
    const clean = devanagari.trim();
    if (this.wordByDevanagari.has(clean)) {
      return this.wordByDevanagari.get(clean)!;
    }

    // Check variant index
    if (this.index.variantIndex[clean]) {
      const wordId = this.index.variantIndex[clean];
      return this.wordById.get(wordId) || null;
    }

    return null;
  }

  /**
   * Retrieves word by Roman or normalized search form in O(1)
   */
  public getBySearchForm(query: string): LexicalEntry | null {
    if (!query) return null;
    const clean = query.trim().toLowerCase();

    // 1. Direct search index map lookup
    if (this.index.searchIndex[clean]) {
      const wordId = this.index.searchIndex[clean];
      return this.wordById.get(wordId) || null;
    }

    // 2. Variant index lookup
    if (this.index.variantIndex[query]) {
      const wordId = this.index.variantIndex[query];
      return this.wordById.get(wordId) || null;
    }

    // 3. Fallback scan for partial alias match
    for (const word of this.corpus) {
      if (
        word.devanagari === query ||
        word.roman.toLowerCase() === clean ||
        word.aliases.some(a => a.toLowerCase() === clean)
      ) {
        return word;
      }
    }

    return null;
  }

  /**
   * Fast retrieval of all word IDs sharing an ending rhyme key (e.g. 'at', 'aat', 'il', 'oon', 'da', 'gi')
   */
  public getWordIdsByEnding(rhymeKey: string): string[] {
    return this.index.endingBuckets[rhymeKey] || [];
  }

  /**
   * Fast retrieval of all word IDs sharing an IPA vowel nucleus + coda key (e.g. 'ə_t̪', 'aː_t̪', 'uː_n')
   */
  public getWordIdsByNucleusCoda(nucleusCodaKey: string): string[] {
    return this.index.nucleusCodaBuckets[nucleusCodaKey] || [];
  }

  /**
   * Retrieves LexicalEntry by ID
   */
  public getById(id: string): LexicalEntry | null {
    return this.wordById.get(id) || null;
  }

  /**
   * Searches the entire lexicon with frequency-weighted ranking
   */
  public search(query: string, limit: number = 30): LexicalEntry[] {
    if (!query || !query.trim()) {
      return this.corpus.slice(0, limit);
    }

    const clean = query.trim().toLowerCase();
    const directMatch = this.getBySearchForm(clean) || this.getByDevanagari(query);

    const matches: { word: LexicalEntry; rankScore: number }[] = [];
    const seen = new Set<string>();

    if (directMatch) {
      matches.push({ word: directMatch, rankScore: 1000 + (directMatch.frequency || 80) });
      seen.add(directMatch.id);
    }

    for (const word of this.corpus) {
      if (seen.has(word.id)) continue;

      let score = 0;
      if (word.devanagari.includes(query)) score += 500;
      if (word.roman.toLowerCase().includes(clean)) score += 400;
      if (word.meaning.toLowerCase().includes(clean)) score += 200;
      if (word.moods.some(m => m.toLowerCase().includes(clean))) score += 150;
      if (word.category?.some(c => c.toLowerCase().includes(clean))) score += 100;
      if (word.synonyms.some(s => s.includes(query) || s.toLowerCase().includes(clean))) score += 150;

      if (score > 0) {
        matches.push({ word, rankScore: score + (word.frequency || 80) });
        seen.add(word.id);
      }
    }

    matches.sort((a, b) => b.rankScore - a.rankScore);
    return matches.slice(0, limit).map(m => m.word);
  }

  /**
   * Returns total count of words in lexical corpus
   */
  public size(): number {
    return this.corpus.length;
  }

  /**
   * Returns all words
   */
  public getAll(): LexicalEntry[] {
    return this.corpus;
  }
}

export const lexicalDatabase = new LexicalDatabase();
