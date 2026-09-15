/**
 * Devanagari and Roman Hindi Phonetic Analysis & Coda Extraction
 */

// Devanagari Matras & Diacritics
export const MATRAS = {
  AA: 'ा',
  I_SHORT: 'ि',
  I_LONG: 'ी',
  U_SHORT: 'ु',
  U_LONG: 'ू',
  E: 'े',
  AI: 'ै',
  O: 'ो',
  AU: 'ौ',
  ANUSVARA: 'ं',
  CHANDRABINDU: 'ँ',
  VISARGA: 'ः',
  VIRAMA: '्',
  NUKTA: '़',
};

/**
 * Extracts the phonetic rhyming ending (coda) from a Devanagari word
 */
export function extractDevanagariCoda(word: string): string {
  if (!word) return '';
  const clean = word.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  if (!clean) return '';

  // Return last 2-3 characters for phonetic clustering
  if (clean.length <= 2) return clean;
  return clean.slice(-2);
}

/**
 * Estimates syllable count for a Hindi/Hinglish word or phrase
 */
export function countSyllables(text: string): number {
  if (!text || !text.trim()) return 0;
  const words = text.trim().split(/\s+/);
  
  let total = 0;
  for (const word of words) {
    total += countWordSyllables(word);
  }
  return total;
}

export function countWordSyllables(word: string): number {
  if (!word) return 0;
  const clean = word.trim().toLowerCase();
  
  // Check if Devanagari
  const isDevanagari = /[\u0900-\u097F]/.test(clean);
  if (isDevanagari) {
    // Count Devanagari vowels and consonants with inherent 'a'
    let syllables = 0;
    const chars = Array.from(clean);
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const code = char.charCodeAt(0);
      
      // Independent vowels (अ, आ, इ, ई, etc.)
      if (code >= 0x0904 && code <= 0x0914) {
        syllables++;
      }
      // Consonants (क to ह)
      else if (code >= 0x0915 && code <= 0x0939) {
        // Check if followed by virama (्) -> conjunct consonant (doesn't form new syllable)
        const nextChar = chars[i + 1];
        if (nextChar !== MATRAS.VIRAMA) {
          // If it's the very last consonant with no matra, Hindi schwa deletion usually makes it codal
          if (i === chars.length - 1 && syllables > 0) {
            // Hindi schwa deletion: final consonant usually has no vowel sound (e.g. रात is 1 syllable, शहर is 2)
            // But if it's the only consonant, it's 1 syllable
            if (syllables === 0) syllables = 1;
          } else {
            syllables++;
          }
        }
      }
    }
    return Math.max(1, syllables);
  }

  // Roman Hindi / English estimation
  // Normalize Roman Hindi vowels
  const romanClean = clean.replace(/[^a-z]/g, '');
  if (!romanClean) return 1;
  
  // Count vowel groups in Roman Hindi
  const vowelMatches = romanClean.match(/[aeiouy]+/g);
  if (!vowelMatches) return 1;
  
  let count = vowelMatches.length;
  // Adjust for silent e at end (though rare in Roman Hindi, common in Hinglish)
  if (romanClean.endsWith('e') && count > 1 && !romanClean.endsWith('ee') && !romanClean.endsWith('te') && !romanClean.endsWith('se')) {
    count--;
  }
  
  return Math.max(1, count);
}

/**
 * Calculates phonetic similarity score (0 to 1) between two words
 */
export function calculatePhoneticSimilarity(wordA: string, wordB: string): number {
  if (wordA === wordB) return 1.0;
  
  const codaA = extractDevanagariCoda(wordA);
  const codaB = extractDevanagariCoda(wordB);
  
  if (codaA === codaB) return 0.9;
  
  // Check if last character matches
  if (wordA.slice(-1) === wordB.slice(-1)) return 0.6;
  
  return 0.2;
}
