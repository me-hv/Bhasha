/**
 * Search & Discovery Service Layer
 * Clean unified interface connecting UI to the Lexical Database, Rhyme Engine, and Project Workspace
 */

import { LexicalEntry, WordEntry, RhymeResult, RelatedWordGraph, Song, SavedWord, CreativeIdea } from '../../types';
import { getRhymes, getWord, searchDictionary } from '../language-engine/rhyme-engine';
import { normalizeRomanHindi, resolveToDevanagari } from '../language-engine/normalizer';
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
   * Searches Songs by title, section headers, and lyrics
   */
  public searchSongs(query: string, songs: Song[]): { song: Song; matchType: 'title' | 'section' | 'lyrics'; matchedSnippet?: string }[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: { song: Song; matchType: 'title' | 'section' | 'lyrics'; matchedSnippet?: string }[] = [];

    for (const song of songs) {
      if (song.title.toLowerCase().includes(q)) {
        results.push({ song, matchType: 'title' });
        continue;
      }

      // Check sections and lyrics
      const lines = (song.content || '').split('\n');
      let matchedLine: string | undefined;
      let isSectionMatch = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes(q)) {
          matchedLine = trimmed;
          if (trimmed.startsWith('[') || trimmed.startsWith('##')) {
            isSectionMatch = true;
          }
          break;
        }
      }

      if (matchedLine) {
        results.push({
          song,
          matchType: isSectionMatch ? 'section' : 'lyrics',
          matchedSnippet: matchedLine,
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
    const q = query.toLowerCase().trim();

    return lexicon.filter(w => (
      w.devanagari.toLowerCase().includes(q) ||
      w.roman.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      (w.notes && w.notes.toLowerCase().includes(q)) ||
      (w.personalNote && w.personalNote.toLowerCase().includes(q)) ||
      (w.tags && w.tags.some(t => t.toLowerCase().includes(q))) ||
      (w.collections && w.collections.some(c => c.toLowerCase().includes(q)))
    ));
  }

  /**
   * Searches Creative Ideas
   */
  public searchIdeas(query: string, ideas: CreativeIdea[]): CreativeIdea[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return ideas.filter(i => (
      i.title.toLowerCase().includes(q) ||
      i.content.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q)) ||
      (i.relatedWords && i.relatedWords.some(w => w.toLowerCase().includes(q)))
    ));
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
