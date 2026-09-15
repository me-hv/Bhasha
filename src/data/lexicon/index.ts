/**
 * Generated In-Memory Hindustani Corpus & Inverted Rhyme Index Loader
 */

import { LexicalEntry, InvertedRhymeIndex } from '../../types';
import rawCorpus from './corpus.json';
import rawIndex from './rhyme-index.json';

export const HINDUSTANI_CORPUS: LexicalEntry[] = rawCorpus as LexicalEntry[];
export const HINDUSTANI_RHYME_INDEX: InvertedRhymeIndex = rawIndex as InvertedRhymeIndex;

export const HINDUSTANI_WORD_BY_ID = new Map<string, LexicalEntry>();
export const HINDUSTANI_WORD_BY_DEVANAGARI = new Map<string, LexicalEntry>();

for (const word of HINDUSTANI_CORPUS) {
  HINDUSTANI_WORD_BY_ID.set(word.id, word);
  HINDUSTANI_WORD_BY_DEVANAGARI.set(word.devanagari, word);
  if (word.variants) {
    for (const v of word.variants) {
      if (!HINDUSTANI_WORD_BY_DEVANAGARI.has(v)) {
        HINDUSTANI_WORD_BY_DEVANAGARI.set(v, word);
      }
    }
  }
}
