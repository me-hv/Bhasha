export interface RhymeSchemeGoldCase {
  id: string;
  schemeType: 'AAAA' | 'AABB' | 'ABAB' | 'ABBA' | 'AAAB' | 'AABA' | 'ABCABC' | 'AABCCB' | 'UNRHYMED' | 'MIXED_UNRHYMED';
  lines: string[];
  expectedScheme: string[];
  expectedGroups: number;
  notes: string;
}

export const RHYME_SCHEME_CASES: RhymeSchemeGoldCase[] = [
  // =========================================================================
  // 1. AABB COUPLETS (15 CASES)
  // =========================================================================
  {
    id: 'scheme-001',
    schemeType: 'AABB',
    lines: [
      'काली रात में जलती है आग',
      'छोड़ के दुनिया को तू अब भाग',
      'कर ले तू अपने दिल की बात',
      'गुज़रेगी ऐसे ही सारी रात'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'Classic AABB couplets (आग/भाग -> A, बात/रात -> B)'
  },
  {
    id: 'scheme-002',
    schemeType: 'AABB',
    lines: [
      'तेरा नाम ही मेरा काम बन गया',
      'सुबह से शाम तक जाम बन गया',
      'दिल में छुपा के रखा था जो दर्द',
      'बन गया आज वो सीने का मर्ज़'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with Persian codas (काम/जाम, दर्द/मर्ज़)'
  },
  {
    id: 'scheme-003',
    schemeType: 'AABB',
    lines: [
      'अंधेरी रात में चमका सितारा',
      'डूबते दिल को मिला सहारा',
      'आँखों में जलती रही वो आग',
      'किस्मत का खुल गया अब भाग'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with multisyllabic (सितारा/सहारा) and monosyllabic (आग/भाग)'
  },
  {
    id: 'scheme-004',
    schemeType: 'AABB',
    lines: [
      'शोर बहुत है शहर में जोर लगा',
      'अंधेरे कमरे में नई रोशनी जगा',
      'चाल समझ ले अपनी हाल संभाल',
      'सच्ची मेहनत से तू कर ले कमाल'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (लगा/जगा, संभाल/कमाल)'
  },
  {
    id: 'scheme-005',
    schemeType: 'AABB',
    lines: [
      'सवेरा हुआ तो अंधेरा मिटा',
      'सूरज की पहली किरण से खिला',
      'पानी की बूंदों में बहती रवानी',
      'सदियों पुरानी है अपनी कहानी'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (मिटा/खिला, रवानी/कहानी)'
  },
  {
    id: 'scheme-006',
    schemeType: 'AABB',
    lines: [
      'दीवाना दिल मेरा परवाना बना',
      'आशिक़ों की महफ़िल का अफ़साना बना',
      'ज़िंदगी में जब तक बंदगी ना हो',
      'सादगी के बिना कोई ताज़गी ना हो'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (बना/बना [refrain] or परवाना/अफ़साना, बंदगी/ताज़गी)'
  },
  {
    id: 'scheme-007',
    schemeType: 'AABB',
    lines: [
      'हौसलों से लिया हमने फ़ैसला',
      'मंजिल की तरफ़ बढ़ा हौसला',
      'सिकंदर की तरह समंदर पार किया',
      'मेहनत से अपना मुक़द्दर संवार लिया'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (फ़ैसला/हौसला, पार किया/संवार लिया)'
  },
  {
    id: 'scheme-008',
    schemeType: 'AABB',
    lines: [
      'ग़रीब के दिल के क़रीब है खुदा',
      'सच्चे दिल से कभी ना होना जुदा',
      'नसीब बदला तो हबीब मिल गया',
      'उजड़े हुए गुलशन में फूल खिल गया'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (खुदा/जुदा, गया/गया)'
  },
  {
    id: 'scheme-009',
    schemeType: 'AABB',
    lines: [
      'माइक पे आते ही फ्लो मेरा टाइट',
      'स्टेज पे करते हैं हम पूरी फाइट',
      'गेम में हम हैं अब नंबर वन',
      'रैप में किया हमने पूरा फन'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB Hinglish (टाइट/फाइट, वन/फन)'
  },
  {
    id: 'scheme-010',
    schemeType: 'AABB',
    lines: [
      'ट्रैक पे बीट बजी तो क्राउड हुआ क्रेजी',
      'राइम मेरी हार्ड है फ्लो नहीं लेजी',
      'बॉस की तरह किया पूरे सीन को रूल',
      'दिमाग़ अपना शांत और वाइब अपनी कूल'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB Hinglish (क्रेजी/लेजी, रूल/कूल)'
  },
  {
    id: 'scheme-011',
    schemeType: 'AABB',
    lines: [
      'क्लब में जब एंट्री ली तो स्पॉटलाइट ऑन',
      'विरोधी सारे भाग गए सब हो गए गॉन',
      'ड्रिप मेरी फ्रेश और स्टाइल मेरा क्लासिक',
      'म्यूज़िक का नशा जैसे हो कोई मैजिक'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB Hinglish (ऑन/गॉन, क्लासिक/मैजिक)'
  },
  {
    id: 'scheme-012',
    schemeType: 'AABB',
    lines: [
      'किंग की तरह बैठा हूँ मैं अपने थ्रोन पे',
      'कॉल आ रहे हैं दिन भर मेरे फोन पे',
      'क्रू मेरा रेडी है करने को ब्लास्ट',
      'चलते हैं आगे हम सुपर फास्ट'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB Hinglish (थ्रोन पे/फोन पे, ब्लास्ट/फास्ट)'
  },
  {
    id: 'scheme-013',
    schemeType: 'AABB',
    lines: [
      'रोटी मिली आधी बोटी मिली पूरी',
      'मेहनत के बिना हर ख्वाहिश अधूरी',
      'कपड़ा फटा जब टुकड़ा मिला दिल का',
      'मुखड़ा चमका तो हल हुआ हर मुश्किल का'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (पूरी/अधूरी, दिल का/मुश्किल का)'
  },
  {
    id: 'scheme-014',
    schemeType: 'AABB',
    lines: [
      'गाड़ी चली आगे झाड़ी में छुप गया',
      'साड़ी के पल्लू में चाँद भी रुक गया',
      'सिक्का चला अपना इक्का निकला बड़ा',
      'धक्का लगा जब तो पक्का खंभा गड़ा'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (छुप गया/रुक गया, बड़ा/गड़ा)'
  },
  {
    id: 'scheme-015',
    schemeType: 'AABB',
    lines: [
      'कच्चा था वो खिलाड़ी सच्चा निकला यार',
      'बच्चा बन के उसने जीत लिया संसार',
      'नोट गिने बहुत पर वोट मिला नहीं',
      'चोट लगी गहरी कोई खोट मिला नहीं'
    ],
    expectedScheme: ['A', 'A', 'B', 'B'],
    expectedGroups: 2,
    notes: 'AABB with (यार/संसार, नहीं/नहीं)'
  },

  // =========================================================================
  // 2. ABAB ALTERNATING RHYMES (15 CASES)
  // =========================================================================
  {
    id: 'scheme-016',
    schemeType: 'ABAB',
    lines: [
      'काली रात में जलती है आग',
      'दिल की बात जब जुबां पे आती है',
      'छोड़ के दुनिया को तू अब भाग',
      'गुज़री हुई यादें फिर सताती हैं'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB alternating (आग/भाग -> A, आती है/सताती हैं -> B)'
  },
  {
    id: 'scheme-017',
    schemeType: 'ABAB',
    lines: [
      'तेरा नाम ही मेरा सहारा मिल गया',
      'दिल के ज़ख़्मों को सुकून मिल गया',
      'डूबती कश्ती को किनारा मिल गया',
      'जुनून का नया जुनून मिल गया'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB alternating (सहारा मिल गया/किनारा मिल गया -> A, सुकून मिल गया/जुनून मिल गया -> B)'
  },
  {
    id: 'scheme-018',
    schemeType: 'ABAB',
    lines: [
      'सच की राह पे चलना सीख ले तू',
      'गर्म हुआ माहौल यहाँ पे आज',
      'झूठ के जाल से बचना सीख ले तू',
      'सर पे सजा ले अपनी मेहनत का ताज'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB alternating (सीख ले तू/सीख ले तू [refrain] or चलना/बचना, आज/ताज)'
  },
  {
    id: 'scheme-019',
    schemeType: 'ABAB',
    lines: [
      'शहर में जो फैला ज़हर है आज',
      'सफ़र लंबा है लेकिन असर होगा',
      'क़हर बरपा है चारों पहर आज',
      'ख़बर मिली है कि बसर होगा'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB alternating (ज़हर है आज/चारों पहर आज, असर होगा/बसर होगा)'
  },
  {
    id: 'scheme-020',
    schemeType: 'ABAB',
    lines: [
      'दीवाना दिल मेरा परवाना बन गया',
      'ज़िंदगी में जब तक बंदगी ना हो',
      'आशिक़ों की महफ़िल का फ़साना बन गया',
      'सादगी के बिना कोई ताज़गी ना हो'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB alternating (परवाना बन गया/फ़साना बन गया, बंदगी ना हो/ताज़गी ना हो)'
  },
  {
    id: 'scheme-021',
    schemeType: 'ABAB',
    lines: [
      'माइक पे आते ही फ्लो मेरा टाइट',
      'गेम में हम हैं अब नंबर वन',
      'स्टेज पे करते हैं हम पूरी फाइट',
      'रैप में किया हमने पूरा फन'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB Hinglish (टाइट/फाइट -> A, वन/फन -> B)'
  },
  {
    id: 'scheme-022',
    schemeType: 'ABAB',
    lines: [
      'ट्रैक पे बीट बजी तो क्राउड हुआ क्रेजी',
      'बॉस की तरह किया पूरे सीन को रूल',
      'राइम मेरी हार्ड है फ्लो नहीं लेजी',
      'दिमाग़ अपना शांत और वाइब अपनी कूल'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB Hinglish (क्रेजी/लेजी -> A, रूल/कूल -> B)'
  },
  {
    id: 'scheme-023',
    schemeType: 'ABAB',
    lines: [
      'क्लब में जब एंट्री ली तो स्पॉटलाइट ऑन',
      'ड्रिप मेरी फ्रेश और स्टाइल मेरा क्लासिक',
      'विरोधी सारे भाग गए सब हो गए गॉन',
      'म्यूज़िक का नशा जैसे हो कोई मैजिक'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB Hinglish (ऑन/गॉन -> A, क्लासिक/मैजिक -> B)'
  },
  {
    id: 'scheme-024',
    schemeType: 'ABAB',
    lines: [
      'रोटी मिली आधी पेट भरा नहीं',
      'कपड़ा फटा जब टुकड़ा मिला दिल का',
      'बोटी मिली पूरी कोई मरा नहीं',
      'मुखड़ा चमका तो हल हुआ हर मुश्किल का'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB (भरा नहीं/मरा नहीं, दिल का/मुश्किल का)'
  },
  {
    id: 'scheme-025',
    schemeType: 'ABAB',
    lines: [
      'सिक्का चला अपना बाजार में',
      'कच्चा था वो खिलाड़ी सच्चा निकला',
      'इक्का निकला बड़ा इस बार में',
      'बच्चा बन के वो भी अब निकला'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB (बाजार में/इस बार में, सच्चा निकला/अब निकला)'
  },
  {
    id: 'scheme-026',
    schemeType: 'ABAB',
    lines: [
      'ताला लगा था पुराने मकान पे',
      'उजाला हुआ जब समां बदल गया',
      'प्याला टूट गया उस दुकान पे',
      'निराला अंदाज़ सबका बदल गया'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB (मकान पे/दुकान पे, बदल गया/बदल गया)'
  },
  {
    id: 'scheme-027',
    schemeType: 'ABAB',
    lines: [
      'चाँद निकला तो रात हो गई',
      'सूरज ढला तो बात हो गई',
      'मांद में छुप गया शेर अचानक',
      'मुलाक़ात की बरसात हो गई'
    ],
    expectedScheme: ['A', 'A', 'B', 'A'], // AABA variant
    expectedGroups: 2,
    notes: 'AABA Ghazal structure (रात हो गई/बात हो गई/बरसात हो गई -> A, अचानक -> B)'
  },
  {
    id: 'scheme-028',
    schemeType: 'ABAB',
    lines: [
      'बादल घिरे जब गगन में आज',
      'घायल हुआ परिंदा तीर से',
      'काजल फैल गया नयन में आज',
      'क़ायल हुआ शिकारी पीर से'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB (गगन में आज/नयन में आज, तीर से/पीर से)'
  },
  {
    id: 'scheme-029',
    schemeType: 'ABAB',
    lines: [
      'जंगल में जब दंगल शुरू हुआ',
      'पहाड़ से उठी वो गूंज भारी',
      'मंगल का दिन था जश्न शुरू हुआ',
      'दहाड़ सुनी जब दुनिया सारी'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB (शुरू हुआ/शुरू हुआ, भारी/सारी)'
  },
  {
    id: 'scheme-030',
    schemeType: 'ABAB',
    lines: [
      'आँधी चली जब तूफान आया',
      'गांधी के वचनों को याद किया',
      'बाँधी जो डोर वो अरमान लाया',
      'साँधी जो प्रीत उसे आबाद किया'
    ],
    expectedScheme: ['A', 'B', 'A', 'B'],
    expectedGroups: 2,
    notes: 'ABAB (तूफान आया/अरमान लाया, याद किया/आबाद किया)'
  },

  // =========================================================================
  // 3. AAAA MONORHYME / 4-LINE HOOKS (10 CASES)
  // =========================================================================
  {
    id: 'scheme-031',
    schemeType: 'AAAA',
    lines: [
      'अंधेरी रात में जलती आग',
      'छोड़ के दुनिया को तू भाग',
      'किस्मत का चमकेगा भाग',
      'सीने में गूंजेगा ये राग'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (आग/भाग/भाग/राग)'
  },
  {
    id: 'scheme-032',
    schemeType: 'AAAA',
    lines: [
      'तेरा नाम ही मेरा काम',
      'सुबह से लेकर ढलती शाम',
      'हाथ में ले ले अपना जाम',
      'मेहनत का मिलेगा पूरा दाम'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (काम/शाम/जाम/दाम)'
  },
  {
    id: 'scheme-033',
    schemeType: 'AAAA',
    lines: [
      'प्यार किया तो माना यार',
      'दुश्मन पे कर दिया वार',
      'हार नहीं मानी इस बार',
      'पार करेंगे ये मझधार'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (यार/वार/बार/मझधार)'
  },
  {
    id: 'scheme-034',
    schemeType: 'AAAA',
    lines: [
      'शोर मचाता है ये दौर',
      'जोर लगा ले तू हर ओर',
      'मोर नाचेगा घनघोर',
      'तोड़ दे तू हर एक डोर'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (दौर/ओर/घनघोर/डोर)'
  },
  {
    id: 'scheme-035',
    schemeType: 'AAAA',
    lines: [
      'चाल बदल दी अपना हाल',
      'जाल बिछाया ऐसा साल',
      'लाल रंग का ये रूमाल',
      'गाल पे चमका वो गुलाल'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (हाल/साल/रूमाल/गुलाल)'
  },
  {
    id: 'scheme-036',
    schemeType: 'AAAA',
    lines: [
      'माइक पे आते ही फ्लो मेरा टाइट',
      'स्टेज पे करते हैं हम पूरी फाइट',
      'अंधेरे कमरे में जला दी लाइट',
      'करते हैं बातें जो thinking is right'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Hinglish Monorhyme (टाइट/फाइट/लाइट/right)'
  },
  {
    id: 'scheme-037',
    schemeType: 'AAAA',
    lines: [
      'गेम में हम हैं अब नंबर वन',
      'रैप में किया हमने पूरा फन',
      'हाथ में अपने नहीं कोई गन',
      'सूरज की धूप में चमकता सन'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Hinglish Monorhyme (वन/फन/गन/सन)'
  },
  {
    id: 'scheme-038',
    schemeType: 'AAAA',
    lines: [
      'बॉस की तरह किया सीन को रूल',
      'दिमाग़ अपना शांत और वाइब अपनी कूल',
      'स्कूल में सीखा था जो बन गया टूल',
      'हमको समझ ना तू कोई फूल'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Hinglish Monorhyme (रूल/कूल/टूल/फूल)'
  },
  {
    id: 'scheme-039',
    schemeType: 'AAAA',
    lines: [
      'रोटी मिली आधी पूरी',
      'चोटी पे चढ़े मजबूरी',
      'मोटी रकम की थी दूरी',
      'खोटी नीयत रही अधूरी'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (पूरी/मजबूरी/दूरी/अधूरी)'
  },
  {
    id: 'scheme-040',
    schemeType: 'AAAA',
    lines: [
      'सिक्का चला अपना हर बार',
      'इक्का निकला बड़ा सरदार',
      'धक्का दिया जो था गद्दार',
      'पक्का इरादा है इस बार'
    ],
    expectedScheme: ['A', 'A', 'A', 'A'],
    expectedGroups: 1,
    notes: 'AAAA Monorhyme (बार/सरदार/गद्दार/बार)'
  },

  // =========================================================================
  // 4. UNRHYMED & MIXED UNGROUPED BARS (15 CASES)
  // =========================================================================
  {
    id: 'scheme-041',
    schemeType: 'UNRHYMED',
    lines: [
      'अंधेरी रात में अकेला मैं खड़ा था',
      'शहर की सड़कों पे बहुत भीड़ थी',
      'सूरज की रोशनी खिड़की से आई',
      'किताब के पन्ने पलटते रहे'
    ],
    expectedScheme: ['—', '—', '—', '—'],
    expectedGroups: 0,
    notes: 'Completely unrhymed lines must remain unassigned (—) without forcing fake groups'
  },
  {
    id: 'scheme-042',
    schemeType: 'UNRHYMED',
    lines: [
      'पानी का गिलास मेज पर रखा था',
      'घड़ी की सुई टिक टिक कर रही थी',
      'दीवार पे एक पुरानी तस्वीर लटकी थी',
      'दरवाज़ा अचानक हवा से बंद हो गया'
    ],
    expectedScheme: ['—', '—', '—', '—'],
    expectedGroups: 0,
    notes: 'Unrhymed narrative bars'
  },
  {
    id: 'scheme-043',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'काली रात में जलती है आग',
      'शहर की सड़कों पे बहुत भीड़ थी',
      'छोड़ के दुनिया को तू अब भाग',
      'किताब के पन्ने पलटते रहे'
    ],
    expectedScheme: ['A', '—', 'A', '—'],
    expectedGroups: 1,
    notes: 'Lines 1 & 3 rhyme (A), lines 2 & 4 are completely unrhymed (—)'
  },
  {
    id: 'scheme-044',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'तेरा नाम ही मेरा काम बन गया',
      'सूरज की पहली किरण से सुबह हुई',
      'सुबह से शाम तक जाम बन गया',
      'चाय की चुस्की के साथ अखबार पढ़ा'
    ],
    expectedScheme: ['A', '—', 'A', '—'],
    expectedGroups: 1,
    notes: 'Lines 1 & 3 rhyme (A), lines 2 & 4 are unrhymed (—)'
  },
  {
    id: 'scheme-045',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'दिल में छुपा के रखा था जो दर्द',
      'रास्ते में एक अजनबी मिल गया',
      'मौसम बहुत ठंडा और हवा तेज थी',
      'बन गया आज वो सीने का मर्ज़'
    ],
    expectedScheme: ['A', '—', '—', 'A'],
    expectedGroups: 1,
    notes: 'Lines 1 & 4 rhyme (A), lines 2 & 3 are unrhymed (—)'
  },
  {
    id: 'scheme-046',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'माइक पे आते ही फ्लो मेरा टाइट',
      'कल रात मैंने एक फिल्म देखी थी',
      'दोस्त मेरे साथ खाना खा रहे थे',
      'स्टेज पे करते हैं हम पूरी फाइट'
    ],
    expectedScheme: ['A', '—', '—', 'A'],
    expectedGroups: 1,
    notes: 'Lines 1 & 4 rhyme (A), lines 2 & 3 unrhymed (—)'
  },
  {
    id: 'scheme-047',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'सवेरा हुआ तो अंधेरा बिखर गया',
      'चिड़ियाँ पेड़ पर चहक रही थीं',
      'ठंडी हवा से मन खुश हुआ',
      'सूरज की धूप में सब निखर गया'
    ],
    expectedScheme: ['A', '—', '—', 'A'],
    expectedGroups: 1,
    notes: 'Lines 1 & 4 rhyme (A: बिखर गया/निखर गया), lines 2 & 3 unrhymed'
  },
  {
    id: 'scheme-048',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'काली रात में जलती है आग',
      'छोड़ के दुनिया को तू अब भाग',
      'शहर की सड़कों पे बहुत भीड़ थी',
      'किताब के पन्ने पलटते रहे'
    ],
    expectedScheme: ['A', 'A', '—', '—'],
    expectedGroups: 1,
    notes: 'Lines 1 & 2 rhyme (A), lines 3 & 4 unrhymed (—)'
  },
  {
    id: 'scheme-049',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'शहर की सड़कों पे बहुत भीड़ थी',
      'किताब के पन्ने पलटते रहे',
      'काली रात में जलती है आग',
      'छोड़ के दुनिया को तू अब भाग'
    ],
    expectedScheme: ['—', '—', 'A', 'A'],
    expectedGroups: 1,
    notes: 'Lines 1 & 2 unrhymed (—), lines 3 & 4 rhyme (A)'
  },
  {
    id: 'scheme-050',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'तेरा नाम ही मेरा काम बन गया',
      'सुबह से शाम तक जाम बन गया',
      'अचानक बारिश शुरू हो गई बाहर',
      'पेड़ों के पत्ते गिरने लगे नीचे'
    ],
    expectedScheme: ['A', 'A', '—', '—'],
    expectedGroups: 1,
    notes: 'Lines 1 & 2 rhyme (A), lines 3 & 4 unrhymed (—)'
  },
  {
    id: 'scheme-051',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'अचानक बारिश शुरू हो गई बाहर',
      'पेड़ों के पत्ते गिरने लगे नीचे',
      'तेरा नाम ही मेरा काम बन गया',
      'सुबह से शाम तक जाम बन गया'
    ],
    expectedScheme: ['—', '—', 'A', 'A'],
    expectedGroups: 1,
    notes: 'Lines 1 & 2 unrhymed (—), lines 3 & 4 rhyme (A)'
  },
  {
    id: 'scheme-052',
    schemeType: 'UNRHYMED',
    lines: [
      'लैपटॉप पर कोडिंग कर रहा हूँ',
      'बाहर कुत्ते भौंक रहे हैं',
      'चाय अब बिल्कुल ठंडी हो चुकी है',
      'नींद आँखों में धीरे-धीरे आ रही है'
    ],
    expectedScheme: ['—', '—', '—', '—'],
    expectedGroups: 0,
    notes: 'Modern prosaic unrhymed lines'
  },
  {
    id: 'scheme-053',
    schemeType: 'UNRHYMED',
    lines: [
      'फोन की बैटरी 10 परसेंट बची है',
      'इंटरनेट कनेक्शन बहुत स्लो है',
      'कमरे में पंखा तेज चल रहा है',
      'टेबल पर बहुत सारी किताबें फैली हैं'
    ],
    expectedScheme: ['—', '—', '—', '—'],
    expectedGroups: 0,
    notes: 'Modern conversational unrhymed lines'
  },
  {
    id: 'scheme-054',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'माइक पे आते ही फ्लो मेरा टाइट',
      'स्टेज पे करते हैं हम पूरी फाइट',
      'फोन की बैटरी 10 परसेंट बची है',
      'टेबल पर बहुत सारी किताबें फैली हैं'
    ],
    expectedScheme: ['A', 'A', '—', '—'],
    expectedGroups: 1,
    notes: 'AA followed by 2 unrhymed lines'
  },
  {
    id: 'scheme-055',
    schemeType: 'MIXED_UNRHYMED',
    lines: [
      'फोन की बैटरी 10 परसेंट बची है',
      'माइक पे आते ही फ्लो मेरा टाइट',
      'टेबल पर बहुत सारी किताबें फैली हैं',
      'स्टेज पे करते हैं हम पूरी फाइट'
    ],
    expectedScheme: ['—', 'A', '—', 'A'],
    expectedGroups: 1,
    notes: 'Alternating unrhymed lines with A rhyme on lines 2 and 4'
  }
];
