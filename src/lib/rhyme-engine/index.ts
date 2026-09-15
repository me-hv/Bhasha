/**
 * Public Language Engine facade
 * Re-exports from src/lib/language-engine/ and services
 */

export { getRhymes, getWord, searchDictionary, getWord as getWordDetails, searchDictionary as searchLexicon } from '../language-engine/rhyme-engine';
export { normalizeRomanHindi, resolveToDevanagari, isDevanagari } from '../language-engine/normalizer';
export { extractPhoneticKey, calculatePhoneticRhymeScore, countSyllables, countWordSyllables } from '../language-engine/phonetics';
export { searchService } from '../services/search-service';
