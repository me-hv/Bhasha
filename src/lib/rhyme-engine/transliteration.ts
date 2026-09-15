import { ROMAN_TO_HINDI_DICTIONARY } from '../../data/roman-mappings';
import { WORDS_DATABASE } from '../../data/words';

/**
 * Normalizes input string (removes punctuation, extra spaces, lowercases)
 */
export function normalizeQuery(query: string): string {
  if (!query) return '';
  return query
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>]/g, '');
}

/**
 * Checks if a string contains Devanagari characters
 */
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Resolves any Roman Hindi or Devanagari input to standard Devanagari word
 */
export function resolveToDevanagari(query: string): { devanagari: string; isDirectMatch: boolean } {
  const clean = normalizeQuery(query);
  if (!clean) return { devanagari: '', isDirectMatch: false };

  // 1. If already Devanagari, check if in word database or return as-is
  if (isDevanagari(clean)) {
    return { devanagari: clean, isDirectMatch: true };
  }

  // 2. Exact match in Roman Hindi dictionary
  if (ROMAN_TO_HINDI_DICTIONARY[clean]) {
    return { devanagari: ROMAN_TO_HINDI_DICTIONARY[clean], isDirectMatch: true };
  }

  // 3. Match against word aliases in WORDS_DATABASE
  for (const word of WORDS_DATABASE) {
    if (word.roman.toLowerCase() === clean || word.aliases.some(a => a.toLowerCase() === clean)) {
      return { devanagari: word.devanagari, isDirectMatch: true };
    }
  }

  // 4. Heuristic phonetic fallback for common Roman variations:
  // e.g. double vowels normalization: 'raaat' -> 'raat', 'dil' -> 'dill'
  const normalizedRoman = clean
    .replace(/aa+/g, 'aa')
    .replace(/ee+/g, 'ee')
    .replace(/oo+/g, 'oo')
    .replace(/sh+/g, 'sh')
    .replace(/kh+/g, 'kh')
    .replace(/gh+/g, 'gh');

  if (ROMAN_TO_HINDI_DICTIONARY[normalizedRoman]) {
    return { devanagari: ROMAN_TO_HINDI_DICTIONARY[normalizedRoman], isDirectMatch: true };
  }

  // Fallback: Return as clean string if no dictionary mapping exists
  return { devanagari: clean, isDirectMatch: false };
}
