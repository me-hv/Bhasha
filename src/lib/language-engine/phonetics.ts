/**
 * Hindi / Devanagari & Hinglish Phonetic Sound & Sequence Engine
 * Extracts acoustic syllable structures, aligns phonetic sequences from the end,
 * and performs deterministic multi-syllabic rhyme scoring and classification.
 */

import {
  PhoneticKey,
  PhoneticSyllable,
  PhoneticSequence,
  DetailedRhymeScore,
  RhymeType,
  RhymeCategory,
} from '../../types';

// Devanagari Matras & Independent Vowels -> IPA
export const DEVANAGARI_VOWELS: Record<string, string> = {
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
  'ं': 'n',
  'ँ': 'nasal',
};

// Consonants -> Family & IPA
export const CONSONANT_FAMILIES: Record<string, { family: string; ipa: string }> = {
  // Dentals
  'त': { family: 'dental-stop', ipa: 't̪' },
  'थ': { family: 'dental-stop', ipa: 't̪ʰ' },
  'द': { family: 'dental-stop', ipa: 'd̪' },
  'ध': { family: 'dental-stop', ipa: 'd̪ʱ' },

  // Labials
  'प': { family: 'labial-stop', ipa: 'p' },
  'फ': { family: 'labial-stop', ipa: 'pʰ' },
  'ब': { family: 'labial-stop', ipa: 'b' },
  'भ': { family: 'labial-stop', ipa: 'bʱ' },

  // Velars
  'क': { family: 'velar-stop', ipa: 'k' },
  'ख': { family: 'velar-stop', ipa: 'kʰ' },
  'ग': { family: 'velar-stop', ipa: 'ɡ' },
  'घ': { family: 'velar-stop', ipa: 'ɡʱ' },
  'क़': { family: 'uvular-stop', ipa: 'q' },
  'ख़': { family: 'velar-fricative', ipa: 'x' },
  'ग़': { family: 'uvular-fricative', ipa: 'ɣ' },

  // Retroflex
  'ट': { family: 'retroflex-stop', ipa: 'ʈ' },
  'ठ': { family: 'retroflex-stop', ipa: 'ʈʰ' },
  'ड': { family: 'retroflex-stop', ipa: 'ɖ' },
  'ढ': { family: 'retroflex-stop', ipa: 'ɖʱ' },
  'ड़': { family: 'retroflex-flap', ipa: 'ɽ' },
  'ढ़': { family: 'retroflex-flap', ipa: 'ɽʱ' },

  // Sibilants & Affricates
  'स': { family: 'sibilant', ipa: 's' },
  'श': { family: 'sibilant', ipa: 'ʃ' },
  'ष': { family: 'sibilant', ipa: 'ʂ' },
  'ज़': { family: 'sibilant', ipa: 'z' },
  'ज': { family: 'affricate', ipa: 'd͡ʒ' },
  'झ': { family: 'affricate', ipa: 'd͡ʒʱ' },
  'च': { family: 'affricate', ipa: 't͡ʃ' },
  'छ': { family: 'affricate', ipa: 't͡ʃʰ' },
  'ह': { family: 'glottal', ipa: 'ɦ' },
  'फ़': { family: 'labiodental', ipa: 'f' },

  // Liquids & Glides
  'र': { family: 'liquid', ipa: 'r' },
  'ल': { family: 'liquid', ipa: 'l' },
  'य': { family: 'glide', ipa: 'j' },
  'व': { family: 'glide', ipa: 'ʋ' },

  // Nasals
  'म': { family: 'nasal', ipa: 'm' },
  'न': { family: 'nasal', ipa: 'n' },
  'ण': { family: 'nasal', ipa: 'ɳ' },
};

/**
 * Counts syllables accurately for Hindi / Hinglish text
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
  return toPhoneticSequence(word).syllableCount;
}

/**
 * Segments a Devanagari word into linguistic syllables with Hindi schwa syncope and coda rules
 */
