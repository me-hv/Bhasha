/**
 * Search & Discovery Service Layer
 * Clean unified interface connecting UI to the Lexical Database & Rhyme Engine
 */

import { LexicalEntry, WordEntry, RhymeResult, RelatedWordGraph } from '../../types';
import { getRhymes, getWord, searchDictionary } from '../language-engine/rhyme-engine';
import { normalizeRomanHindi, resolveToDevanagari } from '../language-engine/normalizer';
import { lexicalDatabase } from '../language-engine/lexical-database';

export class SearchService {
  /**
   * Discovers and scores rhymes for a word or Roman Hindi query
   */
  public getRhymes(query: string): RhymeResult {
    return getRhymes(query);
  }

  /**
   * Retrieves full details for a word
   */
  public getWord(query: string): LexicalEntry | null {
    return getWord(query);
  }

  /**
   * Searches the lexicon by text query with frequency-weighted ranking
   */
  public search(query: string, limit: number = 40): LexicalEntry[] {
    return searchDictionary(query, limit);
  }

  /**
   * Normalizes Roman Hindi input
   */
  public normalize(input: string): string {
    return normalizeRomanHindi(input);
  }

  /**
   * Resolves to Devanagari
   */
  public resolve(input: string): string {
    return resolveToDevanagari(input).devanagari;
  }

  /**
   * Gets structured Related Word Graph (Visual, Emotion, Sound, Place) for a word
   */
  public getRelatedGraph(query: string): RelatedWordGraph | null {
    const word = getWord(query);
    if (!word) return null;
    return (
      word.relatedGraph || {
        general: word.relatedImagery,
      }
    );
  }

  /**
   * Returns all words in the complete Hindustani corpus
   */
  public getAllWords(): LexicalEntry[] {
    return lexicalDatabase.getAll();
  }

  /**
   * Total words indexed in the system
   */
  public getCorpusSize(): number {
    return lexicalDatabase.size();
  }
}

export const searchService = new SearchService();
