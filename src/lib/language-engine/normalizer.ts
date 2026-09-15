/**
 * Universal Roman Hindi, Hinglish & Devanagari Normalization Engine
 * Converts colloquial, Hinglish, and varied phonetic Roman spellings to canonical Devanagari.
 */

import { ROMAN_TO_HINDI_DICTIONARY } from '../../data/roman-mappings';
import { lexicalDatabase } from './lexical-database';

/**
 * Checks if a string contains Devanagari characters
 */
export function isDevanagari(text: string): boolean {
  if (!text) return false;
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Normalizes nuqta variations in Devanagari text
 */
export function removeNuqta(text: string): string {
  if (!text) return '';
  return text
    .replace(/क़/g, 'क')
    .replace(/ख़/g, 'ख')
    .replace(/ग़/g, 'ग')
    .replace(/ज़/g, 'ज')
    .replace(/ड़/g, 'ड')
    .replace(/ढ़/g, 'ढ')
    .replace(/फ़/g, 'फ')
    .replace(/\u093C/g, ''); // Devanagari Sign Nukta
}

export function addNuqtaStandard(text: string): string {
  if (!text) return '';
  return text
    .replace(/क\u093C/g, 'क़')
    .replace(/ख\u093C/g, 'ख़')
    .replace(/ग\u093C/g, 'ग़')
    .replace(/ज\u093C/g, 'ज़')
    .replace(/ड\u093C/g, 'ड़')
    .replace(/ढ\u093C/g, 'ढ़')
    .replace(/फ\u093C/g, 'फ़');
}

/**
 * Strips diacritics and maps accented Latin vowels/consonants to standard ASCII Roman Hindi
 */
export function stripDiacritics(text: string): string {
  if (!text) return '';
  return text
    .replace(/[āâ]/g, 'aa')
    .replace(/[īî]/g, 'ee')
    .replace(/[ūû]/g, 'oo')
    .replace(/[ēê]/g, 'e')
    .replace(/[ōô]/g, 'o')
    .replace(/[śṣ]/g, 'sh')
    .replace(/[ṇñ]/g, 'n')
    .replace(/[ṭ]/g, 't')
    .replace(/[ḍ]/g, 'd')
    .replace(/[ṛ]/g, 'ri')
    .replace(/[z़]/g, 'z')
    .replace(/[q]/g, 'k');
}

/**
 * Normalizes Roman Hindi input by:
 * 1. Lowercasing & trimming
 * 2. Stripping punctuation and symbols
 * 3. Removing diacritics
 * 4. Normalizing repeated vowels (e.g. 'raaaat' -> 'raat', 'dillll' -> 'dil')
 */
export function normalizeRomanHindi(input: string): string {
  if (!input) return '';
  
  // 1. Lowercase & trim
  let clean = input.trim().toLowerCase();

  // If input is Devanagari, strip punctuation and return
  if (isDevanagari(clean)) {
    return clean.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]/g, '').trim();
  }

  // 2. Strip diacritics
  clean = stripDiacritics(clean);

  // 3. Remove punctuation
  clean = clean.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>]/g, '');

  // 4. Normalize vowel lengthening
  clean = clean
    .replace(/a{3,}/g, 'aa')
    .replace(/e{3,}/g, 'ee')
    .replace(/o{3,}/g, 'oo')
    .replace(/i{3,}/g, 'ee')
    .replace(/u{3,}/g, 'oo');

  // 5. Normalize common consonant elongations (e.g. 'dill' -> 'dil', 'shhh' -> 'sh')
  clean = clean
    .replace(/l{2,}/g, 'l')
    .replace(/s{3,}/g, 's')
    .replace(/z{2,}/g, 'z')
    .replace(/h{3,}/g, 'h');

  return clean;
}

/**
 * Resolves any Roman Hindi, Hinglish, or Devanagari input to canonical Devanagari representation.
 */
export function resolveToDevanagari(query: string): { devanagari: string; isDirectMatch: boolean } {
  const normalized = normalizeRomanHindi(query);
  if (!normalized) return { devanagari: '', isDirectMatch: false };

  // 1. Check in-memory indexed LexicalDatabase first (O(1))
  const lexWord = isDevanagari(normalized)
    ? lexicalDatabase.getByDevanagari(normalized)
    : lexicalDatabase.getBySearchForm(normalized);

  if (lexWord) {
    return { devanagari: lexWord.devanagari, isDirectMatch: true };
  }

  // 2. If Devanagari without matching lexical entry, return cleaned Devanagari
  if (isDevanagari(normalized)) {
    return { devanagari: normalized, isDirectMatch: true };
  }

  // 3. Exact match in Roman Hindi mapping table
  if (ROMAN_TO_HINDI_DICTIONARY[normalized]) {
    return { devanagari: ROMAN_TO_HINDI_DICTIONARY[normalized], isDirectMatch: true };
  }

  // 4. Heuristic phonetic fallback variations:
  // e.g. 'zindagee' -> 'zindagi', 'piyaar' -> 'pyaar', 'khwab' -> 'khwaab'
  const variantRules = [
    normalized.replace(/ee$/, 'i'),
    normalized.replace(/i$/, 'ee'),
    normalized.replace(/aa/g, 'a'),
    normalized.replace(/a/g, 'aa'),
    normalized.replace(/iya/g, 'ya'),
    normalized.replace(/z/g, 'j'),
    normalized.replace(/j/g, 'z'),
    normalized.replace(/sh/g, 's'),
    normalized.replace(/s/g, 'sh'),
    normalized.replace(/v/g, 'w'),
    normalized.replace(/w/g, 'v'),
    normalized.replace(/kh/g, 'k'),
    normalized.replace(/q/g, 'k'),
    normalized.replace(/k/g, 'q'),
    normalized.replace(/f/g, 'ph'),
    normalized.replace(/ph/g, 'f'),
    normalized.replace(/u/g, 'o'),
    normalized.replace(/o/g, 'u'),
    normalized.replace(/h/g, ''),
  ];

  for (const variant of variantRules) {
    const vMatch = lexicalDatabase.getBySearchForm(variant);
    if (vMatch) {
      return { devanagari: vMatch.devanagari, isDirectMatch: true };
    }
    if (ROMAN_TO_HINDI_DICTIONARY[variant]) {
      return { devanagari: ROMAN_TO_HINDI_DICTIONARY[variant], isDirectMatch: true };
    }
  }

  // 5. Return the normalized input as fallback
  return { devanagari: normalized, isDirectMatch: false };
}