function segmentDevanagari(text: string): PhoneticSyllable[] {
  const clean = text.trim();
  if (!clean) return [{ nucleus: 'ə', fullIPA: 'ə' }];

  const rawChars = Array.from(clean);
  // Pre-process: merge combining nuqta (U+093C) with preceding consonant
  const chars: string[] = [];
  for (let j = 0; j < rawChars.length; j++) {
    if (rawChars[j + 1] === '़') {
      chars.push(rawChars[j] + '़');
      j++; // skip nuqta
    } else {
      chars.push(rawChars[j]);
    }
  }

  // Intermediate Akshara unit
  interface AksharaUnit {
    onsetIPA: string;
    vowelIPA: string;
    hasMatra: boolean;
    hasAnusvara: boolean;
    isHalfConsonant: boolean;
    rawText: string;
  }

  const units: AksharaUnit[] = [];
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    const nextCh = chars[i + 1];

    // Case 1: Independent Vowels
    if (['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'].includes(ch)) {
      let vowelIPA = ch === 'अ' ? 'ə' : DEVANAGARI_VOWELS[ch] || 'aː';
      let hasAnusvara = false;
      let rawText = ch;
      i++;
      if (chars[i] === 'ं' || chars[i] === 'ँ') {
        hasAnusvara = true;
        rawText += chars[i];
        i++;
      }
      units.push({
        onsetIPA: '',
        vowelIPA,
        hasMatra: true,
        hasAnusvara,
        isHalfConsonant: false,
        rawText,
      });
      continue;
    }

    // Case 2: Consonants
    if (CONSONANT_FAMILIES[ch]) {
      let onsetIPA = CONSONANT_FAMILIES[ch].ipa;
      let rawText = ch;
      i++;

      // Check for virama (half consonant)
      if (chars[i] === '्') {
        rawText += '्';
        i++;
        units.push({
          onsetIPA,
          vowelIPA: '',
          hasMatra: false,
          hasAnusvara: false,
          isHalfConsonant: true,
          rawText,
        });
        continue;
      }

      // Check for dependent matra
      let vowelIPA = 'ə';
      let hasMatra = false;
      if (chars[i] && DEVANAGARI_VOWELS[chars[i]] && !['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'ं', 'ँ'].includes(chars[i])) {
        vowelIPA = DEVANAGARI_VOWELS[chars[i]];
        hasMatra = true;
        rawText += chars[i];
        i++;
      }

      // Check for anusvara/chandrabindu
      let hasAnusvara = false;
      if (chars[i] === 'ं' || chars[i] === 'ँ') {
        hasAnusvara = true;
        rawText += chars[i];
        i++;
      }

      units.push({
        onsetIPA,
        vowelIPA,
        hasMatra,
        hasAnusvara,
        isHalfConsonant: false,
        rawText,
      });
      continue;
    }

    // Fallback for any other char
    i++;
  }

  if (units.length === 0) return [{ nucleus: 'ə', fullIPA: 'ə' }];

  // Build Syllables from Akshara Units
  const syllables: PhoneticSyllable[] = [];

  for (let u = 0; u < units.length; u++) {
    const unit = units[u];
    const prevSyllable = syllables.length > 0 ? syllables[syllables.length - 1] : null;
    const nextUnit = u + 1 < units.length ? units[u + 1] : null;

    // A. Half consonant (with virama)
    if (unit.isHalfConsonant) {
      if (prevSyllable) {
        // Coda of preceding syllable (e.g. dard -> d̪ərd̪, waqt -> ʋəkt̪)
        prevSyllable.coda = (prevSyllable.coda || '') + unit.onsetIPA;
        prevSyllable.fullIPA = `${prevSyllable.onset || ''}${prevSyllable.nucleus}${prevSyllable.coda}`;
        prevSyllable.devanagari = (prevSyllable.devanagari || '') + unit.rawText;
      } else {
        // Starting onset cluster (e.g. pyaar -> pj)
        if (nextUnit && !nextUnit.isHalfConsonant) {
          nextUnit.onsetIPA = unit.onsetIPA + nextUnit.onsetIPA;
          nextUnit.rawText = unit.rawText + nextUnit.rawText;
        }
      }
      continue;
    }

    // B. Word-final consonant with no matra and no anusvara
    // Attaches as coda to the previous syllable if one exists
    const isWordFinalConsonant =
      u === units.length - 1 &&
      !unit.hasMatra &&
      !unit.hasAnusvara &&
      unit.onsetIPA !== '' &&
      prevSyllable !== null;

    if (isWordFinalConsonant && prevSyllable) {
      prevSyllable.coda = (prevSyllable.coda || '') + unit.onsetIPA;
      prevSyllable.fullIPA = `${prevSyllable.onset || ''}${prevSyllable.nucleus}${prevSyllable.coda}`;
      prevSyllable.devanagari = (prevSyllable.devanagari || '') + unit.rawText;
      continue;
    }

    // C. Independent Vowel Diphthong formation in monosyllabic words / root words (e.g. bhai -> bʱaːiː, mic -> maːiːk, rhyme -> raːiːm)
    // Suffix -ई in 3+ akshara words (tanhai -> t̪ən.ɦaː.iː, judai -> d͡ʒʊ.d̪aː.iː) remains independent suffix syllable
    const isMonosyllabicDiphthong =
      unit.onsetIPA === '' &&
      ['iː', 'ɪ'].includes(unit.vowelIPA) &&
      prevSyllable !== null &&
      !prevSyllable.coda &&
      ['aː', 'ə'].includes(prevSyllable.nucleus) &&
      (units.length <= 2 || (units.length === 3 && nextUnit !== null && !nextUnit.hasMatra && nextUnit.onsetIPA !== ''));

    if (isMonosyllabicDiphthong && prevSyllable) {
      prevSyllable.nucleus = `${prevSyllable.nucleus}${unit.vowelIPA}`;
      prevSyllable.fullIPA = `${prevSyllable.onset || ''}${prevSyllable.nucleus}`;
      prevSyllable.devanagari = (prevSyllable.devanagari || '') + unit.rawText;
      continue;
    }

    // D. Special coda: 'ह' (glottal) between vowel and consonant in 4+ akshara roots (e.g. mehfil -> mɛɦ.fɪl, pehchaan -> pɛɦ.t͡ʃaːn, rehbar -> rɛɦ.bər)
    const isGlottalCoda =
      unit.onsetIPA === 'ɦ' &&
      !unit.hasMatra &&
      !unit.hasAnusvara &&
      prevSyllable !== null &&
      !prevSyllable.coda &&
      units.length >= 4 &&
      u === 1 &&
      nextUnit !== null &&
      !nextUnit.isHalfConsonant;

    if (isGlottalCoda && prevSyllable) {
      prevSyllable.coda = 'ɦ';
      prevSyllable.fullIPA = `${prevSyllable.onset || ''}${prevSyllable.nucleus}ɦ`;
      prevSyllable.devanagari = (prevSyllable.devanagari || '') + unit.rawText;
      continue;
    }

    // E. Hindi Schwa Syncope / Intervocalic Coda Formation (e.g. fursat -> fʊr.sət̪, qudrat -> qʊd̪.rət̪, alvida -> əl.ʋɪ.d̪aː, mustaqbil -> mʊs.t̪əq.bɪl)
    // Note: Prefix 'बे' (be-) retains open syllable (bebasi -> beː.bə.siː, beqarari -> beː.qə.raː.riː)
    const isPrefixBe = u === 1 && prevSyllable && prevSyllable.devanagari === 'बे';
    const isIntervocalicCoda =
      !isPrefixBe &&
      !unit.hasMatra &&
      !unit.hasAnusvara &&
      unit.onsetIPA !== '' &&
      prevSyllable !== null &&
      !prevSyllable.coda &&
      nextUnit !== null &&
      !nextUnit.isHalfConsonant &&
      ((units.length >= 4 && u === 1) || (u >= 1 && nextUnit.hasMatra));

    if (isIntervocalicCoda && prevSyllable) {
      prevSyllable.coda = unit.onsetIPA;
      prevSyllable.fullIPA = `${prevSyllable.onset || ''}${prevSyllable.nucleus}${prevSyllable.coda}`;
      prevSyllable.devanagari = (prevSyllable.devanagari || '') + unit.rawText;
      continue;
    }

    // F. Normal Syllable
    const coda = unit.hasAnusvara ? 'n' : '';
    syllables.push({
      onset: unit.onsetIPA,
      nucleus: unit.vowelIPA,
      coda,
      fullIPA: `${unit.onsetIPA}${unit.vowelIPA}${coda}`,
      devanagari: unit.rawText,
    });
  }

  return syllables.length > 0 ? syllables : [{ nucleus: 'ə', fullIPA: 'ə' }];
}

