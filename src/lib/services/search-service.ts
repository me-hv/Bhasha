/**
 * Search & Discovery Service Layer
 * Clean unified interface connecting UI to the Lexical Database, Rhyme Engine, and Project Workspace
 * Hardened with phonetic normalization, Nuqta equivalence, and index reconstruction.
 */

import { LexicalEntry, RhymeResult, RelatedWordGraph, Song, SavedWord, CreativeIdea } from '../../types';
import { getRhymes, getWord, searchDictionary } from '../language-engine/rhyme-engine';
import { normalizeRomanHindi, resolveToDevanagari, removeNuqta, isDevanagari } from '../language-engine/normalizer';
import { lexicalDatabase } from '../language-engine/lexical-database';

export interface GlobalSearchResult {
  songs: {
    song: Song;
    matchType: 'title' | 'section' | 'lyrics';
    matchedSnippet?: string;
  }[];
  lexicon: SavedWord[];
  ideas: CreativeIdea[];
  dictionaryMatches: LexicalEntry[];
  rhymeResult?: RhymeResult;
}

export class SearchService {
  private lastIndexRebuiltAt: string = new Date().toISOString();

  /**
   * Generates search token variants for robust multilingual matching:
   * 1. Exact lowercase
   * 2. Nuqta-stripped Devanagari (e.g. क़ismat <-> kismat / किस्मत)
   * 3. Roman Hindi normalized (e.g. raaaat -> raat)
   * 4. Transliterated Devanagari candidate
   */
  public getSearchVariants(text: string): string[] {
    if (!text || typeof text !== 'string') return [];
    const trimmed = text.trim().toLowerCase();
    if (!trimmed) return [];

    const variants = new Set<string>();
    variants.add(trimmed);
    variants.add(trimmed.normalize('NFC'));
    variants.add(trimmed.normalize('NFD'));

    if (isDevanagari(trimmed)) {
      const noNuqta = removeNuqta(trimmed);
      variants.add(noNuqta);
      const entry = lexicalDatabase.getByDevanagari(noNuqta) || lexicalDatabase.getByDevanagari(trimmed);
      if (entry?.roman) {
        variants.add(entry.roman.toLowerCase());
        variants.add(normalizeRomanHindi(entry.roman.toLowerCase()));
      }
    } else {
      // Roman Hindi
      const normRoman = normalizeRomanHindi(trimmed);
      variants.add(normRoman);
      const resolved = resolveToDevanagari(normRoman).devanagari;
      if (resolved && resolved !== normRoman) {
        variants.add(resolved);
        variants.add(removeNuqta(resolved));
      }
    }

    return Array.from(variants).filter(Boolean);
  }

  /**
   * Helper checking if target string contains any variant of query
   */
  public matchesQuery(target: string | undefined | null, queryVariants: string[]): boolean {
    if (!target || typeof target !== 'string') return false;
    const targetNorm = target.toLowerCase();

    // 1. Fast path: direct inclusion of any query variant
    for (const q of queryVariants) {
      if (targetNorm.includes(q)) return true;
    }

    // 2. Nuqta-tolerant path for Devanagari targets
    if (/[\u0900-\u097F]/.test(targetNorm)) {
      const targetNoNuqta = removeNuqta(targetNorm);
      for (const q of queryVariants) {
        if (targetNoNuqta.includes(q)) return true;
      }
    }

    return false;
  }

