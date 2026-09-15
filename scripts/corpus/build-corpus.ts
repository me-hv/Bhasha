/**
 * Pipeline Script: Build Hindustani Language Corpus & Phonetic Rhyme Index
 * Run via: npx tsx scripts/corpus/build-corpus.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { buildCompleteLexicon } from './index-builder';

console.log('🚀 Starting BHASHA Hindustani Corpus Build Pipeline...');

const outputDir = path.resolve(__dirname, '../../src/data/lexicon');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('⏳ Processing lexical sources, phonetics, and inverted indexes...');
const { lexicon, index } = buildCompleteLexicon();

console.log(`✅ Synthesized ${lexicon.length} comprehensive Hindustani Lexical Entries.`);
console.log(`✅ Indexed ${Object.keys(index.endingBuckets).length} Rhyme Ending Buckets.`);
console.log(`✅ Indexed ${Object.keys(index.searchIndex).length} Search Normalized Variations.`);

// 1. Write corpus.json
const corpusPath = path.join(outputDir, 'corpus.json');
fs.writeFileSync(corpusPath, JSON.stringify(lexicon, null, 2), 'utf-8');
console.log(`📁 Written: ${corpusPath} (${(fs.statSync(corpusPath).size / 1024).toFixed(1)} KB)`);

// 2. Write rhyme-index.json
const indexPath = path.join(outputDir, 'rhyme-index.json');
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
console.log(`📁 Written: ${indexPath} (${(fs.statSync(indexPath).size / 1024).toFixed(1)} KB)`);

// 3. Write TypeScript Accessor: index.ts
const tsLoaderContent = `/**
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
`;

const tsLoaderPath = path.join(outputDir, 'index.ts');
fs.writeFileSync(tsLoaderPath, tsLoaderContent, 'utf-8');
console.log(`📁 Written: ${tsLoaderPath}`);

console.log('🎉 Corpus Build Pipeline Completed Successfully!\n');