/**
 * Segments Roman Hindi / Hinglish text into phonetic syllables
 */
function segmentRoman(text: string): PhoneticSyllable[] {
  const lower = text.toLowerCase().replace(/[^a-z]/g, '');
  if (!lower) return [{ nucleus: 'ə', fullIPA: 'ə' }];

  let nucleus = 'aː';
  let coda = '';

  if (lower.endsWith('aat') || lower.endsWith('aath')) {
    nucleus = 'aː';
    coda = 't̪';
  } else if (lower.endsWith('at') || lower.endsWith('ath')) {
    nucleus = 'ə';
    coda = 't̪';
  } else if (lower.endsWith('aan')) {
    nucleus = 'aː';
    coda = 'n';
  } else if (lower.endsWith('an')) {
    nucleus = 'ə';
    coda = 'n';
  } else if (lower.endsWith('aar')) {
    nucleus = 'aː';
    coda = 'r';
  } else if (lower.endsWith('ar')) {
    nucleus = 'ə';
    coda = 'r';
  } else if (lower.endsWith('aab')) {
    nucleus = 'aː';
    coda = 'b';
  } else if (lower.endsWith('ab')) {
    nucleus = 'ə';
    coda = 'b';
  } else if (lower.endsWith('oon')) {
    nucleus = 'uː';
    coda = 'n';
  } else if (lower.endsWith('un')) {
    nucleus = 'ʊ';
    coda = 'n';
  } else if (lower.endsWith('aai') || lower.endsWith('ai')) {
    nucleus = 'aːiː';
    coda = '';
  } else if (lower.endsWith('i') || lower.endsWith('ee') || lower.endsWith('gi')) {
    nucleus = 'iː';
    coda = '';
  }

  const vowels = lower.match(/[aeiouy]+/g) || ['a'];
  const count = Math.max(1, vowels.length);

  const syllables: PhoneticSyllable[] = [];
  for (let i = 0; i < count - 1; i++) {
    syllables.push({ nucleus: 'ə', fullIPA: 'ə' });
  }
  syllables.push({ nucleus, coda, fullIPA: `${nucleus}${coda}` });

  return syllables;
}

