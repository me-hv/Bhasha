export interface InternalRhymeGoldCase {
  id: string;
  text: string;
  expectedPairs: Array<{ word1: string; word2: string; expectedTier: 'PERFECT' | 'STRONG' | 'MULTISYLLABIC' | 'NEAR' }>;
  rejectedPairs: Array<{ word1: string; word2: string }>;
  notes: string;
}

export const INTERNAL_RHYMES_CASES: InternalRhymeGoldCase[] = [
  // =========================================================================
  // 1. MID-BAR / INTERNAL MONORHYME PAIRS (35 CASES)
  // =========================================================================
  {
    id: 'ir-001',
    text: 'रात का सन्नाटा बात से गहरा है',
    expectedPairs: [{ word1: 'रात', word2: 'बात', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'रात', word2: 'गहरा' }, { word1: 'सन्नाटा', word2: 'गहरा' }],
    notes: 'Internal rhyme between word 1 (रात) and word 4 (बात)'
  },
  {
    id: 'ir-002',
    text: 'तेरा नाम ही मेरा काम बन गया',
    expectedPairs: [{ word1: 'नाम', word2: 'काम', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'तेरा', word2: 'काम' }, { word1: 'नाम', word2: 'गया' }],
    notes: 'Internal pair नाम ↔ काम'
  },
  {
    id: 'ir-003',
    text: 'दिल की बात जब मिल के कही हमने',
    expectedPairs: [{ word1: 'दिल', word2: 'मिल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'दिल', word2: 'कही' }, { word1: 'बात', word2: 'हमने' }],
    notes: 'Internal pair दिल ↔ मिल'
  },
  {
    id: 'ir-004',
    text: 'आग लगी सीने में भाग उठा शैतान',
    expectedPairs: [{ word1: 'आग', word2: 'भाग', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'आग', word2: 'शैतान' }, { word1: 'सीने', word2: 'शैतान' }],
    notes: 'Internal pair आग ↔ भाग'
  },
  {
    id: 'ir-005',
    text: 'शोर शराबा बहुत है जोर लगा ले तू',
    expectedPairs: [{ word1: 'शोर', word2: 'जोर', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'शोर', word2: 'लगा' }, { word1: 'शराबा', word2: 'जोर' }],
    notes: 'Internal pair शोर ↔ जोर'
  },
  {
    id: 'ir-006',
    text: 'चाल समझ ले अपनी हाल संभाल ले तू',
    expectedPairs: [{ word1: 'चाल', word2: 'हाल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'चाल', word2: 'अपनी' }, { word1: 'समझ', word2: 'हाल' }],
    notes: 'Internal pair चाल ↔ हाल'
  },
  {
    id: 'ir-007',
    text: 'सच की राह पे चल के बच जाएगा तू',
    expectedPairs: [{ word1: 'सच', word2: 'बच', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'सच', word2: 'राह' }, { word1: 'चल', word2: 'जाएगा' }],
    notes: 'Internal pair सच ↔ बच'
  },
  {
    id: 'ir-008',
    text: 'शर्म नहीं है तुझको गर्म हुआ माहौल',
    expectedPairs: [{ word1: 'शर्म', word2: 'गर्म', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'शर्म', word2: 'माहौल' }, { word1: 'तुझको', word2: 'गर्म' }],
    notes: 'Internal pair शर्म ↔ गर्म'
  },
  {
    id: 'ir-009',
    text: 'आस लगी थी दिल में प्यास बुझा ना सका',
    expectedPairs: [{ word1: 'आस', word2: 'प्यास', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'आस', word2: 'दिल' }, { word1: 'लगी', word2: 'सका' }],
    notes: 'Internal pair आस ↔ प्यास'
  },
  {
    id: 'ir-010',
    text: 'दिन भर की ये मेहनत गिन ले अपने हाथ',
    expectedPairs: [{ word1: 'दिन', word2: 'गिन', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'दिन', word2: 'हाथ' }, { word1: 'मेहनत', word2: 'गिन' }],
    notes: 'Internal pair दिन ↔ गिन'
  },
  {
    id: 'ir-011',
    text: 'दम है अगर तो आके ग़म को मिटा के देख',
    expectedPairs: [{ word1: 'दम', word2: 'ग़म', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'दम', word2: 'देख' }, { word1: 'आके', word2: 'ग़म' }],
    notes: 'Internal pair दम ↔ ग़म'
  },
  {
    id: 'ir-012',
    text: 'शहर में जो फैला ज़हर उसे कौन रोकेगा',
    expectedPairs: [{ word1: 'शहर', word2: 'ज़हर', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'शहर', word2: 'रोकेगा' }, { word1: 'फैला', word2: 'ज़हर' }],
    notes: 'Internal pair शहर ↔ ज़हर'
  },
  {
    id: 'ir-013',
    text: 'क़हर बरपा है ऐसा लहर उठी है तेज',
    expectedPairs: [{ word1: 'क़हर', word2: 'लहर', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'क़हर', word2: 'तेज' }, { word1: 'बरपा', word2: 'लहर' }],
    notes: 'Internal pair क़हर ↔ लहर'
  },
  {
    id: 'ir-014',
    text: 'सफ़र लंबा है लेकिन असर गहरा होगा',
    expectedPairs: [{ word1: 'सफ़र', word2: 'असर', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सफ़र', word2: 'होगा' }, { word1: 'लंबा', word2: 'असर' }],
    notes: 'Internal pair सफ़र ↔ असर'
  },
  {
    id: 'ir-015',
    text: 'ख़बर मिली है मुझको नज़र में तू ही है',
    expectedPairs: [{ word1: 'ख़बर', word2: 'नज़र', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'ख़बर', word2: 'मुझको' }, { word1: 'नज़र', word2: 'है' }],
    notes: 'Internal pair ख़बर ↔ नज़र'
  },
  {
    id: 'ir-016',
    text: 'सवेरा हुआ तो सारा अंधेरा छंट गया',
    expectedPairs: [{ word1: 'सवेरा', word2: 'अंधेरा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सवेरा', word2: 'गया' }, { word1: 'सारा', word2: 'अंधेरा' }],
    notes: 'Internal pair सवेरा ↔ अंधेरा'
  },
  {
    id: 'ir-017',
    text: 'किनारा छोड़ के तूने सहारा ढूँढ लिया',
    expectedPairs: [{ word1: 'किनारा', word2: 'सहारा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'किनारा', word2: 'लिया' }, { word1: 'छोड़', word2: 'सहारा' }],
    notes: 'Internal pair किनारा ↔ सहारा'
  },
  {
    id: 'ir-018',
    text: 'सितारा चमका जैसे इशारा मिल गया',
    expectedPairs: [{ word1: 'सितारा', word2: 'इशारा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सितारा', word2: 'गया' }, { word1: 'चमका', word2: 'इशारा' }],
    notes: 'Internal pair सितारा ↔ इशारा'
  },
  {
    id: 'ir-019',
    text: 'ज़िंदगी में जब तक बंदगी नहीं होती',
    expectedPairs: [{ word1: 'ज़िंदगी', word2: 'बंदगी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'ज़िंदगी', word2: 'होती' }, { word1: 'तक', word2: 'बंदगी' }],
    notes: 'Internal pair ज़िंदगी ↔ बंदगी'
  },
  {
    id: 'ir-020',
    text: 'सादगी में छुपी है ताज़गी की कहानी',
    expectedPairs: [{ word1: 'सादगी', word2: 'ताज़गी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सादगी', word2: 'कहानी' }, { word1: 'छुपी', word2: 'ताज़गी' }],
    notes: 'Internal pair सादगी ↔ ताज़गी'
  },
  {
    id: 'ir-021',
    text: 'हक़ मिला है सबको शक क्यों करता है',
    expectedPairs: [{ word1: 'हक़', word2: 'शक', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'हक़', word2: 'करता' }, { word1: 'सबको', word2: 'शक' }],
    notes: 'Internal pair हक़ ↔ शक'
  },
  {
    id: 'ir-022',
    text: 'सवाल तेरा कड़ा था जवाब सीधा मिला',
    expectedPairs: [{ word1: 'सवाल', word2: 'जवाब', expectedTier: 'STRONG' }],
    rejectedPairs: [{ word1: 'सवाल', word2: 'मिला' }, { word1: 'कड़ा', word2: 'जवाब' }],
    notes: 'Internal slant pair सवाल ↔ जवाब'
  },
  {
    id: 'ir-023',
    text: 'हिसाब साफ़ है मेरा किताब खोल के देख',
    expectedPairs: [{ word1: 'हिसाब', word2: 'किताब', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'हिसाब', word2: 'देख' }, { word1: 'साफ़', word2: 'किताब' }],
    notes: 'Internal pair हिसाब ↔ किताब'
  },
  {
    id: 'ir-024',
    text: 'गुलाब जैसा महका शराब का ये प्याला',
    expectedPairs: [{ word1: 'गुलाब', word2: 'शराब', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'गुलाब', word2: 'प्याला' }, { word1: 'महका', word2: 'शराब' }],
    notes: 'Internal pair गुलाब ↔ शराब'
  },
  {
    id: 'ir-025',
    text: 'ताबीर हुई पूरी तस्वीर बन गई जब',
    expectedPairs: [{ word1: 'ताबीर', word2: 'तस्वीर', expectedTier: 'STRONG' }],
    rejectedPairs: [{ word1: 'ताबीर', word2: 'जब' }, { word1: 'पूरी', word2: 'तस्वीर' }],
    notes: 'Internal pair ताबीर ↔ तस्वीर'
  },
  {
    id: 'ir-026',
    text: 'तक़दीर खुली अपनी ज़ंजीर टूट गई',
    expectedPairs: [{ word1: 'तक़दीर', word2: 'ज़ंजीर', expectedTier: 'STRONG' }],
    rejectedPairs: [{ word1: 'तक़दीर', word2: 'गई' }, { word1: 'अपनी', word2: 'ज़ंजीर' }],
    notes: 'Internal pair तक़दीर ↔ ज़ंजीर'
  },
  {
    id: 'ir-027',
    text: 'तीर चला सीने पे पीर जागी अंदर',
    expectedPairs: [{ word1: 'तीर', word2: 'पीर', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'तीर', word2: 'अंदर' }, { word1: 'सीने', word2: 'पीर' }],
    notes: 'Internal pair तीर ↔ पीर'
  },
  {
    id: 'ir-028',
    text: 'अमीर हो या गदा फकीर सब हैं बराबर',
    expectedPairs: [{ word1: 'अमीर', word2: 'फकीर', expectedTier: 'STRONG' }],
    rejectedPairs: [{ word1: 'अमीर', word2: 'बराबर' }, { word1: 'गदा', word2: 'फकीर' }],
    notes: 'Internal pair अमीर ↔ फकीर'
  },
  {
    id: 'ir-029',
    text: 'ग़रीब के दिल के क़रीब है वो खुदा',
    expectedPairs: [{ word1: 'ग़रीब', word2: 'क़रीब', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'ग़रीब', word2: 'खुदा' }, { word1: 'दिल', word2: 'क़रीब' }],
    notes: 'Internal pair ग़रीब ↔ क़रीब'
  },
  {
    id: 'ir-030',
    text: 'नसीब बदला तो हबीब मिल गया मुझे',
    expectedPairs: [{ word1: 'नसीब', word2: 'हबीब', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'नसीब', word2: 'मुझे' }, { word1: 'बदला', word2: 'हबीब' }],
    notes: 'Internal pair नसीब ↔ हबीब'
  },
  {
    id: 'ir-031',
    text: 'मंज़िल मिली उसको साहिल पे जो खड़ा था',
    expectedPairs: [{ word1: 'मंज़िल', word2: 'साहिल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'मंज़िल', word2: 'था' }, { word1: 'उसको', word2: 'साहिल' }],
    notes: 'Internal pair मंज़िल ↔ साहिल'
  },
  {
    id: 'ir-032',
    text: 'महफ़िल में आ गया क़ातिल छुपा हुआ',
    expectedPairs: [{ word1: 'महफ़िल', word2: 'क़ातिल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'महफ़िल', word2: 'हुआ' }, { word1: 'आ', word2: 'क़ातिल' }],
    notes: 'Internal pair महफ़िल ↔ क़ातिल'
  },
  {
    id: 'ir-033',
    text: 'चलना सीखा जब तो जलना छोड़ दिया',
    expectedPairs: [{ word1: 'चलना', word2: 'जलना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'चलना', word2: 'दिया' }, { word1: 'सीखा', word2: 'जलना' }],
    notes: 'Internal pair चलना ↔ जलना'
  },
  {
    id: 'ir-034',
    text: 'भागना बंद कर और जागना शुरू कर',
    expectedPairs: [{ word1: 'भागना', word2: 'जागना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'भागना', word2: 'कर' }, { word1: 'बंद', word2: 'जागना' }],
    notes: 'Internal pair भागना ↔ जागना'
  },
  {
    id: 'ir-035',
    text: 'लड़ना सीखा हमने पड़ना नहीं कभी',
    expectedPairs: [{ word1: 'लड़ना', word2: 'पड़ना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'लड़ना', word2: 'कभी' }, { word1: 'सीखा', word2: 'पड़ना' }],
    notes: 'Internal pair लड़ना ↔ पड़ना'
  },

  // =========================================================================
  // 2. MULTI-SYLLABIC INTERNAL RAP CADENCES (35 CASES)
  // =========================================================================
  {
    id: 'ir-036',
    text: 'दीवाना दिल मेरा परवाना बन के डोला',
    expectedPairs: [{ word1: 'दीवाना', word2: 'परवाना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'दीवाना', word2: 'डोला' }, { word1: 'मेरा', word2: 'परवाना' }],
    notes: 'Internal pair दीवाना ↔ परवाना'
  },
  {
    id: 'ir-037',
    text: 'मस्ताना घूमता फ़साना सुनाता हुआ',
    expectedPairs: [{ word1: 'मस्ताना', word2: 'फ़साना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'मस्ताना', word2: 'हुआ' }, { word1: 'घूमता', word2: 'फ़साना' }],
    notes: 'Internal pair मस्ताना ↔ फ़साना'
  },
  {
    id: 'ir-038',
    text: 'ज़माना बदला तो निशाना भी बदल गया',
    expectedPairs: [{ word1: 'ज़माना', word2: 'निशाना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'ज़माना', word2: 'गया' }, { word1: 'बदला', word2: 'निशाना' }],
    notes: 'Internal pair ज़माना ↔ निशाना'
  },
  {
    id: 'ir-039',
    text: 'बहाना मत बना तराना गा के सुना',
    expectedPairs: [{ word1: 'बहाना', word2: 'तराना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'बहाना', word2: 'सुना' }, { word1: 'बना', word2: 'तराना' }],
    notes: 'Internal pair बहाना ↔ तराना'
  },
  {
    id: 'ir-040',
    text: 'मयख़ाना खुला तो पैमाना भर दिया',
    expectedPairs: [{ word1: 'मयख़ाना', word2: 'पैमाना', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'मयख़ाना', word2: 'दिया' }, { word1: 'खुला', word2: 'पैमाना' }],
    notes: 'Internal pair मयख़ाना ↔ पैमाना'
  },
  {
    id: 'ir-041',
    text: 'सिकंदर की तरह समंदर पार किया',
    expectedPairs: [{ word1: 'सिकंदर', word2: 'समंदर', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सिकंदर', word2: 'किया' }, { word1: 'तरह', word2: 'समंदर' }],
    notes: 'Internal pair सिकंदर ↔ समंदर'
  },
  {
    id: 'ir-042',
    text: 'जवानी की ये कहानी सबको याद है',
    expectedPairs: [{ word1: 'जवानी', word2: 'कहानी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'जवानी', word2: 'है' }, { word1: 'ये', word2: 'कहानी' }],
    notes: 'Internal pair जवानी ↔ कहानी'
  },
  {
    id: 'ir-043',
    text: 'रवानी से चली नशानी छोड़ के गई',
    expectedPairs: [{ word1: 'रवानी', word2: 'नशानी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'रवानी', word2: 'गई' }, { word1: 'चली', word2: 'नशानी' }],
    notes: 'Internal pair रवानी ↔ नशानी'
  },
  {
    id: 'ir-044',
    text: 'रूहानी सुकून है ज़ुबानी बात में',
    expectedPairs: [{ word1: 'रूहानी', word2: 'ज़ुबानी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'रूहानी', word2: 'में' }, { word1: 'सुकून', word2: 'ज़ुबानी' }],
    notes: 'Internal pair रूहानी ↔ ज़ुबानी'
  },
  {
    id: 'ir-045',
    text: 'हवाबाज़ी छोड़ दगाबाज़ी मत कर',
    expectedPairs: [{ word1: 'हवाबाज़ी', word2: 'दगाबाज़ी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'हवाबाज़ी', word2: 'कर' }, { word1: 'छोड़', word2: 'दगाबाज़ी' }],
    notes: 'Internal pair हवाबाज़ी ↔ दगाबाज़ी'
  },
  {
    id: 'ir-046',
    text: 'शानदार फ्लो से जानदार काम किया',
    expectedPairs: [{ word1: 'शानदार', word2: 'जानदार', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'शानदार', word2: 'किया' }, { word1: 'फ्लो', word2: 'जानदार' }],
    notes: 'Internal pair शानदार ↔ जानदार'
  },
  {
    id: 'ir-047',
    text: 'तन्हाई में रोया जुदाई का दर्द लेकर',
    expectedPairs: [{ word1: 'तन्हाई', word2: 'जुदाई', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'तन्हाई', word2: 'लेकर' }, { word1: 'रोया', word2: 'जुदाई' }],
    notes: 'Internal pair तन्हाई ↔ जुदाई'
  },
  {
    id: 'ir-048',
    text: 'गहराई में उतरा सच्चाई मिल गई',
    expectedPairs: [{ word1: 'गहराई', word2: 'सच्चाई', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'गहराई', word2: 'गई' }, { word1: 'उतरा', word2: 'सच्चाई' }],
    notes: 'Internal pair गहराई ↔ सच्चाई'
  },
  {
    id: 'ir-049',
    text: 'फ़ुरसत मिले तो क़ुदरत का दीदार कर',
    expectedPairs: [{ word1: 'फ़ुरसत', word2: 'क़ुदरत', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'फ़ुरसत', word2: 'कर' }, { word1: 'मिले', word2: 'क़ुदरत' }],
    notes: 'Internal pair फ़ुरसत ↔ क़ुदरत'
  },
  {
    id: 'ir-050',
    text: 'शोहरत कमाई बहुत नफ़रत भी झेली है',
    expectedPairs: [{ word1: 'शोहरत', word2: 'नफ़रत', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'शोहरत', word2: 'है' }, { word1: 'कमाई', word2: 'नफ़रत' }],
    notes: 'Internal pair शोहरत ↔ नफ़रत'
  },
  {
    id: 'ir-051',
    text: 'हिम्मत जुटा के अपनी क़िस्मत बदल दी',
    expectedPairs: [{ word1: 'हिम्मत', word2: 'क़िस्मत', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'हिम्मत', word2: 'दी' }, { word1: 'जुटा', word2: 'क़िस्मत' }],
    notes: 'Internal pair हिम्मत ↔ क़िस्मत'
  },
  {
    id: 'ir-052',
    text: 'जन्नत मिलेगी या मन्नत पूरी होगी',
    expectedPairs: [{ word1: 'जन्नत', word2: 'मन्नत', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'जन्नत', word2: 'होगी' }, { word1: 'मिलेगी', word2: 'मन्नत' }],
    notes: 'Internal pair जन्नत ↔ मन्नत'
  },
  {
    id: 'ir-053',
    text: 'आदत सुधारी जब तो इबादत कबूल हुई',
    expectedPairs: [{ word1: 'आदत', word2: 'इबादत', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'आदत', word2: 'हुई' }, { word1: 'सुधारी', word2: 'इबादत' }],
    notes: 'Internal pair आदत ↔ इबादत'
  },
  {
    id: 'ir-054',
    text: 'शिकायत छोड़ दी हिदायत मिल गई जब',
    expectedPairs: [{ word1: 'शिकायत', word2: 'हिदायत', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'शिकायत', word2: 'जब' }, { word1: 'छोड़', word2: 'हिदायत' }],
    notes: 'Internal pair शिकायत ↔ हिदायत'
  },
  {
    id: 'ir-055',
    text: 'अमानत रखी थी ज़मानत मिल गई',
    expectedPairs: [{ word1: 'अमानत', word2: 'ज़मानत', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'अमानत', word2: 'गई' }, { word1: 'रखी', word2: 'ज़मानत' }],
    notes: 'Internal pair अमानत ↔ ज़मानत'
  },
  {
    id: 'ir-056',
    text: 'सियासत का खेल रियासत तक पहुंचा',
    expectedPairs: [{ word1: 'सियासत', word2: 'रियासत', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सियासत', word2: 'पहुंचा' }, { word1: 'खेल', word2: 'रियासत' }],
    notes: 'Internal pair सियासत ↔ रियासत'
  },
  {
    id: 'ir-057',
    text: 'क़यामत आएगी पर वो सलामत रहेगा',
    expectedPairs: [{ word1: 'क़यामत', word2: 'सलामत', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'क़यामत', word2: 'रहेगा' }, { word1: 'आएगी', word2: 'सलामत' }],
    notes: 'Internal pair क़यामत ↔ सलामत'
  },
  {
    id: 'ir-058',
    text: 'मलाल नहीं मुझको हलाल की कमाई पे',
    expectedPairs: [{ word1: 'मलाल', word2: 'हलाल', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'मलाल', word2: 'पे' }, { word1: 'मुझको', word2: 'हलाल' }],
    notes: 'Internal pair मलाल ↔ हलाल'
  },
  {
    id: 'ir-059',
    text: 'हलाल कमाई में ही जलाल मिलता है',
    expectedPairs: [{ word1: 'हलाल', word2: 'जलाल', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'हलाल', word2: 'है' }, { word1: 'कमाई', word2: 'जलाल' }],
    notes: 'Internal pair हलाल ↔ जलाल'
  },
  {
    id: 'ir-060',
    text: 'मिसाल बन गया विसाल की वो रात',
    expectedPairs: [{ word1: 'मिसाल', word2: 'विसाल', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'मिसाल', word2: 'रात' }, { word1: 'बन', word2: 'विसाल' }],
    notes: 'Internal pair मिसाल ↔ विसाल'
  },
  {
    id: 'ir-061',
    text: 'पलक झपकी तो झलक दिख गई',
    expectedPairs: [{ word1: 'पलक', word2: 'झलक', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'पलक', word2: 'गई' }, { word1: 'झपकी', word2: 'झलक' }],
    notes: 'Internal pair पलक ↔ झलक'
  },
  {
    id: 'ir-062',
    text: 'चमक उठी आँखें दमक उठा चेहरा',
    expectedPairs: [{ word1: 'चमक', word2: 'दमक', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'चमक', word2: 'चेहरा' }, { word1: 'आँखें', word2: 'दमक' }],
    notes: 'Internal pair चमक ↔ दमक'
  },
  {
    id: 'ir-063',
    text: 'महक फैली जब बहक उठा हर दिल',
    expectedPairs: [{ word1: 'महक', word2: 'बहक', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'महक', word2: 'दिल' }, { word1: 'फैली', word2: 'बहक' }],
    notes: 'Internal pair महक ↔ बहक'
  },
  {
    id: 'ir-064',
    text: 'तरकीब लगाई जब तरतीब बन गई',
    expectedPairs: [{ word1: 'तरकीब', word2: 'तरतीब', expectedTier: 'STRONG' }],
    rejectedPairs: [{ word1: 'तरकीब', word2: 'गई' }, { word1: 'लगाई', word2: 'तरतीब' }],
    notes: 'Internal pair तरकीब ↔ तरतीब'
  },
  {
    id: 'ir-065',
    text: 'मतला कहा पहले मक़्ता पे खत्म किया',
    expectedPairs: [{ word1: 'मतला', word2: 'मक़्ता', expectedTier: 'STRONG' }],
    rejectedPairs: [{ word1: 'मतला', word2: 'किया' }, { word1: 'पहले', word2: 'मक़्ता' }],
    notes: 'Internal pair मतला ↔ मक़्ता'
  },
  {
    id: 'ir-066',
    text: 'आज़ादी की खातिर बरबादी भी सही',
    expectedPairs: [{ word1: 'आज़ादी', word2: 'बरबादी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'आज़ादी', word2: 'सही' }, { word1: 'खातिर', word2: 'बरबादी' }],
    notes: 'Internal pair आज़ादी ↔ बरबादी'
  },
  {
    id: 'ir-067',
    text: 'बरबादी के बाद आबादी फिर बसी',
    expectedPairs: [{ word1: 'बरबादी', word2: 'आबादी', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'बरबादी', word2: 'बसी' }, { word1: 'बाद', word2: 'आबादी' }],
    notes: 'Internal pair बरबादी ↔ आबादी'
  },
  {
    id: 'ir-068',
    text: 'भौकाल देख के बवाल मच गया',
    expectedPairs: [{ word1: 'भौकाल', word2: 'बवाल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'भौकाल', word2: 'गया' }, { word1: 'देख', word2: 'बवाल' }],
    notes: 'Internal pair भौकाल ↔ बवाल'
  },
  {
    id: 'ir-069',
    text: 'धमाल किया जब कमाल हो गया',
    expectedPairs: [{ word1: 'धमाल', word2: 'कमाल', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'धमाल', word2: 'गया' }, { word1: 'किया', word2: 'कमाल' }],
    notes: 'Internal pair धमाल ↔ कमाल'
  },
  {
    id: 'ir-070',
    text: 'धूम मचाई हमने झूम उठा शहर',
    expectedPairs: [{ word1: 'धूम', word2: 'झूम', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'धूम', word2: 'शहर' }, { word1: 'मचाई', word2: 'झूम' }],
    notes: 'Internal pair धूम ↔ झूम'
  },

  // =========================================================================
  // 3. HINGLISH & WESTERN LOANWORD INTERNAL RHYMES (35 CASES)
  // =========================================================================
  {
    id: 'ir-071',
    text: 'माइक पे आते ही स्ट्राइक किया हमने',
    expectedPairs: [{ word1: 'माइक', word2: 'स्ट्राइक', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'माइक', word2: 'हमने' }, { word1: 'आते', word2: 'स्ट्राइक' }],
    notes: 'Internal pair माइक ↔ स्ट्राइक'
  },
  {
    id: 'ir-072',
    text: 'गेम में मिला जब फेम तो बढ़ गया',
    expectedPairs: [{ word1: 'गेम', word2: 'फेम', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'गेम', word2: 'गया' }, { word1: 'मिला', word2: 'फेम' }],
    notes: 'Internal pair गेम ↔ फेम'
  },
  {
    id: 'ir-073',
    text: 'फेम के साथ अपना नेम भी बन गया',
    expectedPairs: [{ word1: 'फेम', word2: 'नेम', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'फेम', word2: 'गया' }, { word1: 'साथ', word2: 'नेम' }],
    notes: 'Internal pair फेम ↔ नेम'
  },
  {
    id: 'ir-074',
    text: 'बॉस बना बैठा जो लॉस में चला गया',
    expectedPairs: [{ word1: 'बॉस', word2: 'लॉस', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'बॉस', word2: 'गया' }, { word1: 'बैठा', word2: 'लॉस' }],
    notes: 'Internal pair बॉस ↔ लॉस'
  },
  {
    id: 'ir-075',
    text: 'किंग बन के बैठा जो रिंग में उतरा',
    expectedPairs: [{ word1: 'किंग', word2: 'रिंग', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'किंग', word2: 'उतरा' }, { word1: 'बैठा', word2: 'रिंग' }],
    notes: 'Internal pair किंग ↔ रिंग'
  },
  {
    id: 'ir-076',
    text: 'ड्रॉप गिरा जैसे ही पॉप म्यूजिक बजा',
    expectedPairs: [{ word1: 'ड्रॉप', word2: 'पॉप', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'ड्रॉप', word2: 'बजा' }, { word1: 'जैसे', word2: 'पॉप' }],
    notes: 'Internal pair ड्रॉप ↔ पॉप'
  },
  {
    id: 'ir-077',
    text: 'पॉप कल्चर छोड़ के टॉप पे पहुंचेंगे',
    expectedPairs: [{ word1: 'पॉप', word2: 'टॉप', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'पॉप', word2: 'पहुंचेंगे' }, { word1: 'छोड़', word2: 'टॉप' }],
    notes: 'Internal pair पॉप ↔ टॉप'
  },
  {
    id: 'ir-078',
    text: 'हुक डाला गाने में लुक बदल गया',
    expectedPairs: [{ word1: 'हुक', word2: 'लुक', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'हुक', word2: 'गया' }, { word1: 'गाने', word2: 'लुक' }],
    notes: 'Internal pair हुक ↔ लुक'
  },
  {
    id: 'ir-079',
    text: 'ट्रैप बीट पे हमने रैप किया पूरा',
    expectedPairs: [{ word1: 'ट्रैप', word2: 'रैप', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'ट्रैप', word2: 'पूरा' }, { word1: 'बीट', word2: 'रैप' }],
    notes: 'Internal pair ट्रैप ↔ रैप'
  },
  {
    id: 'ir-080',
    text: 'रैप में नो कैप सिर्फ़ सच बोलते हैं',
    expectedPairs: [{ word1: 'रैप', word2: 'कैप', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'रैप', word2: 'हैं' }, { word1: 'नो', word2: 'कैप' }],
    notes: 'Internal pair रैप ↔ कैप'
  },
  {
    id: 'ir-081',
    text: 'हिट गाना गिरा के लिट किया माहौल',
    expectedPairs: [{ word1: 'हिट', word2: 'लिट', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'हिट', word2: 'माहौल' }, { word1: 'गाना', word2: 'लिट' }],
    notes: 'Internal pair हिट ↔ लिट'
  },
  {
    id: 'ir-082',
    text: 'फ़िट बॉडी अपनी और हिट अपना गाना',
    expectedPairs: [{ word1: 'फ़िट', word2: 'हिट', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'फ़िट', word2: 'गाना' }, { word1: 'बॉडी', word2: 'हिट' }],
    notes: 'Internal pair फ़िट ↔ हिट'
  },
  {
    id: 'ir-083',
    text: 'क्लब में जब एंट्री ली तो सब देखने लगे',
    expectedPairs: [{ word1: 'क्लब', word2: 'सब', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'क्लब', word2: 'लगे' }, { word1: 'एंट्री', word2: 'सब' }],
    notes: 'Internal pair क्लब ↔ सब'
  },
  {
    id: 'ir-084',
    text: 'ट्रैक पे जब उतरे ब्लैक मनी छोड़ के',
    expectedPairs: [{ word1: 'ट्रैक', word2: 'ब्लैक', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'ट्रैक', word2: 'के' }, { word1: 'उतरे', word2: 'ब्लैक' }],
    notes: 'Internal pair ट्रैक ↔ ब्लैक'
  },
  {
    id: 'ir-085',
    text: 'स्टेज पे जब आए पेज पलट दिया',
    expectedPairs: [{ word1: 'स्टेज', word2: 'पेज', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'स्टेज', word2: 'दिया' }, { word1: 'आए', word2: 'पेज' }],
    notes: 'Internal pair स्टेज ↔ पेज'
  },
  {
    id: 'ir-086',
    text: 'रोटी मिली आधी बोटी मिली नहीं',
    expectedPairs: [{ word1: 'रोटी', word2: 'बोटी', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'रोटी', word2: 'नहीं' }, { word1: 'आधी', word2: 'बोटी' }],
    notes: 'Internal pair रोटी ↔ बोटी'
  },
  {
    id: 'ir-087',
    text: 'चोटी पे चढ़े तो मोटी रकम मिली',
    expectedPairs: [{ word1: 'चोटी', word2: 'मोटी', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'चोटी', word2: 'मिली' }, { word1: 'चढ़े', word2: 'मोटी' }],
    notes: 'Internal pair चोटी ↔ मोटी'
  },
  {
    id: 'ir-088',
    text: 'कपड़ा फटा जब टुकड़ा मिला दिल का',
    expectedPairs: [{ word1: 'कपड़ा', word2: 'टुकड़ा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'कपड़ा', word2: 'का' }, { word1: 'फटा', word2: 'टुकड़ा' }],
    notes: 'Internal pair कपड़ा ↔ टुकड़ा'
  },
  {
    id: 'ir-089',
    text: 'मुखड़ा चमका तो झगड़ा ख़त्म हुआ',
    expectedPairs: [{ word1: 'मुखड़ा', word2: 'झगड़ा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'मुखड़ा', word2: 'हुआ' }, { word1: 'चमका', word2: 'झगड़ा' }],
    notes: 'Internal pair मुखड़ा ↔ झगड़ा'
  },
  {
    id: 'ir-090',
    text: 'चाय पीते पीते राय मिल गई अच्छी',
    expectedPairs: [{ word1: 'चाय', word2: 'राय', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'चाय', word2: 'अच्छी' }, { word1: 'पीते', word2: 'राय' }],
    notes: 'Internal pair चाय ↔ राय'
  },
  {
    id: 'ir-091',
    text: 'गाड़ी चली आगे झाड़ी में छुप गया',
    expectedPairs: [{ word1: 'गाड़ी', word2: 'झाड़ी', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'गाड़ी', word2: 'गया' }, { word1: 'चली', word2: 'झाड़ी' }],
    notes: 'Internal pair गाड़ी ↔ झाड़ी'
  },
  {
    id: 'ir-092',
    text: 'झाड़ी के पीछे साड़ी चमक उठी',
    expectedPairs: [{ word1: 'झाड़ी', word2: 'साड़ी', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'झाड़ी', word2: 'उठी' }, { word1: 'पीछे', word2: 'साड़ी' }],
    notes: 'Internal pair झाड़ी ↔ साड़ी'
  },
  {
    id: 'ir-093',
    text: 'सिक्का चला अपना इक्का निकला बड़ा',
    expectedPairs: [{ word1: 'सिक्का', word2: 'इक्का', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सिक्का', word2: 'बड़ा' }, { word1: 'चला', word2: 'इक्का' }],
    notes: 'Internal pair सिक्का ↔ इक्का'
  },
  {
    id: 'ir-094',
    text: 'धक्का लगा जब तो पक्का यकीन हुआ',
    expectedPairs: [{ word1: 'धक्का', word2: 'पक्का', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'धक्का', word2: 'हुआ' }, { word1: 'लगा', word2: 'पक्का' }],
    notes: 'Internal pair धक्का ↔ पक्का'
  },
  {
    id: 'ir-095',
    text: 'कच्चा था वो खिलाड़ी सच्चा निकला दोस्त',
    expectedPairs: [{ word1: 'कच्चा', word2: 'सच्चा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'कच्चा', word2: 'दोस्त' }, { word1: 'खिलाड़ी', word2: 'सच्चा' }],
    notes: 'Internal pair कच्चा ↔ सच्चा'
  },
  {
    id: 'ir-096',
    text: 'सच्चा इंसान था बच्चा बन के रहा',
    expectedPairs: [{ word1: 'सच्चा', word2: 'बच्चा', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'सच्चा', word2: 'रहा' }, { word1: 'इंसान', word2: 'बच्चा' }],
    notes: 'Internal pair सच्चा ↔ बच्चा'
  },
  {
    id: 'ir-097',
    text: 'नोट गिने बहुत पर वोट मिला नहीं',
    expectedPairs: [{ word1: 'नोट', word2: 'वोट', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'नोट', word2: 'नहीं' }, { word1: 'गिने', word2: 'वोट' }],
    notes: 'Internal pair नोट ↔ वोट'
  },
  {
    id: 'ir-098',
    text: 'चोट लगी गहरी ओट में छुप गया',
    expectedPairs: [{ word1: 'चोट', word2: 'ओट', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'चोट', word2: 'गया' }, { word1: 'गहरी', word2: 'ओट' }],
    notes: 'Internal pair चोट ↔ ओट'
  },
  {
    id: 'ir-099',
    text: 'ताला लगा था प्याला टूट गया फर्श पे',
    expectedPairs: [{ word1: 'ताला', word2: 'प्याला', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'ताला', word2: 'पे' }, { word1: 'लगा', word2: 'प्याला' }],
    notes: 'Internal pair ताला ↔ प्याला'
  },
  {
    id: 'ir-100',
    text: 'उजाला हुआ जब निराला समां दिखा',
    expectedPairs: [{ word1: 'उजाला', word2: 'निराला', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'उजाला', word2: 'दिखा' }, { word1: 'हुआ', word2: 'निराला' }],
    notes: 'Internal pair उजाला ↔ निराला'
  },
  {
    id: 'ir-101',
    text: 'दिवाला निकला जब मसाला खत्म हुआ',
    expectedPairs: [{ word1: 'दिवाला', word2: 'मसाला', expectedTier: 'MULTISYLLABIC' }],
    rejectedPairs: [{ word1: 'दिवाला', word2: 'हुआ' }, { word1: 'निकला', word2: 'मसाला' }],
    notes: 'Internal pair दिवाला ↔ मसाला'
  },
  {
    id: 'ir-102',
    text: 'चाँद निकला तो मांद में छुप गया शेर',
    expectedPairs: [{ word1: 'चाँद', word2: 'मांद', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'चाँद', word2: 'शेर' }, { word1: 'निकला', word2: 'मांद' }],
    notes: 'Internal pair चाँद ↔ मांद'
  },
  {
    id: 'ir-103',
    text: 'बादल घिरे जब काजल फैल गया',
    expectedPairs: [{ word1: 'बादल', word2: 'काजल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'बादल', word2: 'गया' }, { word1: 'घिरे', word2: 'काजल' }],
    notes: 'Internal pair बादल ↔ काजल'
  },
  {
    id: 'ir-104',
    text: 'घायल हुआ परिंदा क़ायल हुआ शिकारी',
    expectedPairs: [{ word1: 'घायल', word2: 'क़ायल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'घायल', word2: 'शिकारी' }, { word1: 'परिंदा', word2: 'क़ायल' }],
    notes: 'Internal pair घायल ↔ क़ायल'
  },
  {
    id: 'ir-105',
    text: 'जंगल में जब दंगल शुरू हुआ',
    expectedPairs: [{ word1: 'जंगल', word2: 'दंगल', expectedTier: 'PERFECT' }],
    rejectedPairs: [{ word1: 'जंगल', word2: 'हुआ' }, { word1: 'में', word2: 'दंगल' }],
    notes: 'Internal pair जंगल ↔ दंगल'
  }
];
