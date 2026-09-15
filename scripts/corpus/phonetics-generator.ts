/**
 * Algorithmic Phonetic & Syllable Generator for Hindustani (Hindi + Urdu Loanwords)
 * Derives IPA phonemes, syllable segmentations, rhyme keys, and search variations.
 */

import { PhoneticKey, WordOrigin } from '../../src/types';

// Devanagari Matra to IPA vowel map
export const MATRA_IPA_MAP: Record<string, string> = {
  'ा': 'aː',
  'आ': 'aː',
  'ि': 'ɪ',
  'इ': 'ɪ',
  'ी': 'iː',
  'ई': 'iː',
  'ु': 'ʊ',
  'उ': 'ʊ',
  'ू': 'uː',
  'ऊ': 'uː',
  'े': 'eː',
  'ए': 'eː',
  'ै': 'ɛː',
  'ऐ': 'ɛː',
  'ो': 'oː',
  'ओ': 'oː',
  'ौ': 'ɔː',
  'औ': 'ɔː',
  'ं': '̃',
  'ँ': '̃',
  'ः': 'h',
  'अ': 'ə',
};

// Devanagari Consonants to IPA & Family
export const CONSONANT_IPA_MAP: Record<string, { ipa: string; family: string; romanBase: string }> = {
  // Velars
  'क': { ipa: 'k', family: 'velar-stop', romanBase: 'k' },
  'ख': { ipa: 'kʰ', family: 'velar-stop', romanBase: 'kh' },
  'ग': { ipa: 'ɡ', family: 'velar-stop', romanBase: 'g' },
  'घ': { ipa: 'ɡʱ', family: 'velar-stop', romanBase: 'gh' },
  'ङ': { ipa: 'ŋ', family: 'nasal', romanBase: 'ng' },

  // Palatals & Affricates
  'च': { ipa: 't͡ʃ', family: 'affricate', romanBase: 'ch' },
  'छ': { ipa: 't͡ʃʰ', family: 'affricate', romanBase: 'chh' },
  'ज': { ipa: 'd͡ʒ', family: 'affricate', romanBase: 'j' },
  'झ': { ipa: 'd͡ʒʱ', family: 'affricate', romanBase: 'jh' },
  'ञ': { ipa: 'ɲ', family: 'nasal', romanBase: 'ny' },

  // Retroflex
  'ट': { ipa: 'ʈ', family: 'retroflex-stop', romanBase: 't' },
  'ठ': { ipa: 'ʈʰ', family: 'retroflex-stop', romanBase: 'th' },
  'ड': { ipa: 'ɖ', family: 'retroflex-stop', romanBase: 'd' },
  'ढ': { ipa: 'ɖʱ', family: 'retroflex-stop', romanBase: 'dh' },
  'ण': { ipa: 'ɳ', family: 'nasal', romanBase: 'n' },

  // Dentals
  'त': { ipa: 't̪', family: 'dental-stop', romanBase: 't' },
  'थ': { ipa: 't̪ʰ', family: 'dental-stop', romanBase: 'th' },
  'द': { ipa: 'd̪', family: 'dental-stop', romanBase: 'd' },
  'ध': { ipa: 'd̪ʱ', family: 'dental-stop', romanBase: 'dh' },
  'न': { ipa: 'n', family: 'nasal', romanBase: 'n' },

  // Labials
  'प': { ipa: 'p', family: 'labial-stop', romanBase: 'p' },
  'फ': { ipa: 'pʰ', family: 'labial-stop', romanBase: 'ph' },
  'ब': { ipa: 'b', family: 'labial-stop', romanBase: 'b' },
  'भ': { ipa: 'bʱ', family: 'labial-stop', romanBase: 'bh' },
  'म': { ipa: 'm', family: 'nasal', romanBase: 'm' },

  // Glides & Liquids
  'य': { ipa: 'j', family: 'glide', romanBase: 'y' },
  'र': { ipa: 'r', family: 'liquid', romanBase: 'r' },
  'ल': { ipa: 'l', family: 'liquid', romanBase: 'l' },
  'व': { ipa: 'ʋ', family: 'glide', romanBase: 'v' },

  // Sibilants & Fricatives
  'श': { ipa: 'ʃ', family: 'sibilant', romanBase: 'sh' },
  'ष': { ipa: 'ʂ', family: 'sibilant', romanBase: 'sh' },
  'स': { ipa: 's', family: 'sibilant', romanBase: 's' },
  'ह': { ipa: 'ɦ', family: 'glottal', romanBase: 'h' },

  // Nuqta (Perso-Arabic Loan Sounds)
  'क़': { ipa: 'q', family: 'uvular-stop', romanBase: 'q' },
  'ख़': { ipa: 'x', family: 'velar-fricative', romanBase: 'kh' },
  'ग़': { ipa: 'ɣ', family: 'uvular-fricative', romanBase: 'gh' },
  'ज़': { ipa: 'z', family: 'sibilant', romanBase: 'z' },
  'ड़': { ipa: 'ɽ', family: 'retroflex-flap', romanBase: 'd' },
  'ढ़': { ipa: 'ɽʱ', family: 'retroflex-flap', romanBase: 'dh' },
  'फ़': { ipa: 'f', family: 'labiodental', romanBase: 'f' },
};

