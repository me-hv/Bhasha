export interface FalsePositivePair {
  id: string;
  word1: string;
  word2: string;
  maxScore: number;
  expectedTierNot: string[];
  rationale: string;
}

export const FALSE_POSITIVES: FalsePositivePair[] = [
  // =========================================================================
  // 1. CODAS WITH DISTINCT MANNER/PLACE OF ARTICULATION (40 PAIRS)
  // =========================================================================
  {
    id: 'fp-001',
    word1: 'दिल',
    word2: 'दिन',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid lateral /l/ vs alveolar nasal /n/ are distinct coda phonemes; only assonance match /ɪ/.'
  },
  {
    id: 'fp-002',
    word1: 'रात',
    word2: 'राग',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Dental voiceless stop /t̪/ vs velar voiced stop /ɡ/; only assonance match /aː/.'
  },
  {
    id: 'fp-003',
    word1: 'रात',
    word2: 'राज',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Dental stop /t̪/ vs postalveolar affricate /d͡ʒ/.'
  },
  {
    id: 'fp-004',
    word1: 'रात',
    word2: 'रान',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Dental stop /t̪/ vs alveolar nasal /n/.'
  },
  {
    id: 'fp-005',
    word1: 'नाम',
    word2: 'नाक',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs velar stop /k/.'
  },
  {
    id: 'fp-006',
    word1: 'नाम',
    word2: 'नाच',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs palatal affricate /t͡ʃ/.'
  },
  {
    id: 'fp-007',
    word1: 'नाम',
    word2: 'नाप',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs bilabial stop /p/.'
  },
  {
    id: 'fp-008',
    word1: 'शाम',
    word2: 'शान',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs alveolar nasal /n/.'
  },
  {
    id: 'fp-009',
    word1: 'दाम',
    word2: 'दान',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs alveolar nasal /n/.'
  },
  {
    id: 'fp-010',
    word1: 'काम',
    word2: 'कान',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs alveolar nasal /n/.'
  },
  {
    id: 'fp-011',
    word1: 'जाम',
    word2: 'जान',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs alveolar nasal /n/.'
  },
  {
    id: 'fp-012',
    word1: 'प्यार',
    word2: 'प्यास',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid tap /r/ vs alveolar sibilant /s/.'
  },
  {
    id: 'fp-013',
    word1: 'यार',
    word2: 'याद',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid tap /r/ vs voiced dental stop /d̪/.'
  },
  {
    id: 'fp-014',
    word1: 'वार',
    word2: 'वास',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid tap /r/ vs sibilant /s/.'
  },
  {
    id: 'fp-015',
    word1: 'हार',
    word2: 'हाथ',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid tap /r/ vs dental stop /t̪ʰ/.'
  },
  {
    id: 'fp-016',
    word1: 'शोर',
    word2: 'शौक़',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid tap /r/ vs uvular stop /q/.'
  },
  {
    id: 'fp-017',
    word1: 'शोर',
    word2: 'शोख',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Liquid tap /r/ vs velar fricative /x/.'
  },
  {
    id: 'fp-018',
    word1: 'सच',
    word2: 'सक',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Affricate /t͡ʃ/ vs velar stop /k/.'
  },
  {
    id: 'fp-019',
    word1: 'चाल',
    word2: 'चाक',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Lateral liquid /l/ vs velar stop /k/.'
  },
  {
    id: 'fp-020',
    word1: 'चाल',
    word2: 'चाव',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Lateral liquid /l/ vs labiodental approximant /ʋ/.'
  },
  {
    id: 'fp-021',
    word1: 'दर्द',
    word2: 'दवा',
    maxScore: 0.50,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Share initial consonant /d̪/ but codas and vowels completely diverge.'
  },
  {
    id: 'fp-022',
    word1: 'वक़्त',
    word2: 'वरक़',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Coda cluster /kt̪/ vs single coda /q/.'
  },
  {
    id: 'fp-023',
    word1: 'मस्त',
    word2: 'मर्द',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Coda cluster /st̪/ vs /rd̪/.'
  },
  {
    id: 'fp-024',
    word1: 'रंग',
    word2: 'रब',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Nasal-velar /ŋɡ/ vs bilabial stop /b/.'
  },
  {
    id: 'fp-025',
    word1: 'दम',
    word2: 'दर',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs tap liquid /r/.'
  },
  {
    id: 'fp-026',
    word1: 'कम',
    word2: 'कल',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Bilabial nasal /m/ vs lateral liquid /l/.'
  },
  {
    id: 'fp-027',
    word1: 'खून',
    word2: 'खूब',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Alveolar nasal /n/ vs bilabial stop /b/.'
  },
  {
    id: 'fp-028',
    word1: 'खून',
    word2: 'खूर',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Alveolar nasal /n/ vs tap liquid /r/.'
  },
  {
    id: 'fp-029',
    word1: 'तीर',
    word2: 'तील',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Tap liquid /r/ vs lateral liquid /l/.'
  },
  {
    id: 'fp-030',
    word1: 'अमीर',
    word2: 'अमीन',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Tap liquid /r/ vs alveolar nasal /n/.'
  },
  {
    id: 'fp-031',
    word1: 'क़रीब',
    word2: 'क़रीना',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Closed monosyllable /iːb/ vs open bisyllable /iː.naː/.'
  },
  {
    id: 'fp-032',
    word1: 'नसीब',
    word2: 'नसीहत',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Prefix sharing /nə.siː/ but final codas /b/ vs /ɦət̪/.'
  },
  {
    id: 'fp-033',
    word1: 'हबीब',
    word2: 'हबीबी',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Closed syllable /iːb/ vs open vowel /iː/.'
  },
  {
    id: 'fp-034',
    word1: 'मंज़िल',
    word2: 'मंज़ूर',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Prefix match /mən/ with completely differing rhyme units /zɪl/ vs /zuːr/.'
  },
  {
    id: 'fp-035',
    word1: 'महफ़िल',
    word2: 'महफ़ूज़',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Prefix match /mɛːɦ.f/ with differing rhyme units /ɪl/ vs /uːz/.'
  },
  {
    id: 'fp-036',
    word1: 'क़ातिल',
    word2: 'क़ासिद',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Lateral /l/ vs dental stop /d̪/ in second syllable.'
  },
  {
    id: 'fp-037',
    word1: 'चलना',
    word2: 'चखना',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Penultimate root coda /l/ vs /kʰ/.'
  },
  {
    id: 'fp-038',
    word1: 'जलना',
    word2: 'जमना',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Penultimate root coda /l/ vs /m/.'
  },
  {
    id: 'fp-039',
    word1: 'भागना',
    word2: 'भापना',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Penultimate root coda /ɡ/ vs /p/.'
  },
  {
    id: 'fp-040',
    word1: 'जीतना',
    word2: 'चीखना',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Penultimate root coda /t̪/ vs /kʰ/.'
  },

  // =========================================================================
  // 2. SURFACE SPELLING / PREFIX TRAPS (35 PAIRS)
  // =========================================================================
  {
    id: 'fp-041',
    word1: 'कमरा',
    word2: 'कचरा',
    maxScore: 0.75,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Share initial /k/ and ending /raː/, but first syllable codas /m/ vs /t͡ʃ/ clash.'
  },
  {
    id: 'fp-042',
    word1: 'कमरा',
    word2: 'कपड़ा',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Share initial /k/, but /raː/ vs /ɽaː/ are distinct flaps/taps.'
  },
  {
    id: 'fp-043',
    word1: 'सड़क',
    word2: 'सफ़र',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Share initial /s/, but /ɽək/ vs /fər/ are totally distinct phonetically.'
  },
  {
    id: 'fp-044',
    word1: 'सड़क',
    word2: 'सबक',
    maxScore: 0.75,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Medial retroflex flap /ɽ/ vs bilabial stop /b/.'
  },
  {
    id: 'fp-045',
    word1: 'दरवाज़ा',
    word2: 'दरबार',
    maxScore: 0.55,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Compound prefix /d̪ər/ match, but endings /ʋaː.zaː/ vs /baːr/ completely diverge.'
  },
  {
    id: 'fp-046',
    word1: 'आसमान',
    word2: 'आस्था',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /aːs/ prefix match only.'
  },
  {
    id: 'fp-047',
    word1: 'दुकान',
    word2: 'दुश्मन',
    maxScore: 0.50,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /d̪ʊ/ prefix match only.'
  },
  {
    id: 'fp-048',
    word1: 'निशान',
    word2: 'निशाना',
    maxScore: 0.75,
    expectedTierNot: ['PERFECT', 'STRONG'],
    rationale: 'Closed /aːn/ vs open /aːnaː/ syllable structure (metric length mismatch).'
  },
  {
    id: 'fp-049',
    word1: 'बयान',
    word2: 'बयाना',
    maxScore: 0.75,
    expectedTierNot: ['PERFECT', 'STRONG'],
    rationale: 'Closed /aːn/ vs open /aːnaː/ syllable structure.'
  },
  {
    id: 'fp-050',
    word1: 'गुज़र',
    word2: 'गुलाब',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ɡʊ/ match only.'
  },
  {
    id: 'fp-051',
    word1: 'हवा',
    word2: 'हवस',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Open /ʋaː/ vs closed /ʋəs/.'
  },
  {
    id: 'fp-052',
    word1: 'दवा',
    word2: 'दवात',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Open /ʋaː/ vs closed /ʋaːt̪/.'
  },
  {
    id: 'fp-053',
    word1: 'दुआ',
    word2: 'दुकान',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /d̪ʊ/ match only.'
  },
  {
    id: 'fp-054',
    word1: 'किनारा',
    word2: 'किताब',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /kɪ/ match only.'
  },
  {
    id: 'fp-055',
    word1: 'सहारा',
    word2: 'सफ़र',
    maxScore: 0.50,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /sə/ match only.'
  },
  {
    id: 'fp-056',
    word1: 'सितारा',
    word2: 'सिकंदर',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /sɪ/ match only.'
  },
  {
    id: 'fp-057',
    word1: 'इशारा',
    word2: 'इश्क़',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ɪʃ/ match only.'
  },
  {
    id: 'fp-058',
    word1: 'ज़िंदगी',
    word2: 'ज़मीन',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /z/ match only.'
  },
  {
    id: 'fp-059',
    word1: 'सादगी',
    word2: 'साहिल',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /saː/ match only.'
  },
  {
    id: 'fp-060',
    word1: 'ताज़गी',
    word2: 'ताबीर',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /t̪aː/ match only.'
  },
  {
    id: 'fp-061',
    word1: 'किस्मत',
    word2: 'किताब',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /kɪ/ match only.'
  },
  {
    id: 'fp-062',
    word1: 'हक़ीक़त',
    word2: 'हक़',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG'],
    rationale: 'Root sharing but 3 syllables vs 1 syllable.'
  },
  {
    id: 'fp-063',
    word1: 'सवाल',
    word2: 'सवेरा',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /sə.ʋ/ match only.'
  },
  {
    id: 'fp-064',
    word1: 'जवाब',
    word2: 'जवानी',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Initial /d͡ʒə.ʋaː/ match, but /b/ vs /niː/.'
  },
  {
    id: 'fp-065',
    word1: 'हिसाब',
    word2: 'हिदायत',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ɦɪ/ match only.'
  },
  {
    id: 'fp-066',
    word1: 'गुलाब',
    word2: 'गुलामी',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Initial /ɡʊ.laː/ match, but /b/ vs /miː/.'
  },
  {
    id: 'fp-067',
    word1: 'शराब',
    word2: 'शर्म',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ʃə/ match only.'
  },
  {
    id: 'fp-068',
    word1: 'तस्वीर',
    word2: 'तराना',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /t̪/ match only.'
  },
  {
    id: 'fp-069',
    word1: 'तक़दीर',
    word2: 'तक़रीब',
    maxScore: 0.70,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Prefix match /t̪əq/ but codas /r/ vs /b/.'
  },
  {
    id: 'fp-070',
    word1: 'ज़ंजीर',
    word2: 'जन्नत',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /zən/ /d͡ʒən/ match only.'
  },
  {
    id: 'fp-071',
    word1: 'फकीर',
    word2: 'फ़ना',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /f/ match only.'
  },
  {
    id: 'fp-072',
    word1: 'अमीर',
    word2: 'अमन',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ə.m/ match only.'
  },
  {
    id: 'fp-073',
    word1: 'ग़रीब',
    word2: 'ग़ैरत',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ɣ/ match only.'
  },
  {
    id: 'fp-074',
    word1: 'नसीब',
    word2: 'नज़र',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /n/ match only.'
  },
  {
    id: 'fp-075',
    word1: 'अजीब',
    word2: 'असर',
    maxScore: 0.45,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC', 'NEAR'],
    rationale: 'Initial /ə/ match only.'
  },

  // =========================================================================
  // 3. VOWEL LENGTH & QUALITY MISMATCHES (35 PAIRS)
  // =========================================================================
  {
    id: 'fp-076',
    word1: 'काली',
    word2: 'खाली',
    maxScore: 1.0, // Valid multisyllabic rhyme, check onset distinction /k/ vs /x/
    expectedTierNot: ['NON_RHYME'],
    rationale: 'Valid rhyme, but check onset distinction /k/ vs /x/.'
  },
  {
    id: 'fp-077',
    word1: 'पिन',
    word2: 'पान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-078',
    word1: 'गिन',
    word2: 'गान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-079',
    word1: 'छिन',
    word2: 'छान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-080',
    word1: 'मिल',
    word2: 'माल',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-081',
    word1: 'खिल',
    word2: 'खाल',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-082',
    word1: 'सिल',
    word2: 'साल',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-083',
    word1: 'पुल',
    word2: 'पाल',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-084',
    word1: 'कुल',
    word2: 'काल',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-085',
    word1: 'सुन',
    word2: 'सान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-086',
    word1: 'धुन',
    word2: 'धान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-087',
    word1: 'चुन',
    word2: 'चान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-088',
    word1: 'बुन',
    word2: 'बान',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-089',
    word1: 'सिर',
    word2: 'सार',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-090',
    word1: 'गिर',
    word2: 'गार',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-091',
    word1: 'फिर',
    word2: 'फार',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-092',
    word1: 'घिर',
    word2: 'घार',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ɪ/ vs long /aː/.'
  },
  {
    id: 'fp-093',
    word1: 'चुक',
    word2: 'चाक',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-094',
    word1: 'रुक',
    word2: 'राक',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-095',
    word1: 'झुक',
    word2: 'झाक',
    maxScore: 0.60,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Short /ʊ/ vs long /aː/.'
  },
  {
    id: 'fp-096',
    word1: 'धक',
    word2: 'धाक',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-097',
    word1: 'पक',
    word2: 'पाक',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-098',
    word1: 'तक',
    word2: 'ताक',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-099',
    word1: 'बक',
    word2: 'बाक',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-100',
    word1: 'शक',
    word2: 'शाक',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-101',
    word1: 'हक',
    word2: 'हाक',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-102',
    word1: 'दम',
    word2: 'दाम',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-103',
    word1: 'कम',
    word2: 'काम',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-104',
    word1: 'ग़म',
    word2: 'गाम',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-105',
    word1: 'सम',
    word2: 'साम',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-106',
    word1: 'चट',
    word2: 'चाट',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-107',
    word1: 'फट',
    word2: 'फाट',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-108',
    word1: 'हट',
    word2: 'हाट',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-109',
    word1: 'लट',
    word2: 'लाट',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  },
  {
    id: 'fp-110',
    word1: 'कट',
    word2: 'काट',
    maxScore: 0.65,
    expectedTierNot: ['PERFECT', 'STRONG', 'MULTISYLLABIC'],
    rationale: 'Central schwa /ə/ vs long /aː/.'
  }
];