  /**
   * Rebuilds / warms the search index across all active project entities
   */
  public rebuildSearchIndex(
    songs?: Song[],
    lexicon?: SavedWord[],
    ideas?: CreativeIdea[]
  ): {
    indexedSongs: number;
    indexedLexicon: number;
    indexedIdeas: number;
    indexedCorpus: number;
    timestamp: string;
  } {
    this.lastIndexRebuiltAt = new Date().toISOString();

    return {
      indexedSongs: songs ? songs.length : 0,
      indexedLexicon: lexicon ? lexicon.length : 0,
      indexedIdeas: ideas ? ideas.length : 0,
      indexedCorpus: lexicalDatabase.size(),
      timestamp: this.lastIndexRebuiltAt,
    };
  }

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
   * Searches Songs by title, section headers, notes, tags, and lyrics
   */
  public searchSongs(
    query: string,
    songs: Song[]
  ): { song: Song; matchType: 'title' | 'section' | 'lyrics'; matchedSnippet?: string }[] {
    if (!query.trim()) return [];
    const queryVariants = this.getSearchVariants(query);
    const results: { song: Song; matchType: 'title' | 'section' | 'lyrics'; matchedSnippet?: string }[] = [];

    for (const song of songs) {
      if (this.matchesQuery(song.title, queryVariants)) {
        results.push({ song, matchType: 'title' });
        continue;
      }

      // Fast check if content matches before line-by-line inspection
      if (song.content && this.matchesQuery(song.content, queryVariants)) {
        const lines = song.content.split('\n');
        let matchedLine: string | undefined;
        let isSectionMatch = false;

        for (const line of lines) {
          const trimmed = line.trim();
          if (this.matchesQuery(trimmed, queryVariants)) {
            matchedLine = trimmed;
            if (trimmed.startsWith('[') || trimmed.startsWith('##')) {
              isSectionMatch = true;
            }
            break;
          }
        }

        results.push({
          song,
          matchType: isSectionMatch ? 'section' : 'lyrics',
          matchedSnippet: matchedLine || song.content.slice(0, 80),
        });
        continue;
      }

      if (song.notes && this.matchesQuery(song.notes, queryVariants)) {
        results.push({
          song,
          matchType: 'lyrics',
          matchedSnippet: song.notes.slice(0, 80),
        });
      }
    }

    return results;
  }

  /**
   * Searches Saved Lexicon
   */
  public searchSavedLexicon(query: string, lexicon: SavedWord[]): SavedWord[] {
    if (!query.trim()) return [];
    const queryVariants = this.getSearchVariants(query);

    return lexicon.filter((w) => {
      if (this.matchesQuery(w.devanagari, queryVariants)) return true;
      if (this.matchesQuery(w.roman, queryVariants)) return true;
      if (this.matchesQuery(w.meaning, queryVariants)) return true;
      if (w.notes && this.matchesQuery(w.notes, queryVariants)) return true;
      if (w.personalNote && this.matchesQuery(w.personalNote, queryVariants)) return true;
      if (w.tags && w.tags.some((t) => this.matchesQuery(t, queryVariants))) return true;
      if (w.collections && w.collections.some((c) => this.matchesQuery(c, queryVariants))) return true;
      return false;
    });
  }

  /**
   * Searches Creative Ideas
   */
  public searchIdeas(query: string, ideas: CreativeIdea[]): CreativeIdea[] {
    if (!query.trim()) return [];
    const queryVariants = this.getSearchVariants(query);

    return ideas.filter((i) => {
      if (this.matchesQuery(i.title, queryVariants)) return true;
      if (this.matchesQuery(i.content, queryVariants)) return true;
      if (i.tags && i.tags.some((t) => this.matchesQuery(t, queryVariants))) return true;
      if (i.relatedWords && i.relatedWords.some((w) => this.matchesQuery(w, queryVariants))) return true;
      return false;
    });
  }

  /**
   * Unified Global Search across Songs, Lyrics, Lexicon, and Ideas
   */
  public globalSearch(
    query: string,
    songs: Song[],
    lexicon: SavedWord[],
    ideas: CreativeIdea[]
  ): GlobalSearchResult {
    const matchedSongs = this.searchSongs(query, songs);
    const matchedLexicon = this.searchSavedLexicon(query, lexicon);
    const matchedIdeas = this.searchIdeas(query, ideas);
    const dictionaryMatches = searchDictionary(query, 5);
    const rhymeResult = getRhymes(query);

    return {
      songs: matchedSongs,
      lexicon: matchedLexicon,
      ideas: matchedIdeas,
      dictionaryMatches,
      rhymeResult: rhymeResult.totalMatches > 0 ? rhymeResult : undefined,
    };
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