/**
 * Normalizes nuqta variations (e.g. 'क़ुदरत' <-> 'कुदरत')
 */
export function removeNuqta(text: string): string {
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
  // Normalize decomposed nukta to precomposed
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
 * Analyzes Devanagari word phonetically:
 * Returns syllables count, syllable segments, IPA phonemes, rhyme key, and coda
 */
export function analyzeDevanagariWord(devanagari: string): {
  syllableCount: number;
  syllableBreakdown: string[];
  phonemes: string[];
  nucleus: string;
  coda: string;
  rhymeKey: string;
  pronunciation: string;
} {
  const clean = addNuqtaStandard(devanagari.trim().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]/g, ''));
  const chars = Array.from(clean);

  const phonemes: string[] = [];
  const syllables: string[] = [];
  let currentSyllable = '';

  let lastVowel = 'ə';
  let lastCoda = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const nextCh = chars[i + 1];

    currentSyllable += ch;

    // 1. Independent Vowel
    if (MATRA_IPA_MAP[ch] && (ch >= 'अ' && ch <= 'औ')) {
      phonemes.push(MATRA_IPA_MAP[ch]);
      lastVowel = MATRA_IPA_MAP[ch];
      syllables.push(currentSyllable);
      currentSyllable = '';
    }
    // 2. Consonant
    else if (CONSONANT_IPA_MAP[ch]) {
      const { ipa } = CONSONANT_IPA_MAP[ch];

      // Check if followed by virama (halant ्)
      if (nextCh === '्') {
        phonemes.push(ipa);
        // Continue syllable
        i++; // skip virama
        currentSyllable += '्';
        if (chars[i + 1]) {
          currentSyllable += chars[i + 1];
          phonemes.push(CONSONANT_IPA_MAP[chars[i + 1]]?.ipa || '');
          i++;
        }
      }
      // Check if followed by matra
      else if (nextCh && MATRA_IPA_MAP[nextCh]) {
        phonemes.push(ipa);
        phonemes.push(MATRA_IPA_MAP[nextCh]);
        lastVowel = MATRA_IPA_MAP[nextCh];
        currentSyllable += nextCh;
        syllables.push(currentSyllable);
        currentSyllable = '';
        i++; // skip matra
      }
      // Implicit inherent schwa /ə/
      else {
        phonemes.push(ipa);
        // Final consonant schwa deletion (e.g. रात /raːt/, not /raːtə/)
        if (i === chars.length - 1 && syllables.length > 0) {
          lastCoda = ipa;
        } else {
          phonemes.push('ə');
          lastVowel = 'ə';
          lastCoda = ipa;
          syllables.push(currentSyllable);
          currentSyllable = '';
        }
      }
    }
    // 3. Trailing Matra
    else if (MATRA_IPA_MAP[ch]) {
      phonemes.push(MATRA_IPA_MAP[ch]);
      lastVowel = MATRA_IPA_MAP[ch];
      syllables.push(currentSyllable);
      currentSyllable = '';
    }
  }

  if (currentSyllable) {
    if (syllables.length > 0) {
      syllables[syllables.length - 1] += currentSyllable;
    } else {
      syllables.push(currentSyllable);
    }
  }

  const syllableCount = Math.max(1, syllables.length);

  // Derive rhyme key token (e.g. 'aat', 'at', 'il', 'ar', 'oon', 'da', 'gi', 'ai')
  let rhymeKey = 'aat';
  const cleanNoNuqta = removeNuqta(clean);

  if (cleanNoNuqta.endsWith('ात') || cleanNoNuqta.endsWith('ाथ')) {
    rhymeKey = 'aat';
  } else if (cleanNoNuqta.endsWith('त') || cleanNoNuqta.endsWith('थ')) {
    rhymeKey = 'at';
  } else if (cleanNoNuqta.endsWith('िल') || cleanNoNuqta.endsWith('ील')) {
    rhymeKey = 'il';
  } else if (cleanNoNuqta.endsWith('ार')) {
    rhymeKey = 'aar';
  } else if (cleanNoNuqta.endsWith('र')) {
    rhymeKey = 'ar';
  } else if (cleanNoNuqta.endsWith('ाब') || cleanNoNuqta.endsWith('ाप')) {
    rhymeKey = 'aab';
  } else if (cleanNoNuqta.endsWith('ून') || cleanNoNuqta.endsWith('ुन')) {
    rhymeKey = 'oon';
  } else if (cleanNoNuqta.endsWith('ूर') || cleanNoNuqta.endsWith('ुर')) {
    rhymeKey = 'oor';
  } else if (cleanNoNuqta.endsWith('ी') || cleanNoNuqta.endsWith('ि')) {
    rhymeKey = 'ee';
  } else if (cleanNoNuqta.endsWith('ाई') || cleanNoNuqta.endsWith('ाय')) {
    rhymeKey = 'aai';
  } else if (cleanNoNuqta.endsWith('ान') || cleanNoNuqta.endsWith('ाम')) {
    rhymeKey = 'aan';
  } else if (cleanNoNuqta.endsWith('ाग') || cleanNoNuqta.endsWith('ाक')) {
    rhymeKey = 'aag';
  } else if (cleanNoNuqta.endsWith('ा') || cleanNoNuqta.endsWith('दा') || cleanNoNuqta.endsWith('फ़ा') || cleanNoNuqta.endsWith('फा')) {
    rhymeKey = 'aa';
  } else if (cleanNoNuqta.endsWith('क्त') || cleanNoNuqta.endsWith('ख्त')) {
    rhymeKey = 'akht';
  } else if (cleanNoNuqta.endsWith('िश') || cleanNoNuqta.endsWith('ीश')) {
    rhymeKey = 'ish';
  } else if (cleanNoNuqta.endsWith('दर') || cleanNoNuqta.endsWith('बर') || cleanNoNuqta.endsWith('हर')) {
    rhymeKey = 'ar';
  } else {
    // Default to last 2 Devanagari chars or vowel+consonant
    rhymeKey = clean.slice(-2);
  }

  const pronunciation = `/${phonemes.filter(Boolean).join('')}/`;

  return {
    syllableCount,
    syllableBreakdown: syllables,
    phonemes,
    nucleus: lastVowel,
    coda: lastCoda || (phonemes[phonemes.length - 1] || 't̪'),
    rhymeKey,
    pronunciation,
  };
}

