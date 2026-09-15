/**
 * BHASHA — 100+ Human Evaluation Rhyme Benchmark Dataset
 * Verified phonetic relationships curated for Hindi/Hinglish lyricists and rap writers.
 */

import { RhymeType } from '../types';

export interface HumanRhymePair {
  id: string;
  query: string;
  candidate: string;
  expectedTier: RhymeType;
  minScore: number;
  description: string;
}

export const HUMAN_EVALUATION_DATASET: HumanRhymePair[] = [
  // =========================================================================
  // 1. PERFECT MONOSYLLABIC / EQUISYLLABIC RHYMES (30 PAIRS)
  // =========================================================================
  { id: 'perf-01', query: 'रात', candidate: 'बात', expectedTier: 'perfect', minScore: 0.98, description: 'Direct classic monorhyme [aːt̪]' },
  { id: 'perf-02', query: 'रात', candidate: 'साथ', expectedTier: 'perfect', minScore: 0.98, description: 'Dental aspirated/unaspirated match [aːt̪/aːt̪ʰ]' },
  { id: 'perf-03', query: 'रात', candidate: 'हाथ', expectedTier: 'perfect', minScore: 0.98, description: 'Classic rap bar anchor [aːt̪ʰ]' },
  { id: 'perf-04', query: 'दिल', candidate: 'मिल', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid dental coda [ɪl]' },
  { id: 'perf-05', query: 'दिल', candidate: 'खिल', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid dental coda [ɪl]' },
  { id: 'perf-06', query: 'नाम', candidate: 'काम', expectedTier: 'perfect', minScore: 0.98, description: 'Bilabial nasal coda [aːm]' },
  { id: 'perf-07', query: 'नाम', candidate: 'दाम', expectedTier: 'perfect', minScore: 0.98, description: 'Bilabial nasal coda [aːm]' },
  { id: 'perf-08', query: 'नाम', candidate: 'जाम', expectedTier: 'perfect', minScore: 0.98, description: 'Bilabial nasal coda [aːm]' },
  { id: 'perf-09', query: 'प्यार', candidate: 'यार', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid coda rhyme [aːr]' },
  { id: 'perf-10', query: 'प्यार', candidate: 'वार', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid coda rhyme [aːr]' },
  { id: 'perf-11', query: 'आग', candidate: 'दाग', expectedTier: 'perfect', minScore: 0.98, description: 'Velar voiced stop [aːɡ]' },
  { id: 'perf-12', query: 'आग', candidate: 'भाग', expectedTier: 'perfect', minScore: 0.98, description: 'Velar voiced stop [aːɡ]' },
  { id: 'perf-13', query: 'शोर', candidate: 'जोर', expectedTier: 'perfect', minScore: 0.98, description: 'Mid back vowel liquid [oːr]' },
  { id: 'perf-14', query: 'शोर', candidate: 'मोर', expectedTier: 'perfect', minScore: 0.98, description: 'Mid back vowel liquid [oːr]' },
  { id: 'perf-15', query: 'सच', candidate: 'बच', expectedTier: 'perfect', minScore: 0.98, description: 'Affricate coda [ət͡ʃ]' },
  { id: 'perf-16', query: 'चाल', candidate: 'हाल', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid coda [aːl]' },
  { id: 'perf-17', query: 'चाल', candidate: 'जाल', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid coda [aːl]' },
  { id: 'perf-18', query: 'चाल', candidate: 'साल', expectedTier: 'perfect', minScore: 0.98, description: 'Liquid coda [aːl]' },
  { id: 'perf-19', query: 'वफ़ा', candidate: 'जफ़ा', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Ghazal core 2-syllable open vowel [-ə.faː/-ə.faː]' },
  { id: 'perf-20', query: 'वफ़ा', candidate: 'सज़ा', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable open vowel cadence [-ə.aː]' },
  { id: 'perf-21', query: 'वफ़ा', candidate: 'ख़ुदा', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable open vowel coda [-aː]' },
  { id: 'perf-22', query: 'वफ़ा', candidate: 'अदा', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable open vowel cadence [-ə.aː]' },
  { id: 'perf-23', query: 'फ़ना', candidate: 'बक़ा', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable open vowel cadence [-ə.aː]' },
  { id: 'perf-24', query: 'शहर', candidate: 'ज़हर', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable full match [-ə.ɦər]' },
  { id: 'perf-25', query: 'शहर', candidate: 'क़हर', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable full match [-ə.ɦər]' },
  { id: 'perf-26', query: 'सफ़र', candidate: 'असर', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable schwa liquid cadence [-ə.sər]' },
  { id: 'perf-27', query: 'सफ़र', candidate: 'ख़बर', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable schwa liquid cadence [-ə.bər]' },
  { id: 'perf-28', query: 'सफ़र', candidate: 'नज़र', expectedTier: 'multisyllabic', minScore: 0.95, description: '2-syllable schwa liquid cadence [-ə.zər]' },
  { id: 'perf-29', query: 'मंज़िल', candidate: 'साहिल', expectedTier: 'perfect', minScore: 0.98, description: 'Two syllable [ɪl] rhyme' },
  { id: 'perf-30', query: 'मंज़िल', candidate: 'महफ़िल', expectedTier: 'perfect', minScore: 0.98, description: 'Two syllable [ɪl] rhyme' },

  // =========================================================================
  // 2. MULTISYLLABIC / POLYSYLLABIC RHYMES (25 PAIRS)
  // =========================================================================
  { id: 'multi-01', query: 'तन्हाई', candidate: 'जुदाई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-02', query: 'तन्हाई', candidate: 'रुसवाई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-03', query: 'तन्हाई', candidate: 'गहराई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-04', query: 'तन्हाई', candidate: 'सच्चाई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-05', query: 'जुदाई', candidate: 'रुसवाई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-06', query: 'जुदाई', candidate: 'गहराई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-07', query: 'जुदाई', candidate: 'सच्चाई', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aːiː] match' },
  { id: 'multi-08', query: 'ज़िंदगी', candidate: 'बंदगी', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable 3-to-3 equisyllabic cadence match' },
  { id: 'multi-09', query: 'ज़िंदगी', candidate: 'सादगी', expectedTier: 'strong', minScore: 0.90, description: 'Cross-length 3-to-2 syllable [-ɡiː] cadence match' },
  { id: 'multi-10', query: 'ज़िंदगी', candidate: 'ताज़गी', expectedTier: 'strong', minScore: 0.90, description: 'Cross-length 3-to-2 syllable [-ɡiː] cadence match' },
  { id: 'multi-11', query: 'बंदगी', candidate: 'सादगी', expectedTier: 'strong', minScore: 0.90, description: 'Cross-length 3-to-2 syllable [-ɡiː] cadence match' },
  { id: 'multi-12', query: 'बंदगी', candidate: 'ताज़गी', expectedTier: 'strong', minScore: 0.90, description: 'Cross-length 3-to-2 syllable [-ɡiː] cadence match' },
  { id: 'multi-13', query: 'दीवाना', candidate: 'परवाना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-waː.naː] match' },
  { id: 'multi-14', query: 'दीवाना', candidate: 'मस्ताना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-taː.naː] match' },
  { id: 'multi-15', query: 'दीवाना', candidate: 'फ़साना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-saː.naː] match' },
  { id: 'multi-16', query: 'दीवाना', candidate: 'ज़माना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-maː.naː] match' },
  { id: 'multi-17', query: 'परवाना', candidate: 'मस्ताना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aː.naː] match' },
  { id: 'multi-18', query: 'परवाना', candidate: 'फ़साना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aː.naː] match' },
  { id: 'multi-19', query: 'मयख़ाना', candidate: 'पैमाना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aː.naː] match' },
  { id: 'multi-20', query: 'सुकून', candidate: 'जुनून', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [ʊ.nuːn] match' },
  { id: 'multi-21', query: 'हौसला', candidate: 'फ़ैसला', expectedTier: 'perfect', minScore: 0.95, description: 'Equisyllabic 2-syllable [-sə.laː] match' },
  { id: 'multi-22', query: 'सिकंदर', candidate: 'समंदर', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-ən.d̪ər] match' },
  { id: 'multi-23', query: 'शानदार', candidate: 'जानदार', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-daːr] compound match' },
  { id: 'multi-24', query: 'दीवाना', candidate: 'आशियाना', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-aː.naː] match' },
  { id: 'multi-25', query: 'हालात', candidate: 'मुलाक़ात', expectedTier: 'multisyllabic', minScore: 0.95, description: 'Multi-syllable [-laː.t̪] match' },

  // =========================================================================
  // 3. STRONG / EQUISYLLABIC CROSS-ROOT RHYMES (25 PAIRS)
  // =========================================================================
  { id: 'str-01', query: 'रात', candidate: 'जज़्बात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-02', query: 'रात', candidate: 'हालात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-03', query: 'रात', candidate: 'बरसात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-04', query: 'रात', candidate: 'मुलाक़ात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 3-syllable [-aːt̪]' },
  { id: 'str-05', query: 'रात', candidate: 'औक़ात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-06', query: 'बात', candidate: 'जज़्बात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-07', query: 'बात', candidate: 'हालात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-08', query: 'साथ', candidate: 'बरसात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 2-syllable [-aːt̪]' },
  { id: 'str-09', query: 'हाथ', candidate: 'मुलाक़ात', expectedTier: 'strong', minScore: 0.90, description: '1-syllable base to 3-syllable [-aːt̪]' },
  { id: 'str-10', query: 'जज़्बात', candidate: 'हालात', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-aːt̪]' },
  { id: 'str-11', query: 'हालात', candidate: 'बरसात', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-aːt̪]' },
  { id: 'str-12', query: 'जज़्बात', candidate: 'मुलाक़ात', expectedTier: 'strong', minScore: 0.90, description: '2-syllable base to 3-syllable [-aːt̪]' },
  { id: 'str-13', query: 'जुनून', candidate: 'खून', expectedTier: 'strong', minScore: 0.90, description: '2-syllable to 1-syllable [-uːn]' },
  { id: 'str-14', query: 'सुकून', candidate: 'कानून', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-uːn]' },
  { id: 'str-15', query: 'फ़ुरसत', candidate: 'क़ुदरत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-16', query: 'फ़ुरसत', candidate: 'कसरत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-17', query: 'फ़ुरसत', candidate: 'हसरत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-18', query: 'फ़ुरसत', candidate: 'नफ़रत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-19', query: 'फ़ुरसत', candidate: 'हरकत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-20', query: 'क़ुदरत', candidate: 'कसरत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-21', query: 'क़ुदरत', candidate: 'हसरत', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable monorhyme [-ət̪]' },
  { id: 'str-22', query: 'मुक़द्दर', candidate: 'सिकंदर', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 3-syllable monorhyme [-d̪ər]' },
  { id: 'str-23', query: 'मुक़द्दर', candidate: 'समंदर', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 3-syllable monorhyme [-d̪ər]' },
  { id: 'str-24', query: 'मुक़द्दर', candidate: 'कलंदर', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 3-syllable monorhyme [-d̪ər]' },
  { id: 'str-25', query: 'शानदार', candidate: 'ग़द्दार', expectedTier: 'perfect', minScore: 0.98, description: 'Equisyllabic 2-syllable [-daːr] monorhyme' },

  // =========================================================================
  // 4. NEAR / SLANT RHYMES (12 PAIRS)
  // =========================================================================
  { id: 'near-01', query: 'रात', candidate: 'याद', expectedTier: 'near', minScore: 0.65, description: 'Dental voiceless/voiced stop pair [t̪ ↔ d̪]' },
  { id: 'near-02', query: 'बात', candidate: 'याद', expectedTier: 'near', minScore: 0.65, description: 'Dental voiceless/voiced stop pair [t̪ ↔ d̪]' },
  { id: 'near-03', query: 'साथ', candidate: 'याद', expectedTier: 'near', minScore: 0.65, description: 'Dental voiceless/voiced stop pair [t̪ʰ ↔ d̪]' },
  { id: 'near-04', query: 'हाथ', candidate: 'याद', expectedTier: 'near', minScore: 0.65, description: 'Dental voiceless/voiced stop pair [t̪ʰ ↔ d̪]' },
  { id: 'near-05', query: 'दर्द', candidate: 'मर्ज़', expectedTier: 'near', minScore: 0.65, description: 'Liquid dental to sibilant slant [rd̪ ↔ rz]' },
  { id: 'near-06', query: 'दर्द', candidate: 'फ़र्ज़', expectedTier: 'near', minScore: 0.65, description: 'Liquid dental to sibilant slant [rd̪ ↔ rz]' },
  { id: 'near-07', query: 'तार', candidate: 'ताड़', expectedTier: 'near', minScore: 0.60, description: 'Liquid to retroflex flap slant [r ↔ ɽ]' },
  { id: 'near-08', query: 'दिल', candidate: 'दिन', expectedTier: 'near', minScore: 0.60, description: 'Liquid to nasal dental [l ↔ n]' },
  { id: 'near-09', query: 'दिल', candidate: 'सिर', expectedTier: 'near', minScore: 0.60, description: 'Liquid dental to alveolar liquid [l ↔ r]' },
  { id: 'near-10', query: 'नाम', candidate: 'जान', expectedTier: 'near', minScore: 0.60, description: 'Bilabial to dental nasal [m ↔ n]' },
  { id: 'near-11', query: 'काम', candidate: 'शान', expectedTier: 'near', minScore: 0.60, description: 'Bilabial to dental nasal [m ↔ n]' },
  { id: 'near-12', query: 'जाम', candidate: 'बयान', expectedTier: 'near', minScore: 0.60, description: 'Bilabial to dental nasal [m ↔ n]' },

  // =========================================================================
  // 5. CONSONANCE RHYMES (6 PAIRS)
  // =========================================================================
  { id: 'cons-01', query: 'रात', candidate: 'गीत', expectedTier: 'consonance', minScore: 0.50, description: 'Consonance with shared [t̪] coda, differing vowel' },
  { id: 'cons-02', query: 'बात', candidate: 'जीत', expectedTier: 'consonance', minScore: 0.50, description: 'Consonance with shared [t̪] coda, differing vowel' },
  { id: 'cons-03', query: 'साथ', candidate: 'मीत', expectedTier: 'consonance', minScore: 0.50, description: 'Consonance with shared [t̪/t̪ʰ] coda, differing vowel' },
  { id: 'cons-04', query: 'वक़्त', candidate: 'मुक्त', expectedTier: 'consonance', minScore: 0.50, description: 'Consonance with shared [kt̪] cluster, differing vowel' },
  { id: 'cons-05', query: 'दिल', candidate: 'बोल', expectedTier: 'consonance', minScore: 0.50, description: 'Consonance with shared [l] coda, differing vowel' },
  { id: 'cons-06', query: 'नाम', candidate: 'क़ौम', expectedTier: 'consonance', minScore: 0.50, description: 'Consonance with shared [m] coda, differing vowel' },

  // =========================================================================
  // 6. ASSONANCE RHYMES (6 PAIRS)
  // =========================================================================
  { id: 'ass-01', query: 'रात', candidate: 'आग', expectedTier: 'assonance', minScore: 0.45, description: 'Assonance with shared [aː] vowel, distinct coda' },
  { id: 'ass-02', query: 'रात', candidate: 'ख़्वाब', expectedTier: 'assonance', minScore: 0.45, description: 'Assonance with shared [aː] vowel, distinct coda' },
  { id: 'ass-03', query: 'बात', candidate: 'साज़', expectedTier: 'assonance', minScore: 0.45, description: 'Assonance with shared [aː] vowel, distinct coda' },
  { id: 'ass-04', query: 'दिल', candidate: 'ज़िद', expectedTier: 'assonance', minScore: 0.45, description: 'Assonance with shared [ɪ] vowel, distinct coda' },
  { id: 'ass-05', query: 'दिल', candidate: 'सिख', expectedTier: 'assonance', minScore: 0.45, description: 'Assonance with shared [ɪ] vowel, distinct coda' },
  { id: 'ass-06', query: 'शहर', candidate: 'वहम', expectedTier: 'assonance', minScore: 0.45, description: 'Assonance with shared [ə] vowel, distinct coda' }
];