const sequenceCache = new Map<string, PhoneticSequence>();

/**
 * Converts word or multi-word phrase into structured PhoneticSequence
 */
export function toPhoneticSequence(input: string): PhoneticSequence {
  const clean = (input || '').trim();
  if (!clean) {
    const defaultSyllable: PhoneticSyllable = { nucleus: 'ə', fullIPA: 'ə' };
    return {
      text: '',
      ipa: 'ə',
      syllables: [defaultSyllable],
      syllableCount: 1,
      lastSyllable: defaultSyllable,
      rhymeEnding: '',
    };
  }

  if (sequenceCache.has(clean)) {
    return sequenceCache.get(clean)!;
  }

  const isDevanagari = /[\u0900-\u097F]/.test(clean);
  const syllables = isDevanagari ? segmentDevanagari(clean) : segmentRoman(clean);

  const lastSyllable = syllables[syllables.length - 1];
  const penultimateSyllable = syllables.length >= 2 ? syllables[syllables.length - 2] : undefined;

  let rhymeEnding = clean.slice(-2);
  if (lastSyllable.coda) {
    rhymeEnding = `${lastSyllable.nucleus}_${lastSyllable.coda}`;
  } else {
    rhymeEnding = `${lastSyllable.nucleus}`;
  }

  const result: PhoneticSequence = {
    text: clean,
    ipa: syllables.map(s => s.fullIPA).join('.'),
    syllables,
    syllableCount: syllables.length,
    lastSyllable,
    penultimateSyllable,
    rhymeEnding,
  };
  sequenceCache.set(clean, result);
  return result;
}