/**
 * Generates rich Roman search variations for a word
 */
export function generateRomanVariations(devanagari: string, primaryRoman: string): string[] {
  const set = new Set<string>();
  const base = primaryRoman.toLowerCase().trim();
  set.add(base);

  // Vowel length & sound variations
  set.add(base.replace(/aa/g, 'a'));
  set.add(base.replace(/a(?=[^a]|$)/g, 'aa'));
  set.add(base.replace(/ee/g, 'i'));
  set.add(base.replace(/i(?=[^i]|$)/g, 'ee'));
  set.add(base.replace(/oo/g, 'u'));
  set.add(base.replace(/u(?=[^u]|$)/g, 'oo'));
  set.add(base.replace(/o/g, 'u'));
  set.add(base.replace(/u/g, 'o'));

  // Consonant sound variations
  set.add(base.replace(/q/g, 'k'));
  set.add(base.replace(/k(?=[^h]|$)/g, 'q'));
  set.add(base.replace(/f/g, 'ph'));
  set.add(base.replace(/ph/g, 'f'));
  set.add(base.replace(/z/g, 'j'));
  set.add(base.replace(/j(?=[^h]|$)/g, 'z'));
  set.add(base.replace(/v/g, 'w'));
  set.add(base.replace(/w/g, 'v'));
  set.add(base.replace(/sh/g, 's'));
  set.add(base.replace(/kh/g, 'k'));

  // Common Hindi slang / colloquial suffixes
  if (base.endsWith('at')) set.add(base + 'h');
  if (base.endsWith('ath')) set.add(base.slice(0, -1));

  return Array.from(set).filter(v => v.length > 0);
}