/**
 * Returns primary and dialectal/nuqta phonetic sequence variants for a word
 */
export function toPhoneticSequences(input: string): PhoneticSequence[] {
  const primary = toPhoneticSequence(input);
  const variants: PhoneticSequence[] = [primary];
  const clean = (input || '').trim();

  // If contains nuqta or Urdu phonemes, generate standard Hindi phonetic variant
  let variantText = clean;
  let hasVariant = false;

  if (clean.includes('क़')) { variantText = variantText.replace(/क़/g, 'क'); hasVariant = true; }
  if (clean.includes('ख़')) { variantText = variantText.replace(/ख़/g, 'ख'); hasVariant = true; }
  if (clean.includes('ग़')) { variantText = variantText.replace(/ग़/g, 'ग'); hasVariant = true; }
  if (clean.includes('फ़')) { variantText = variantText.replace(/फ़/g, 'फ'); hasVariant = true; }
  if (clean.includes('ज़')) { variantText = variantText.replace(/ज़/g, 'ज'); hasVariant = true; }

  if (hasVariant && variantText !== clean) {
    variants.push(toPhoneticSequence(variantText));
  }

  return variants;
}

/**
 * Calculates acoustic vowel distance (1.0 = identical, 0.0 = completely distinct)
 */
function getVowelSimilarity(v1: string, v2: string): number {
  if (v1 === v2) return 1.0;
  // Long/Short Vowel Pairs in Hindustani
  if ((v1 === 'aː' && v2 === 'ə') || (v1 === 'ə' && v2 === 'aː')) return 0.85;
  if ((v1 === 'iː' && v2 === 'ɪ') || (v1 === 'ɪ' && v2 === 'iː')) return 0.88;
  if ((v1 === 'uː' && v2 === 'ʊ') || (v1 === 'ʊ' && v2 === 'uː')) return 0.88;
  if ((v1 === 'eː' && v2 === 'ɛː') || (v1 === 'ɛː' && v2 === 'eː')) return 0.85;
  if ((v1 === 'oː' && v2 === 'ɔː') || (v1 === 'ɔː' && v2 === 'oː')) return 0.85;
  if ((v1 === 'aːiː' && (v2 === 'iː' || v2 === 'aː')) || (v2 === 'aːiː' && (v1 === 'iː' || v1 === 'aː'))) return 0.70;
  return 0.15;
}

/**
 * Calculates consonant articulation distance (1.0 = identical, 0.0 = completely distinct)
 */
function getConsonantSimilarity(c1: string, c2: string): number {
  if (c1 === c2) return 1.0;
  if (!c1 && !c2) return 1.0;
  if (!c1 || !c2) return 0.20;

  // Compound Coda Clusters (e.g. rd̪ ↔ rz, kt̪ ↔ xt̪, qt̪ ↔ xt̪)
  if (c1.length > 2 || c2.length > 2 || c1.includes('r') || c2.includes('r') || c1.includes('k') || c2.includes('x') || c1.includes('q')) {
    // 1. Shared starting consonant (e.g. rd̪ ↔ rz in दर्द vs मर्ज़/फ़र्ज़)
    if (c1.startsWith('r') && c2.startsWith('r')) {
      const rest1 = c1.slice(1);
      const rest2 = c2.slice(1);
      if (rest1 === rest2) return 1.0;
      // Dental to sibilant (d̪ ↔ z)
      if ((rest1.includes('d̪') && rest2.includes('z')) || (rest1.includes('z') && rest2.includes('d̪'))) {
        return 0.85;
      }
      return 0.70;
    }
    // 2. Shared ending consonant cluster (e.g. kt̪ ↔ xt̪ ↔ qt̪ in वक़्त vs सख़्त)
    if (c1.endsWith('t̪') && c2.endsWith('t̪')) {
      if (
        (['k', 'x', 'q'].some(x => c1.includes(x)) && ['k', 'x', 'q'].some(x => c2.includes(x)))
      ) {
        return 0.95;
      }
      return 0.90;
    }
  }

  // Aspiration pairs (t̪ ↔ t̪ʰ, p ↔ pʰ, k ↔ kʰ, ʈ ↔ ʈʰ, b ↔ bʱ, d̪ ↔ d̪ʱ, ɡ ↔ ɡʱ)
  const isDentalAspirate =
    (c1.startsWith('t̪') && c2.startsWith('t̪')) ||
    (c1.startsWith('d̪') && c2.startsWith('d̪'));
  if (isDentalAspirate) return 0.98;

  const isLabialAspirate =
    (c1.startsWith('p') && c2.startsWith('p')) ||
    (c1.startsWith('b') && c2.startsWith('b'));
  if (isLabialAspirate) return 0.98;

  const isVelarAspirate =
    (c1.startsWith('k') && c2.startsWith('k')) ||
    (c1.startsWith('ɡ') && c2.startsWith('ɡ'));
  if (isVelarAspirate) return 0.98;

  const isRetroflexAspirate =
    (c1.startsWith('ʈ') && c2.startsWith('ʈ')) ||
    (c1.startsWith('ɖ') && c2.startsWith('ɖ'));
  if (isRetroflexAspirate) return 0.98;

  // Voicing pairs & dental stops: t̪/t̪ʰ ↔ d̪/d̪ʱ
  if (
    (['t̪', 't̪ʰ'].some(x => c1.includes(x)) && ['d̪', 'd̪ʱ'].some(x => c2.includes(x))) ||
    (['d̪', 'd̪ʱ'].some(x => c1.includes(x)) && ['t̪', 't̪ʰ'].some(x => c2.includes(x)))
  ) {
    return 0.85;
  }

  // Bilabials: p/pʰ ↔ b/bʱ
  if (
    (['p', 'pʰ'].some(x => c1.includes(x)) && ['b', 'bʱ'].some(x => c2.includes(x))) ||
    (['b', 'bʱ'].some(x => c1.includes(x)) && ['p', 'pʰ'].some(x => c2.includes(x)))
  ) {
    return 0.85;
  }

  // Velars & Uvulars: k ↔ ɡ ↔ q ↔ x
  if (
    ['k', 'ɡ', 'q', 'x'].some(x => c1.includes(x)) &&
    ['k', 'ɡ', 'q', 'x'].some(x => c2.includes(x))
  ) {
    return 0.80;
  }

  // Sibilants: s ↔ ʃ ↔ ʂ ↔ z ↔ d͡ʒ
  if (
    ['s', 'ʃ', 'ʂ'].some(x => c1.includes(x)) &&
    ['s', 'ʃ', 'ʂ'].some(x => c2.includes(x))
  ) {
    return 0.95;
  }
  if (
    ['s', 'ʃ', 'z', 'd͡ʒ'].some(x => c1.includes(x)) &&
    ['s', 'ʃ', 'z', 'd͡ʒ'].some(x => c2.includes(x))
  ) {
    return 0.80;
  }

  // Liquids & Glides: r ↔ l, j ↔ ʋ, r ↔ ɽ (retroflex flap)
  if ((c1 === 'r' && c2 === 'l') || (c1 === 'l' && c2 === 'r')) return 0.65;
  if ((c1 === 'r' && c2 === 'ɽ') || (c1 === 'ɽ' && c2 === 'r')) return 0.65;
  if ((c1 === 'j' && c2 === 'ʋ') || (c1 === 'ʋ' && c2 === 'j')) return 0.65;

  // Coronal sonorants: dental liquid l ↔ dental nasal n (e.g. dil ↔ din)
  if ((c1 === 'l' && c2 === 'n') || (c1 === 'n' && c2 === 'l')) return 0.65;

  // Nasals: m ↔ n ↔ ɳ
  if (['m', 'n', 'ɳ'].includes(c1) && ['m', 'n', 'ɳ'].includes(c2)) return 0.85;

  // Glottal / Soft fricatives: ɦ
  if (c1 === 'ɦ' || c2 === 'ɦ') return 0.60;

  return 0.10;
}

/**
 * Deterministic Rhyme Scorer & Classifier
 */
export function getRhymeScore(
  sourceInput: PhoneticSequence | string,
  candInput: PhoneticSequence | string
): DetailedRhymeScore {
  const source = typeof sourceInput === 'string' ? toPhoneticSequence(sourceInput) : sourceInput;
  const candidate = typeof candInput === 'string' ? toPhoneticSequence(candInput) : candInput;

  const sLast = source.lastSyllable;
  const cLast = candidate.lastSyllable;

  const vSim = getVowelSimilarity(sLast.nucleus, cLast.nucleus);
  const cSim = getConsonantSimilarity(sLast.coda || '', cLast.coda || '');

  // Check matching syllables from the end backwards
  let matchingSyllables = 0;
  const sLen = source.syllables.length;
  const cLen = candidate.syllables.length;
  const minLen = Math.min(sLen, cLen);

  for (let offset = 1; offset <= minLen; offset++) {
    const sSyl = source.syllables[sLen - offset];
    const cSyl = candidate.syllables[cLen - offset];

    const sylVSim = getVowelSimilarity(sSyl.nucleus, cSyl.nucleus);
    const sylCSim = getConsonantSimilarity(sSyl.coda || '', cSyl.coda || '');

    // For offset 1, exact nucleus + coda match required
    if (offset === 1 && sylVSim >= 0.95 && sylCSim >= 0.95) {
      matchingSyllables++;
    }
    // For offset >= 2, exact vowel match required and consonant alignment
    else if (offset >= 2 && sylVSim >= 0.95 && (sylCSim >= 0.75 || (!sSyl.coda && !cSyl.coda))) {
      matchingSyllables++;
    } else {
      break;
    }
  }

  // String ending match bonus
  const sText = source.text;
  const cText = candidate.text;
  let endingMatchScore = 0;
  if (sText && cText) {
    if (sText.slice(-3) === cText.slice(-3)) endingMatchScore = 1.0;
    else if (sText.slice(-2) === cText.slice(-2)) endingMatchScore = 0.90;
    else if (sText.slice(-1) === cText.slice(-1)) endingMatchScore = 0.60;
  }

  // Calculate Weighted Raw Score
  let rawScore =
    vSim * 0.40 +
    cSim * 0.35 +
    endingMatchScore * 0.15 +
    Math.min(matchingSyllables, 2) * 0.05;
  rawScore = Math.min(1.0, Math.max(0.0, rawScore));

  // Determine Classification Tier
  let type: RhymeType = 'near';
  let confidence = 0.80;

  // 1. Multi-Syllabic Rhymes (e.g. ज़िंदगी ↔ बंदगी, तन्हाई ↔ जुदाई ↔ रुसवाई)
  if (matchingSyllables >= 2 && vSim >= 0.95 && cSim >= 0.95) {
    type = 'multisyllabic';
    confidence = 0.98;
    rawScore = 0.98;
  }
  // 2. Perfect Rhyme: Identical vowel nucleus + identical coda + same syllable count
  // e.g. रात (1 syl) ↔ बात (1 syl), साथ, हाथ, सुकून (2 syl) ↔ कानून (2 syl)
  else if (vSim >= 0.95 && cSim >= 0.95 && source.syllableCount === candidate.syllableCount) {
    type = 'perfect';
    confidence = 0.98;
    rawScore = 1.00;
  }
  // 3. Strong Rhyme: Identical vowel nucleus + identical coda with differing word length
  // e.g. रात (1 syl) ↔ जज़्बात (2 syl), फ़ुरसत (2 syl) ↔ क़ुदरत (2 syl)
  else if (vSim >= 0.85 && cSim >= 0.95) {
    type = 'strong';
    confidence = 0.92;
    rawScore = parseFloat((0.90 + cSim * 0.04).toFixed(2));
  }
  // 4. Near / Slant Rhyme: Near-articulator coda (e.g. रात ↔ याद)
  else if (vSim >= 0.85 && cSim >= 0.60) {
    type = 'near';
    confidence = 0.85;
    rawScore = parseFloat((0.60 + cSim * 0.15).toFixed(2));
  }
  // 5. Consonance: Same coda consonant family with different vowel (e.g. रात ↔ गीत, वक़्त ↔ सख़्त)
  else if (cSim >= 0.85 && vSim < 0.60) {
    type = 'consonance';
    confidence = 0.80;
    rawScore = parseFloat((0.50 + cSim * 0.15).toFixed(2));
  }
  // 6. Assonance: Same vowel nucleus with distinct coda (e.g. रात ↔ आग, शहर ↔ वहम)
  else if (vSim >= 0.85) {
    type = 'assonance';
    confidence = 0.75;
    rawScore = parseFloat((0.45 + vSim * 0.12).toFixed(2));
  } else {
    type = 'near';
    confidence = 0.60;
    rawScore = 0.52;
  }

  const quality = parseFloat(Math.min(1.0, (vSim * 0.55 + cSim * 0.45)).toFixed(2));
  const phoneticSimilarity = quality;
  const isMultisyllabic = matchingSyllables >= 2;
  const rhymeLength = Math.max(1, matchingSyllables);

  let category: RhymeCategory = type;

  return {
    score: parseFloat(rawScore.toFixed(2)),
    quality,
    phoneticSimilarity,
    matchingSyllables,
    rhymeLength,
    category,
    multisyllabic: isMultisyllabic,
    type,
    confidence,
    phoneticDistance: parseFloat((1.0 - rawScore).toFixed(2)),
  };
}

/**
 * Backwards compatibility helper for extractPhoneticKey
 */
export function extractPhoneticKey(word: string): PhoneticKey {
  const seq = toPhoneticSequence(word);
  return {
    nucleus: seq.lastSyllable.nucleus,
    coda: seq.lastSyllable.coda || '',
    rhymeEnding: seq.rhymeEnding,
    syllables: seq.syllableCount,
    sequence: seq,
  };
}

/**
 * Backwards compatibility helper for calculatePhoneticRhymeScore
 */
export function calculatePhoneticRhymeScore(
  target: PhoneticKey,
  candidate: PhoneticKey
): { score: number; type: RhymeType } {
  const result = getRhymeScore(
    target.sequence || target.rhymeEnding || 'raat',
    candidate.sequence || candidate.rhymeEnding || 'baat'
  );
  return { score: result.score, type: result.type };
}
