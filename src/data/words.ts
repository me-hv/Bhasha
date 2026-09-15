import { WordEntry } from '../types';

export const WORDS_DATABASE: WordEntry[] = [
  // ==========================================
  // 1. NIGHT, STREET & STRUGGLE (AAT / AATH)
  // ==========================================
  {
    id: 'raat',
    devanagari: 'रात',
    roman: 'raat',
    aliases: ['raat', 'rat', 'raath', 'rāt'],
    pronunciation: '/raːt/',
    meaning: 'Night, darkness, the midnight hour of reflection & hustle',
    hindiMeaning: 'रात्रि, निशा, शब',
    origin: 'Hindustani',
    moods: ['Dark', 'Melancholic', 'Night', 'Introspective', 'Street'],
    category: ['CITY', 'STREET', 'LIFE', 'EMOTION'],
    syllables: 1,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪', rhymeEnding: 'ात', syllables: 1 },
    perfectRhymes: ['बात', 'साथ', 'हाथ', 'मात', 'घात', 'पात', 'जात', 'लात', 'तात'],
    strongRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'औकात', 'करामात', 'आयात', 'खैरात', 'नफ़ासात'],
    nearRhymes: ['याद', 'आग', 'राह', 'ख़्वाब', 'साज़', 'आवाज़', 'साद', 'बाज़', 'सांस'],
    cadenceRhymes: ['काली रात', 'आखरी बात', 'अपने हाथ', 'सख्त हालात', 'सच्चे जज़्बात'],
    multiSyllableRhymes: [
      { phraseOrWord: 'काली ये रातें', score: 0.95, syllables: 4, type: 'phrase' },
      { phraseOrWord: 'बदले हालात', score: 0.92, syllables: 4, type: 'phrase' },
      { phraseOrWord: 'आँखों में रात', score: 0.94, syllables: 4, type: 'phrase' }
    ],
    synonyms: ['रात्रि', 'रजनी', 'निशा', 'शब', 'अंधेरा'],
    antonyms: ['दिन', 'सवेरा', 'उजाला', 'धूप', 'सुबह'],
    relatedImagery: ['अंधेरा', 'चाँद', 'नींद', 'सन्नाटा', 'शहर', 'तन्हाई', 'सड़कें', 'स्ट्रीट लाइट', 'तारे'],
    relatedGraph: {
      visual: ['अंधेरा', 'चाँद', 'तारे', 'स्ट्रीट लाइट', 'काली सड़कें'],
      emotion: ['तन्हाई', 'खालीपन', 'सन्नाटा', 'भूख', 'जुनून'],
      sound: ['खामोशी', 'सायरन', 'कुत्तों का भौंकना', 'घड़ी की टिक-टिक'],
      place: ['कमरा', 'छत', 'सड़क', 'स्टूडियो'],
      general: ['नींद', 'ख्वाब', 'सिगरेट', 'चाय']
    },
    sampleBars: [
      'रात में जागता, सवाल मेरे साथ / शहर सो रहा लेकिन आँखों में रात',
      'काली ये रातें और गहरी ये बातें / जेबें थीं खाली पर भरे थे इरादे'
    ]
  },
  {
    id: 'baat',
    devanagari: 'बात',
    roman: 'baat',
    aliases: ['baat', 'bat', 'baath', 'bāt'],
    pronunciation: '/baːt/',
    meaning: 'Word, conversation, statement, truth, speech',
    hindiMeaning: 'वचन, कथन, किस्सा',
    origin: 'Hindustani',
    moods: ['Real Talk', 'Street', 'Direct', 'Hardcore'],
    category: ['RAP', 'STREET', 'LIFE'],
    syllables: 1,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪', rhymeEnding: 'ात', syllables: 1 },
    perfectRhymes: ['रात', 'साथ', 'हाथ', 'मात', 'घात', 'जात', 'पात'],
    strongRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'औकात', 'करामात'],
    nearRhymes: ['याद', 'साज़', 'आवाज़', 'दाग', 'बाप'],
    cadenceRhymes: ['खरी बात', 'सीधी बात', 'दिल की बात', 'गहरी बात'],
    synonyms: ['कथन', 'वचन', 'वार्ता', 'बयान', 'गुफ़्तगू'],
    relatedImagery: ['ज़बान', 'लफ्ज़', 'माइक', 'सच्चाई', 'शोर', 'अल्फाज़'],
    relatedGraph: {
      visual: ['माइक', 'कलम', 'कागज़'],
      emotion: ['सच्चाई', 'गुस्सा', 'गरूर'],
      sound: ['गूंज', 'आवाज़', 'शोर'],
      place: ['स्टेज', 'सड़क', 'महफ़िल'],
      general: ['लफ्ज़', 'बयान', 'अल्फाज़']
    },
    sampleBars: [
      'मुंह पे जो बात है वही पीठ पीछे / सच बोलूं इसलिए सब आँखें नीचे',
      'लफ्जों में बारूद और बातों में वजन / कलम चले मेरी जैसे कांपे ये वतन'
    ]
  },
  {
    id: 'saath',
    devanagari: 'साथ',
    roman: 'saath',
    aliases: ['saath', 'sath', 'saat', 'sāth'],
    pronunciation: '/saːtʰ/',
    meaning: 'Together, companionship, loyalty, presence',
    hindiMeaning: 'संग, संगति, हमराही',
    origin: 'Hindustani',
    moods: ['Loyalty', 'Brotherhood', 'Love', 'Loneliness'],
    category: ['LIFE', 'EMOTION', 'LOVE'],
    syllables: 1,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪ʰ', rhymeEnding: 'ाथ', syllables: 1 },
    perfectRhymes: ['रात', 'बात', 'हाथ', 'मात', 'घात'],
    strongRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'औकात'],
    nearRhymes: ['सांस', 'आस', 'पास', 'याद', 'साज'],
    cadenceRhymes: ['तेरा साथ', 'सच्चा साथ', 'मुश्किल हालात', 'छूटे हाथ'],
    synonyms: ['संग', 'हमकदम', 'यारी', 'समीप'],
    antonyms: ['अकेला', 'जुदाई', 'दूरी'],
    relatedImagery: ['दोस्त', 'सफ़र', 'रास्ता', 'यारी', 'साया', 'साझेदार'],
    relatedGraph: {
      visual: ['हाथ मिलाना', 'कंधा', 'साया'],
      emotion: ['वफ़ा', 'विश्वास', 'तन्हाई'],
      place: ['सफ़र', 'रास्ता', 'चाय की टपरी'],
      general: ['दोस्ती', 'भाईचारा', 'हमसफ़र']
    },
    sampleBars: [
      'जो खड़े थे साथ जब कुछ भी नहीं था / आज जीत में भी उनका ही हक बनता'
    ]
  },
  {
    id: 'haath',
    devanagari: 'हाथ',
    roman: 'haath',
    aliases: ['haath', 'hath', 'haat', 'hāth'],
    pronunciation: '/haːtʰ/',
    meaning: 'Hands, power, destiny, struggle, craftsmanship',
    hindiMeaning: 'कर, हस्त, पंजा',
    origin: 'Hindustani',
    moods: ['Hustle', 'Aggressive', 'Action', 'Power'],
    category: ['AMBITION', 'RAP', 'STREET'],
    syllables: 1,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪ʰ', rhymeEnding: 'ाथ', syllables: 1 },
    perfectRhymes: ['रात', 'बात', 'साथ', 'मात', 'घात'],
    strongRhymes: ['जज़्बात', 'हालात', 'बरसात', 'औकात'],
    nearRhymes: ['आग', 'भाग', 'मांग', 'ताकत'],
    cadenceRhymes: ['अपने हाथ', 'खाली हाथ', 'कलम हाथ में'],
    synonyms: ['कर', 'हस्त', 'पंजा'],
    relatedImagery: ['लकीरें', 'कलम', 'मेहनत', 'मुक्का', 'खून-पसीना'],
    relatedGraph: {
      visual: ['लकीरें', 'छाले', 'मुक्का', 'कलम'],
      emotion: ['ताकत', 'मेहनत', 'हौसला'],
      general: ['खून-पसीना', 'कारीगरी', 'किस्मत']
    },
    sampleBars: [
      'किस्मत की लकीरें खुद हाथों से खींची / सर था उठाया जब दुनिया ने नीची'
    ]
  },
  {
    id: 'jazbaat',
    devanagari: 'जज़्बात',
    roman: 'jazbaat',
    aliases: ['jazbaat', 'jazbat', 'jazbaath', 'zazbaat', 'zajbaat'],
    pronunciation: '/d͡ʒəzˈbaːt/',
    meaning: 'Emotions, raw passions, inner feelings',
    hindiMeaning: 'भावनाएं, अनुभूतियां, मनोवेग',
    origin: 'Urdu',
    moods: ['Emotional', 'Melancholic', 'Deep', 'Vulnerable'],
    category: ['EMOTION', 'LOVE', 'PAIN'],
    syllables: 2,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪', rhymeEnding: 'ात', syllables: 2 },
    perfectRhymes: ['हालात', 'बरसात', 'मुलाक़ात', 'औकात', 'करामात', 'खैरात'],
    strongRhymes: ['रात', 'बात', 'साथ', 'हाथ', 'मात'],
    nearRhymes: ['अहसास', 'विश्वास', 'दर्द', 'साज़'],
    cadenceRhymes: ['सच्चे जज़्बात', 'दबे जज़्बात', 'बिखरे जज़्बात'],
    synonyms: ['भावनाएं', 'अहसास', 'उमंग', 'अरमान'],
    relatedImagery: ['आँसू', 'दिल', 'दर्द', 'तन्हाई', 'चीख', 'सीने की आग'],
    relatedGraph: {
      visual: ['आँसू', 'कागज़', 'कलम', 'टूटा शीशा'],
      emotion: ['प्यार', 'दर्द', 'जुनून', 'तड़प'],
      sound: ['चीख', 'धड़कन', 'सन्नाटा'],
      place: ['कमरा', 'डायरी']
    },
    sampleBars: [
      'कागज़ पे बहा दिए दिल के जज़्बात / जब सुनने वाला कोई ना था रात'
    ]
  },
  {
    id: 'haalaat',
    devanagari: 'हालात',
    roman: 'haalaat',
    aliases: ['haalaat', 'halat', 'halaat', 'halaath', 'hālāt'],
    pronunciation: '/ɦaːˈlaːt/',
    meaning: 'Circumstances, conditions, struggle, state of life',
    hindiMeaning: 'परिस्थितियां, दशा, स्थिति',
    origin: 'Urdu',
    moods: ['Struggle', 'Dark', 'Street', 'Real Talk'],
    category: ['LIFE', 'STREET', 'PAIN'],
    syllables: 2,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪', rhymeEnding: 'ात', syllables: 2 },
    perfectRhymes: ['जज़्बात', 'बरसात', 'मुलाक़ात', 'औकात', 'करामात'],
    strongRhymes: ['रात', 'बात', 'साथ', 'हाथ', 'मात'],
    nearRhymes: ['वक़्त', 'जंग', 'हाला', 'मंज़र'],
    cadenceRhymes: ['सख्त हालात', 'बुरे हालात', 'बदलते हालात'],
    synonyms: ['परिस्थिति', 'दशा', 'मजबूरी', 'स्थिति'],
    relatedImagery: ['गरीबी', 'मजबूरी', 'कमरा', 'सड़क', 'परिवार', 'किराया'],
    relatedGraph: {
      visual: ['खाली जेब', 'छत से टपकता पानी', 'टूटी दीवार'],
      emotion: ['मजबूरी', 'गुस्सा', 'सब्र', 'हौसला'],
      place: ['बस्ती', 'गली', 'किराए का कमरा']
    },
    sampleBars: [
      'हालात ने सिखाया मुझे झुकना नहीं / थक जाऊं जितना भी रुकना नहीं'
    ]
  },
  {
    id: 'auqaat',
    devanagari: 'औकात',
    roman: 'auqaat',
    aliases: ['auqaat', 'aukat', 'aokat', 'oukat', 'aukāt'],
    pronunciation: '/ɔːˈqaːt/',
    meaning: 'Status, capability, standing, humble roots vs greatness',
    hindiMeaning: 'हैसियत, सामर्थ्य, बिसात',
    origin: 'Urdu',
    moods: ['Aggressive', 'Hustle', 'Pride', 'Hardcore'],
    category: ['AMBITION', 'RAP', 'STREET'],
    syllables: 2,
    coda: 'aat',
    phoneticKey: { nucleus: 'aː', coda: 't̪', rhymeEnding: 'ात', syllables: 2 },
    perfectRhymes: ['जज़्बात', 'हालात', 'बरसात', 'मुलाक़ात', 'मात'],
    strongRhymes: ['रात', 'बात', 'साथ', 'हाथ'],
    nearRhymes: ['ताकत', 'हिम्मत', 'किस्मत'],
    cadenceRhymes: ['तेरी औकात', 'मेरी औकात', 'दिखा दी औकात'],
    synonyms: ['हैसियत', 'बिसात', 'वजूद', 'मर्तबा'],
    relatedImagery: ['रूतबा', 'अमीरी', 'गरीबी', 'पैसा', 'तख्तो-ताज'],
    sampleBars: [
      'जो पूछते थे कल तक मेरी औकात क्या / आज उनके घर में मेरी ही बात है'
    ]
  },

  // ==========================================
  // 2. EMOTION, HEART & LOVE (IL / ILS)
  // ==========================================
  {
    id: 'dil',
    devanagari: 'दिल',
    roman: 'dil',
    aliases: ['dil', 'dill', 'deel'],
    pronunciation: '/d̪ɪl/',
    meaning: 'Heart, soul, conscience, core of emotions',
    hindiMeaning: 'हृदय, मन, जी',
    origin: 'Hindustani',
    moods: ['Love', 'Emotional', 'Vulnerable', 'Melancholic'],
    category: ['EMOTION', 'LOVE', 'PAIN'],
    syllables: 1,
    coda: 'il',
    phoneticKey: { nucleus: 'ɪ', coda: 'l', rhymeEnding: 'िल', syllables: 1 },
    perfectRhymes: ['मिल', 'खिल', 'हिल', 'सिल', 'तिल', 'बिल', 'झिल'],
    strongRhymes: ['मंज़िल', 'महफ़िल', 'क़ातिल', 'मुश्किल', 'साहिल', 'क़ाबिल', 'बातिल', 'शामिल'],
    nearRhymes: ['दिन', 'गिन', 'सिर', 'धड़कन', 'दर्द', 'चीर'],
    cadenceRhymes: ['टूटा ये दिल', 'सच्चा दिल', 'पागल दिल', 'सीने में दिल'],
    synonyms: ['हृदय', 'मन', 'कलेजा', 'अंतर्मन', 'क़ल्ब'],
    relatedImagery: ['धड़कन', 'सीने का दर्द', 'मोहब्बत', 'ज़ख्म', 'तस्वीर', 'कांच'],
    relatedGraph: {
      visual: ['कांच', 'तस्वीर', 'धड़कती नब्ज़'],
      emotion: ['मोहब्बत', 'उदासी', 'दर्द', 'सुकून'],
      sound: ['धड़कन', 'सन्नाटा', 'चीख'],
      place: ['सीने के अंदर', 'कमरा']
    },
    sampleBars: [
      'सीने में दिल नहीं धड़कता ये अंगार है / हर एक जख्म मेरी कलम का हथियार है',
      'दिल से जो निकली वो बात अमर है / शहर में अब बस मेरा ही कहर है'
    ]
  },
  {
    id: 'manzil',
    devanagari: 'मंज़िल',
    roman: 'manzil',
    aliases: ['manzil', 'manzeel', 'manjil'],
    pronunciation: '/mənˈzɪl/',
    meaning: 'Destination, goal, final peak, dream objective',
    hindiMeaning: 'लक्ष्य, गंतव्य, ठिकाना',
    origin: 'Urdu',
    moods: ['Ambition', 'Hustle', 'Success', 'Inspirational'],
    category: ['AMBITION', 'LIFE'],
    syllables: 2,
    coda: 'il',
    phoneticKey: { nucleus: 'ɪ', coda: 'l', rhymeEnding: 'िल', syllables: 2 },
    perfectRhymes: ['महफ़िल', 'क़ातिल', 'मुश्किल', 'साहिल', 'क़ाबिल', 'शामिल', 'बातिल'],
    strongRhymes: ['दिल', 'मिल', 'खिल', 'हिल'],
    nearRhymes: ['सफ़र', 'रास्ता', 'मुक़द्दर', 'शिखर', 'हासिल'],
    cadenceRhymes: ['मेरी मंज़िल', 'दूर मंज़िल', 'रास्ता और मंज़िल', 'पा ली मंज़िल'],
    synonyms: ['लक्ष्य', 'ठिकाना', 'मुकाम', 'गंतव्य'],
    relatedImagery: ['पहाड़', 'रास्ता', 'पैरों के छाले', 'सूरज', 'ताज', 'शिखर'],
    sampleBars: [
      'मंज़िल पुकारे मुझे रास्तों का डर नहीं / जब तक ना जीतूं मुझे कोई सब्र नहीं'
    ]
  },
  {
    id: 'mushkil',
    devanagari: 'मुश्किल',
    roman: 'mushkil',
    aliases: ['mushkil', 'mushkeel', 'muskil'],
    pronunciation: '/mʊʃˈkɪl/',
    meaning: 'Difficult, adversity, tough trial, hard road',
    hindiMeaning: 'कठिन, दुश्वार, बाधा',
    origin: 'Urdu',
    moods: ['Struggle', 'Pain', 'Grit', 'Real Talk'],
    category: ['LIFE', 'PAIN', 'STREET'],
    syllables: 2,
    coda: 'il',
    phoneticKey: { nucleus: 'ɪ', coda: 'l', rhymeEnding: 'िल', syllables: 2 },
    perfectRhymes: ['मंज़िल', 'महफ़िल', 'क़ातिल', 'साहिल', 'क़ाबिल', 'शामिल'],
    strongRhymes: ['दिल', 'मिल'],
    nearRhymes: ['कठिन', 'संकट', 'भारी', 'जंग'],
    cadenceRhymes: ['रास्ते मुश्किल', 'वक्त बड़ा मुश्किल', 'जीना मुश्किल'],
    synonyms: ['कठिन', 'दुश्वार', 'पेचीदा', 'जटिल'],
    antonyms: ['आसान', 'सरल', 'सहज'],
    relatedImagery: ['कांटे', 'तूफान', 'दीवार', 'पहाड़', 'रुकावट'],
    sampleBars: [
      'माना कि राहें ये बेहद हैं मुश्किल / पर सीने में ठाना तो कदमों में मंज़िल'
    ]
  },

  // ==========================================
  // 3. LOVE, BROTHERHOOD & WEAPONS (AAR)
  // ==========================================
  {
    id: 'pyaar',
    devanagari: 'प्यार',
    roman: 'pyaar',
    aliases: ['pyaar', 'pyar', 'piyaar', 'pyār'],
    pronunciation: '/pjaːr/',
    meaning: 'Love, affection, emotional bond, infatuation',
    hindiMeaning: 'प्रेम, स्नेह, अनुराग, इश्क',
    origin: 'Hindustani',
    moods: ['Love', 'Heartbreak', 'Emotional', 'Vulnerable'],
    category: ['LOVE', 'EMOTION', 'PAIN'],
    syllables: 1,
    coda: 'aar',
    phoneticKey: { nucleus: 'aː', coda: 'r', rhymeEnding: 'ार', syllables: 1 },
    perfectRhymes: ['यार', 'वार', 'पार', 'हार', 'तार', 'कार', 'धार', 'मार', 'चार', 'सार', 'खार'],
    strongRhymes: ['हथियार', 'संसार', 'दीवार', 'इंकार', 'इकरार', 'सरकार', 'दरबार', 'अंगार', 'व्यापार', 'ख़ुमार', 'इंतज़ार'],
    nearRhymes: ['दर्द', 'आग', 'याद', 'रात', 'पास', 'ख्वाब', 'आस'],
    cadenceRhymes: ['पहला प्यार', 'झूठा प्यार', 'तेरा प्यार', 'सच्चा प्यार', 'प्यार का वार'],
    synonyms: ['प्रेम', 'इश्क', 'मोहब्बत', 'अनुराग', 'चाहत', 'उल्फत'],
    antonyms: ['नफ़रत', 'दुश्मनी', 'घृणा'],
    relatedImagery: ['आँखें', 'गुलाब', 'तस्वीर', 'खत', 'दिल', 'मुस्कान', 'जुदाई'],
    sampleBars: [
      'प्यार में हारा तो लफ्ज़ बने हथियार / अब गीतों में बिकता है मेरा ये दिल-ए-ज़ार',
      'झूठे थे वादे और झूठा वो प्यार / अब तन्हाई मेरी पक्की है यार'
    ]
  },
  {
    id: 'yaar',
    devanagari: 'यार',
    roman: 'yaar',
    aliases: ['yaar', 'yar', 'yār'],
    pronunciation: '/jaːr/',
    meaning: 'Friend, brother, homie, companion, beloved',
    hindiMeaning: 'मित्र, सखा, दोस्त, हमदम',
    origin: 'Hindustani',
    moods: ['Brotherhood', 'Street', 'Loyalty', 'Real Talk'],
    category: ['STREET', 'LIFE', 'LOVE'],
    syllables: 1,
    coda: 'aar',
    phoneticKey: { nucleus: 'aː', coda: 'r', rhymeEnding: 'ार', syllables: 1 },
    perfectRhymes: ['प्यार', 'वार', 'पार', 'हार', 'तार', 'धार', 'मार', 'चार'],
    strongRhymes: ['हथियार', 'संसार', 'दीवार', 'इंकार', 'इकरार', 'सरकार', 'अंगार', 'इंतज़ार'],
    nearRhymes: ['साथ', 'भाई', 'दोस्त', 'खास'],
    cadenceRhymes: ['मेरे यार', 'सच्चे यार', 'गद्दार यार', 'पुराने यार'],
    synonyms: ['दोस्त', 'मित्र', 'सखा', 'भाई', 'हमदम'],
    relatedImagery: ['सड़क', 'चाय की टपरी', 'गैंग', 'काफिला', 'हाथ मिलाना'],
    sampleBars: [
      'गिनती के यार मेरे लाखों के बराबर / पीठ पीछे भोंकने वालों पे न मेरी नज़र'
    ]
  },
  {
    id: 'hathiyaar',
    devanagari: 'हथियार',
    roman: 'hathiyaar',
    aliases: ['hathiyaar', 'hathiyar', 'hatiyaar'],
    pronunciation: '/ɦə.tʰɪˈjaːr/',
    meaning: 'Weapon, instrument of defense/attack, rap pen/flow',
    hindiMeaning: 'शस्त्र, अस्त्र, औजार',
    origin: 'Hindustani',
    moods: ['Aggressive', 'Hardcore', 'Battle', 'Street'],
    category: ['RAP', 'AMBITION', 'STREET'],
    syllables: 3,
    coda: 'aar',
    phoneticKey: { nucleus: 'aː', coda: 'r', rhymeEnding: 'ार', syllables: 3 },
    perfectRhymes: ['इंतज़ार', 'दीवार', 'संसार', 'इंकार', 'इकरार', 'सरकार', 'दरबार', 'अंगार'],
    strongRhymes: ['प्यार', 'यार', 'वार', 'हार', 'धार'],
    nearRhymes: ['ताकत', 'कलम', 'बारूद', 'वार'],
    cadenceRhymes: ['कलम हथियार', 'तेज हथियार', 'सच्चा हथियार'],
    synonyms: ['शस्त्र', 'अस्त्र', 'औजार'],
    relatedImagery: ['कलम', 'माइक', 'धार', 'गोली', 'लोहा', 'ढाल'],
    sampleBars: [
      'कलम मेरी बंदूक और लफ़्ज़ ये हथियार / जब भी मैं लिखता हूँ कांपे संसार'
    ]
  },
  {
    id: 'angaar',
    devanagari: 'अंगार',
    roman: 'angaar',
    aliases: ['angaar', 'angar'],
    pronunciation: '/əŋˈɡaːr/',
    meaning: 'Burning ember, blazing fire, fiery flow, wrath',
    hindiMeaning: 'दहकता कोयला, ज्वाला, शोला',
    origin: 'Hindustani',
    moods: ['Aggressive', 'Fire', 'Energy', 'Raw'],
    category: ['RAP', 'AMBITION'],
    syllables: 2,
    coda: 'aar',
    phoneticKey: { nucleus: 'aː', coda: 'r', rhymeEnding: 'ार', syllables: 2 },
    perfectRhymes: ['हथियार', 'दीवार', 'संसार', 'इंकार', 'इकरार', 'सरकार', 'दरबार', 'इंतज़ार'],
    strongRhymes: ['प्यार', 'यार', 'वार', 'धार', 'मार'],
    nearRhymes: ['आग', 'शोला', 'लपट', 'जलन'],
    cadenceRhymes: ['दहकते अंगार', 'सीने में अंगार', 'लफ्ज़ अंगार'],
    synonyms: ['शोला', 'चिनगारी', 'अग्निकण'],
    relatedImagery: ['आग', 'राख', 'धुआं', 'सीने की तपन'],
    sampleBars: [
      'पैरों तले अंगार थे फिर भी नहीं रुका / सर था खुदा के सामने दुनिया पे ना झुका'
    ]
  },

  // ==========================================
  // 4. PAIN, ANGUISH & HEALING (ARD)
  // ==========================================
  {
    id: 'dard',
    devanagari: 'दर्द',
    roman: 'dard',
    aliases: ['dard', 'durad'],
    pronunciation: '/d̪ərd̪/',
    meaning: 'Pain, agony, anguish, suffering transformed to art',
    hindiMeaning: 'पीड़ा, व्यथा, टीस, रंज',
    origin: 'Hindustani',
    moods: ['Pain', 'Melancholic', 'Vulnerable', 'Deep', 'Struggle'],
    category: ['PAIN', 'EMOTION', 'LIFE'],
    syllables: 1,
    coda: 'ard',
    phoneticKey: { nucleus: 'ə', coda: 'rd̪', rhymeEnding: 'र्द', syllables: 1 },
    perfectRhymes: ['फ़र्द', 'गर्द', 'ज़र्द', 'सर्द'],
    strongRhymes: ['बेदर्द', 'हमदर्द', 'शागिर्द'],
    nearRhymes: ['ज़ख्म', 'आँसू', 'आग', 'रात', 'मर्ज', 'तड़प', 'सख्त'],
    cadenceRhymes: ['मीठा दर्द', 'सीने का दर्द', 'पुराना दर्द', 'बेदर्द जमाना'],
    synonyms: ['पीड़ा', 'व्यथा', 'कष्ट', 'अफ़सोस', 'रंज'],
    antonyms: ['सुकून', 'राहत', 'खुशी', 'चैन'],
    relatedImagery: ['आँसू', 'ज़ख्म', 'टूटा दिल', 'अकेलापन', 'काली रातें', 'चीखें'],
    sampleBars: [
      'दर्द को स्याही बना के पन्नों पे उकेरा / अँधेरे में ही छुपा था कल का नया सवेरा',
      'जितना दिया दर्द उतना ही मजबूत हुआ / जो कल तक था अनजान आज वो मशहूर हुआ'
    ]
  },
  {
    id: 'hamdard',
    devanagari: 'हमदर्द',
    roman: 'hamdard',
    aliases: ['hamdard', 'humdard'],
    pronunciation: '/ɦəmˈd̪ərd̪/',
    meaning: 'Sympathizer, empathetic partner, someone who shares your pain',
    hindiMeaning: 'सहानुभूतिक, साथी, सुख-दुख का साथी',
    origin: 'Urdu',
    moods: ['Vulnerable', 'Emotional', 'Reflection'],
    category: ['EMOTION', 'PAIN', 'LOVE'],
    syllables: 2,
    coda: 'ard',
    phoneticKey: { nucleus: 'ə', coda: 'rd̪', rhymeEnding: 'र्द', syllables: 2 },
    perfectRhymes: ['बेदर्द', 'शागिर्द', 'ज़र्द', 'सर्द', 'गर्द'],
    strongRhymes: ['दर्द', 'फ़र्द'],
    nearRhymes: ['दोस्त', 'राहत', 'सुकून', 'साया'],
    cadenceRhymes: ['कोई हमदर्द', 'झूठा हमदर्द', 'मेरा हमदर्द'],
    synonyms: ['सहानुभूतिक', 'हमसाया', 'हितैषी'],
    relatedImagery: ['मल्हम', 'कंधा', 'आँसू पोंछना', 'दवा'],
    sampleBars: [
      'ढूंढता रहा हमदर्द इस मतलबी शहर में / हर कोई मिला यहाँ जहर लिए नजर में'
    ]
  },

  // ==========================================
  // 5. CITY, CONCRETE & JOURNEY (AHAR / ASAR)
  // ==========================================
  {
    id: 'shehar',
    devanagari: 'शहर',
    roman: 'shehar',
    aliases: ['shehar', 'shahar', 'shohar', 'sehar'],
    pronunciation: '/ʃɛˈɦər/',
    meaning: 'City, concrete jungle, metropolitan coldness & ambition',
    hindiMeaning: 'नगर, पुर, कस्बा',
    origin: 'Hindustani',
    moods: ['City', 'Street', 'Dark', 'Real Talk'],
    category: ['CITY', 'STREET', 'LIFE'],
    syllables: 2,
    coda: 'ahar',
    phoneticKey: { nucleus: 'ɛ', coda: 'r', rhymeEnding: 'हर', syllables: 2 },
    perfectRhymes: ['सफ़र', 'असर', 'ज़हर', 'मंज़र', 'कहर', 'लहर', 'बहर', 'दहर'],
    strongRhymes: ['खबर', 'नज़र', 'जिगर', 'सबर', 'कब्र', 'हुनर', 'उम्र'],
    nearRhymes: ['सड़क', 'भीड़', 'मकान', 'दौड़', 'रात'],
    cadenceRhymes: ['अंधेरा शहर', 'बेदर्द शहर', 'बड़ा ये शहर', 'रात का शहर'],
    synonyms: ['नगर', 'नगरी', 'महानगर', 'बस्ती'],
    antonyms: ['गांव', 'देहात', 'जंगल'],
    relatedImagery: ['सड़कें', 'ट्रैफिक', 'कंक्रीट', 'स्ट्रीट लाइट', 'बिल्डिंग्स', 'भीड़', 'धुआं', 'लोकल ट्रेन'],
    relatedGraph: {
      visual: ['कंक्रीट', 'स्ट्रीट लाइट', 'लोकल ट्रेन', 'ऊंची इमारतें', 'धुआं'],
      emotion: ['अकेलापन', 'दौड़', 'भूख', 'सख्त दिल'],
      sound: ['सायरन', 'हॉर्न', 'ट्रेन की गड़गड़ाहट', 'भीड़ का शोर'],
      place: ['स्टेशन', 'फ्लाईओवर', 'चौराहा', 'गली', 'छत']
    },
    sampleBars: [
      'ये शहर कंक्रीट का यहाँ कोई दिल नहीं / दौड़ रहे सब अंधी राहों में कोई मंज़िल नहीं',
      'शहर की सड़कों पे सीखे हमने जिंदगी के कायदे / यहाँ हर कोई तौलता है रिश्तों में भी फायदे'
    ]
  },
  {
    id: 'safar',
    devanagari: 'सफ़र',
    roman: 'safar',
    aliases: ['safar', 'suffar'],
    pronunciation: '/səˈfər/',
    meaning: 'Journey, voyage, the endless hustle and poetic travel',
    hindiMeaning: 'यात्रा, गमन, मुसाफ़िरी',
    origin: 'Hindustani',
    moods: ['Inspirational', 'Hustle', 'Ambition', 'Philosophy'],
    category: ['LIFE', 'AMBITION'],
    syllables: 2,
    coda: 'ahar',
    phoneticKey: { nucleus: 'ə', coda: 'r', rhymeEnding: 'र', syllables: 2 },
    perfectRhymes: ['शहर', 'असर', 'ज़हर', 'मंज़र', 'कहर', 'लहर', 'बहर'],
    strongRhymes: ['खबर', 'नज़र', 'जिगर', 'सबर', 'हुनर', 'उम्र'],
    nearRhymes: ['रास्ता', 'कदम', 'मुसाफिर', 'मंज़िल'],
    cadenceRhymes: ['लंबा सफ़र', 'तन्हा सफ़र', 'जिंदगी का सफ़र'],
    synonyms: ['यात्रा', 'मुसाफ़िरी', 'कूच', 'डगर'],
    relatedImagery: ['जूते', 'ट्रेन', 'पगडंडी', 'धूल', 'रास्ता', 'बैग'],
    sampleBars: [
      'सफ़र ये लंबा था अकेले ही तय किया / डर को हरा के मैंने ख्वाबों को बयां किया'
    ]
  },
  {
    id: 'baarish',
    devanagari: 'बारिश',
    roman: 'baarish',
    aliases: ['baarish', 'barish', 'bārish'],
    pronunciation: '/baːˈrɪʃ/',
    meaning: 'Rain, downpour, cathartic tears from the sky, monsoon nostalgia',
    hindiMeaning: 'वर्षा, बरसात, मेहा',
    origin: 'Hindustani',
    moods: ['Melancholic', 'Nostalgic', 'Atmospheric', 'Romantic'],
    category: ['CITY', 'EMOTION', 'LIFE'],
    syllables: 2,
    coda: 'ish',
    phoneticKey: { nucleus: 'ɪ', coda: 'ʃ', rhymeEnding: 'िश', syllables: 2 },
    perfectRhymes: ['साज़िश', 'ख्वाहिश', 'गुज़ारिश', 'फ़रमाइश', 'पैदाइश', 'आसाइश'],
    strongRhymes: ['बरसात', 'बूंदें'],
    nearRhymes: ['पानी', 'आँसू', 'मौसम', 'बादल'],
    cadenceRhymes: ['तेज बारिश', 'भीगी बारिश', 'यादों की बारिश'],
    synonyms: ['वर्षा', 'बरसात', 'मेघा', 'बारान'],
    relatedImagery: ['बादल', 'बूंद', 'छत', 'खिड़की', 'मिट्टी की खुशबू', 'काली सड़कें'],
    relatedGraph: {
      visual: ['बादल', 'बूंद', 'छत', 'सड़क', 'खिड़की', 'गीली मिट्टी'],
      emotion: ['याद', 'तन्हाई', 'इंतज़ार', 'उदासी', 'सुकून'],
      sound: ['गरज', 'टप-टप', 'बिजली', 'हवा की सनसनाहट'],
      place: ['गली', 'कमरा', 'शहर', 'बस स्टॉप']
    },
    sampleBars: [
      'बारिश की बूंदों में छुपा लिए अपने आँसू / दुनिया को लगता है कि मौसम का मज़ा लूँ'
    ]
  },

  // ==========================================
  // 6. DREAMS, RECKONING & AMBITION (AAB)
  // ==========================================
  {
    id: 'khwaab',
    devanagari: 'ख्वाब',
    roman: 'khwaab',
    aliases: ['khwaab', 'khwab', 'khwaap', 'khwāb'],
    pronunciation: '/xʋaːb/',
    meaning: 'Dream, vision, nocturnal aspiration, unfulfilled hope',
    hindiMeaning: 'सपना, स्वपन, अरमान',
    origin: 'Urdu',
    moods: ['Ambition', 'Inspirational', 'Melancholic', 'Vision'],
    category: ['AMBITION', 'EMOTION', 'LIFE'],
    syllables: 1,
    coda: 'aab',
    phoneticKey: { nucleus: 'aː', coda: 'b', rhymeEnding: 'ाब', syllables: 1 },
    perfectRhymes: ['जवाब', 'नवाब', 'हिसाब', 'किताब', 'गुलाब', 'शराब', 'आफ़ताब', 'सैलाब', 'रुबाब', 'अज़ाब'],
    strongRhymes: ['कामयाब', 'बेहिसाब', 'लाजवाब', 'इंकलाब'],
    nearRhymes: ['रात', 'आसमान', 'हकीकत', 'याद', 'आग', 'मंज़िल'],
    cadenceRhymes: ['बड़ा ख्वाब', 'टूटा ख्वाब', 'आँखों में ख्वाब', 'ख्वाबों का शहर'],
    synonyms: ['सपना', 'स्वपन', 'कल्पना', 'अरमान'],
    antonyms: ['हकीकत', 'यथार्थ'],
    relatedImagery: ['आँखें', 'नींद', 'तारे', 'आसमान', 'उड़ान', 'रात'],
    relatedGraph: {
      visual: ['तारे', 'आसमान', 'खुली आँखें', 'अंधेरी रात'],
      emotion: ['भूख', 'जुनून', 'उम्मीद', 'बेचैनी'],
      place: ['छत', 'कमरा', 'स्टेज']
    },
    sampleBars: [
      'ख्वाब इतने बड़े कि नींद से बैर कर लिया / अंधेरी रातों में भी उजाला मैंने भर दिया',
      'जो देखा था ख्वाब उसे हकीकत बनाना है / खुद को साबित करके पूरे जहां को दिखाना है'
    ]
  },
  {
    id: 'jawaab',
    devanagari: 'जवाब',
    roman: 'jawaab',
    aliases: ['jawaab', 'jawab', 'jawāb'],
    pronunciation: '/d͡ʒəˈʋaːb/',
    meaning: 'Answer, retort, comeback bar, resolution',
    hindiMeaning: 'उत्तर, प्रतिउत्तर, समाधान',
    origin: 'Hindustani',
    moods: ['Battle', 'Direct', 'Hardcore', 'Real Talk'],
    category: ['RAP', 'AMBITION', 'STREET'],
    syllables: 2,
    coda: 'aab',
    phoneticKey: { nucleus: 'aː', coda: 'b', rhymeEnding: 'ाब', syllables: 2 },
    perfectRhymes: ['ख्वाब', 'नवाब', 'हिसाब', 'किताब', 'गुलाब', 'शराब', 'आफ़ताब', 'सैलाब'],
    strongRhymes: ['कामयाब', 'लाजवाब', 'बेहिसाब', 'इंकलाब'],
    nearRhymes: ['सवाल', 'बात', 'लफ्ज़', 'वार'],
    cadenceRhymes: ['करारा जवाब', 'सवालों का जवाब', 'सीधा जवाब'],
    synonyms: ['उत्तर', 'समाधान', 'प्रतिक्रिया'],
    antonyms: ['सवाल', 'प्रश्न'],
    relatedImagery: ['माइक', 'ज़बान', 'लफ्ज़', 'बहस', 'आईना'],
    sampleBars: [
      'जो पूछते थे सवाल आज उनके पास जवाब नहीं / मेरी कामयाबी का उनके पास कोई हिसाब नहीं'
    ]
  },
  {
    id: 'kaamyaab',
    devanagari: 'कामयाब',
    roman: 'kaamyaab',
    aliases: ['kaamyaab', 'kamyab', 'kamyaab', 'kāmyāb'],
    pronunciation: '/kaːmˈjaːb/',
    meaning: 'Successful, triumphant, victorious over hardship',
    hindiMeaning: 'सफल, विजयी, सिद्धहस्त',
    origin: 'Urdu',
    moods: ['Success', 'Ambition', 'Triumph', 'Inspirational'],
    category: ['AMBITION', 'LIFE'],
    syllables: 3,
    coda: 'aab',
    phoneticKey: { nucleus: 'aː', coda: 'b', rhymeEnding: 'ाब', syllables: 3 },
    perfectRhymes: ['लाजवाब', 'बेहिसाब', 'इंकलाब'],
    strongRhymes: ['ख्वाब', 'जवाब', 'हिसाब', 'किताब', 'सैलाब'],
    nearRhymes: ['जीत', 'मंज़िल', 'फतेह', 'शिखर'],
    cadenceRhymes: ['होना कामयाब', 'मेहनत से कामयाब', 'सच्चा कामयाब'],
    synonyms: ['सफल', 'फतेहयाब', 'विजयी'],
    antonyms: ['नाकाम', 'असफल', 'हारा'],
    relatedImagery: ['स्टेज', 'ट्रॉफी', 'भीड़', 'सूरज', 'परिवार की मुस्कान'],
    sampleBars: [
      'कामयाब वही जो गिरा पर फिर उठ खड़ा हुआ / आंधियों से टकरा के जो और भी बड़ा हुआ'
    ]
  },

  // ==========================================
  // 7. LIFE, EXISTENCE & DEVOTION (IGI)
  // ==========================================
  {
    id: 'zindagi',
    devanagari: 'ज़िंदगी',
    roman: 'zindagi',
    aliases: ['zindagi', 'zindgi', 'jindagi', 'jindgi', 'zindagee', 'zindagī'],
    pronunciation: '/zɪn.d̪əˈɡiː/',
    meaning: 'Life, existence, the mortal journey, survival struggle',
    hindiMeaning: 'जीवन, हयात, प्राण',
    origin: 'Hindustani',
    moods: ['Philosophy', 'Deep', 'Melancholic', 'Real Talk'],
    category: ['LIFE', 'PHILOSOPHY', 'EMOTION'],
    syllables: 3,
    coda: 'igi',
    phoneticKey: { nucleus: 'iː', coda: 'ɡiː', rhymeEnding: 'गी', syllables: 3 },
    perfectRhymes: ['बंदगी', 'गंदगी', 'शर्मिंदगी', 'दरिंदगी', 'दीवानगी', 'ताज़गी', 'सादगी'],
    strongRhymes: ['रवानगी', 'नाराज़गी', 'आवारगी'],
    nearRhymes: ['मौत', 'सांसें', 'सफ़र', 'दुनिया', 'हकीकत'],
    cadenceRhymes: ['मेरी ज़िंदगी', 'कठिन ज़िंदगी', 'दो पल की ज़िंदगी'],
    multiSyllableRhymes: [
      { phraseOrWord: 'आवारा ज़िंदगी', score: 0.94, syllables: 6, type: 'phrase' },
      { phraseOrWord: 'आधी सी ज़िंदगी', score: 0.92, syllables: 6, type: 'phrase' }
    ],
    synonyms: ['जीवन', 'हयात', 'उम्र', 'प्राण', 'अस्तित्व'],
    antonyms: ['मौत', 'मर्ग', 'फ़ना'],
    relatedImagery: ['घड़ी', 'सांस', 'सड़क', 'सफ़र', 'धूप-छांव', 'आईना'],
    sampleBars: [
      'ज़िंदगी ने सिखाया हर ठोकर पे मुस्कुराना / दर्द को छुपा के महफ़िल को हँसाना',
      'छोटी सी ये ज़िंदगी और ख्वाब इतने बड़े / रुकावटों के सामने हम सीना ताने खड़े'
    ]
  },
  {
    id: 'bandagi',
    devanagari: 'बंदगी',
    roman: 'bandagi',
    aliases: ['bandagi', 'bandgi', 'bandagee'],
    pronunciation: '/bən.d̪əˈɡiː/',
    meaning: 'Devotion, servitude, prayer, absolute dedication',
    hindiMeaning: 'उपासना, इबादत, भक्ति',
    origin: 'Urdu',
    moods: ['Spiritual', 'Dedication', 'Devotion'],
    category: ['PHILOSOPHY', 'LIFE'],
    syllables: 3,
    coda: 'igi',
    phoneticKey: { nucleus: 'iː', coda: 'ɡiː', rhymeEnding: 'गी', syllables: 3 },
    perfectRhymes: ['ज़िंदगी', 'गंदगी', 'शर्मिंदगी', 'दरिंदगी', 'सादगी'],
    strongRhymes: ['रवानगी', 'ताज़गी', 'आवारगी'],
    nearRhymes: ['इबादत', 'दुआ', 'खुदा', 'सर झुकाना'],
    cadenceRhymes: ['रब की बंदगी', 'कलम से बंदगी'],
    synonyms: ['इबादत', 'पूजा', 'भक्ति', 'उपासना'],
    relatedImagery: ['सजदा', 'दुआ', 'हाथ उठाना', 'मंदिर-मस्जिद'],
    sampleBars: [
      'संगीत ही इबादत और हिप-हॉप बंदगी / इसी के नाम कर दी मैंने अपनी ज़िंदगी'
    ]
  },

  // ==========================================
  // 8. PASSION, PEACE & BLOOD (OON)
  // ==========================================
  {
    id: 'junoon',
    devanagari: 'जुनून',
    roman: 'junoon',
    aliases: ['junoon', 'junun', 'zunoon', 'zunun', 'junūn'],
    pronunciation: '/d͡ʒʊˈnuːn/',
    meaning: 'Obsession, burning passion, madness for greatness',
    hindiMeaning: 'उन्माद, धुन, दीवानगी, लगन',
    origin: 'Urdu',
    moods: ['Aggressive', 'Hustle', 'Obsession', 'Energy'],
    category: ['AMBITION', 'RAP', 'EMOTION'],
    syllables: 2,
    coda: 'oon',
    phoneticKey: { nucleus: 'uː', coda: 'n', rhymeEnding: 'ून', syllables: 2 },
    perfectRhymes: ['सुकून', 'खून', 'कानून', 'ममनून', 'मजनून'],
    strongRhymes: ['दून', 'जून', 'कून', 'अफसून'],
    nearRhymes: ['आग', 'दीवानगी', 'ताकत', 'जिद', 'जोश'],
    cadenceRhymes: ['सिर पे जुनून', 'सीने में जुनून', 'सच्चा जुनून'],
    synonyms: ['दीवानगी', 'उन्माद', 'धुन', 'जोश', 'लगन'],
    relatedImagery: ['आग', 'खून', 'पसीना', 'रात-दिन', 'माइक'],
    sampleBars: [
      'सिर पे जुनून है और सीने में आग / जो सोए थे सपने वो सारे गए जाग',
      'जुनून की हद तक जाके लिखा है हर लफ्ज़ / अब हिप-हॉप ही मेरी सांस और हिप-हॉप ही नब्ज़'
    ]
  },
  {
    id: 'sukoon',
    devanagari: 'सुकून',
    roman: 'sukoon',
    aliases: ['sukoon', 'sukun', 'sukūn'],
    pronunciation: '/sʊˈkuːn/',
    meaning: 'Peace, tranquility, serenity of soul, mental calm',
    hindiMeaning: 'शांति, चैन, इत्मीनान, राहत',
    origin: 'Urdu',
    moods: ['Peace', 'Introspective', 'Healing', 'Spiritual'],
    category: ['EMOTION', 'PHILOSOPHY', 'LIFE'],
    syllables: 2,
    coda: 'oon',
    phoneticKey: { nucleus: 'uː', coda: 'n', rhymeEnding: 'ून', syllables: 2 },
    perfectRhymes: ['जुनून', 'खून', 'कानून', 'ममनून', 'मजनून'],
    strongRhymes: ['दून', 'जून', 'कून', 'अफसून'],
    nearRhymes: ['चैन', 'राहत', 'नींद', 'सन्नाटा', 'हवा'],
    cadenceRhymes: ['दिल का सुकून', 'खोया सुकून', 'एक पल का सुकून'],
    synonyms: ['शांति', 'चैन', 'इत्मीनान', 'राहत'],
    antonyms: ['बेचैनी', 'तड़प', 'शोर', 'अशांति'],
    relatedImagery: ['रात', 'हवा', 'चाँद', 'सांस', 'मां की गोद', 'खामोशी'],
    sampleBars: [
      'दौलत तो मिली बहुत पर ना मिला सुकून / कागज़ पे लिख के बस बहता है ये खून'
    ]
  },
  {
    id: 'khoon',
    devanagari: 'खून',
    roman: 'khoon',
    aliases: ['khoon', 'khun', 'khūn'],
    pronunciation: '/xuːn/',
    meaning: 'Blood, sacrifice, sweat and tears, primal lineage',
    hindiMeaning: 'रक्त, शोणित, लहू',
    origin: 'Hindustani',
    moods: ['Aggressive', 'Hustle', 'Raw', 'Battle'],
    category: ['STREET', 'RAP', 'AMBITION'],
    syllables: 1,
    coda: 'oon',
    phoneticKey: { nucleus: 'uː', coda: 'n', rhymeEnding: 'ून', syllables: 1 },
    perfectRhymes: ['जुनून', 'सुकून', 'कानून', 'मजनून'],
    strongRhymes: ['दून', 'जून'],
    nearRhymes: ['पसीना', 'ज़ख्म', 'वार', 'रग'],
    cadenceRhymes: ['खून-पसीना', 'उबलता खून', 'रगों में खून'],
    synonyms: ['रक्त', 'लहू', 'शोणित'],
    relatedImagery: ['रग', 'दिल', 'ज़ख्म', 'सड़क', 'पसीना'],
    sampleBars: [
      'खून और पसीने से सींचा ये मकाम / ऐसे ही नहीं बिकता गलियों में ये नाम'
    ]
  },

  // ==========================================
  // 9. SOLITUDE, SHADOWS & TRUTH (AAI)
  // ==========================================
  {
    id: 'tanhai',
    devanagari: 'तन्हाई',
    roman: 'tanhai',
    aliases: ['tanhai', 'tanhaai', 'tanhaaee', 'tanhāī'],
    pronunciation: '/t̪ənˈɦaːiː/',
    meaning: 'Solitude, loneliness, creative isolation in the midnight hours',
    hindiMeaning: 'एकांत, अकेलापन, विजनता',
    origin: 'Urdu',
    moods: ['Loneliness', 'Dark', 'Introspective', 'Melancholic'],
    category: ['EMOTION', 'PAIN', 'CITY'],
    syllables: 3,
    coda: 'aai',
    phoneticKey: { nucleus: 'aːiː', coda: '', rhymeEnding: 'ाई', syllables: 3 },
    perfectRhymes: ['गहराई', 'सच्चाई', 'रुसवाई', 'परछाई', 'ऊंचाई', 'तबाही', 'जुदाई', 'सफ़ाई', 'दुहाई', 'रोशनाई', 'कठिनाई', 'रुबाई'],
    strongRhymes: ['भाई', 'माई', 'आई', 'जाई', 'खाई', 'पाई'],
    nearRhymes: ['अकेला', 'रात', 'खामोशी', 'सन्नाटा', 'कमरा'],
    cadenceRhymes: ['गहरी तन्हाई', 'रात की तन्हाई', 'मेरी तन्हाई', 'तन्हाई का आलम'],
    synonyms: ['अकेलापन', 'एकांत', 'खलवत'],
    antonyms: ['महफ़िल', 'भीड़', 'समागम'],
    relatedImagery: ['कमरे की छत', 'धुआं', 'सिगरेट', 'खिड़की', 'घड़ी की सुई', 'डायरी'],
    sampleBars: [
      'तन्हाई में लिखी जो बातें वो सच निकलीं / महफ़िल में छुपी जो नफरतें वो अब दिखीं',
      'तन्हाई बनी दोस्त जब छूटा सबका साथ / कलम ने थामे रखा हमेशा मेरा हाथ'
    ]
  },
  {
    id: 'sachhai',
    devanagari: 'सच्चाई',
    roman: 'sachhai',
    aliases: ['sachhai', 'sacchai', 'sachai', 'sachhāī'],
    pronunciation: '/sət͡ʃˈt͡ʃʰaːiː/',
    meaning: 'Truth, harsh reality, authenticity, real talk',
    hindiMeaning: 'सत्य, वास्तविकता, यथार्थ',
    origin: 'Hindustani',
    moods: ['Real Talk', 'Street', 'Conscience', 'Hardcore'],
    category: ['LIFE', 'PHILOSOPHY', 'RAP'],
    syllables: 3,
    coda: 'aai',
    phoneticKey: { nucleus: 'aːiː', coda: '', rhymeEnding: 'ाई', syllables: 3 },
    perfectRhymes: ['तन्हाई', 'गहराई', 'रुसवाई', 'परछाई', 'ऊंचाई', 'तबाही', 'जुदाई', 'सफ़ाई', 'दुहाई'],
    strongRhymes: ['भाई', 'खाई', 'पाई'],
    nearRhymes: ['सच', 'हकीकत', 'आईना', 'खुदा'],
    cadenceRhymes: ['कड़वी सच्चाई', 'सामने सच्चाई', 'कलम की सच्चाई'],
    synonyms: ['सत्य', 'हकीकत', 'यथार्थ'],
    antonyms: ['झूठ', 'फरेब', 'दिखावा'],
    relatedImagery: ['आईना', 'आँखें', 'खून', 'कागज़'],
    sampleBars: [
      'कड़वी ये सच्चाई सबको हजम नहीं होती / सच बोलने वालों की कभी महफ़िल नहीं होती'
    ]
  },

  // ==========================================
  // 10. RAP, FLOW, BARS & FIRE
  // ==========================================
  {
    id: 'kalam',
    devanagari: 'कलम',
    roman: 'kalam',
    aliases: ['kalam', 'qalam'],
    pronunciation: '/qəˈləm/',
    meaning: 'Pen, quill, rap weapon, lyrical source of power',
    hindiMeaning: 'लेखनी, स्याही, औजार',
    origin: 'Hindustani',
    moods: ['Rap', 'Craft', 'Weapon', 'Legacy'],
    category: ['RAP', 'AMBITION'],
    syllables: 2,
    coda: 'am',
    phoneticKey: { nucleus: 'ə', coda: 'm', rhymeEnding: 'म', syllables: 2 },
    perfectRhymes: ['कदम', 'सनम', 'कसम', 'ग़म', 'हम', 'दम', 'भरम', 'करम', 'धरम'],
    strongRhymes: ['मरहम', 'आलम', 'मातम', 'रेशम'],
    nearRhymes: ['कागज़', 'स्याही', 'हथियार', 'लफ्ज़'],
    cadenceRhymes: ['मेरी कलम', 'चली कलम', 'कलम में आग'],
    synonyms: ['लेखनी', 'पेन'],
    relatedImagery: ['कागज़', 'स्याही', 'डेस्क', 'स्टूडियो', 'बारूद'],
    sampleBars: [
      'कलम चले मेरी जैसे चले कोई तलवार / एक-एक लफ्ज़ मेरा सीधे दिल पे करे वार'
    ]
  },
  {
    id: 'aag',
    devanagari: 'आग',
    roman: 'aag',
    aliases: ['aag', 'ag', 'āg'],
    pronunciation: '/aːɡ/',
    meaning: 'Fire, flame, internal rage, burning hip-hop passion',
    hindiMeaning: 'अग्नि, अनल, ज्वाला, पावक',
    origin: 'Hindustani',
    moods: ['Fire', 'Aggressive', 'Energy', 'Raw'],
    category: ['RAP', 'AMBITION', 'STREET'],
    syllables: 1,
    coda: 'aag',
    phoneticKey: { nucleus: 'aː', coda: 'ɡ', rhymeEnding: 'ाग', syllables: 1 },
    perfectRhymes: ['भाग', 'दाग', 'जाग', 'साग', 'राग', 'झाग', 'नाग', 'त्याग'],
    strongRhymes: ['दिमाग', 'चिराग', 'सुहाग', 'वैराग'],
    nearRhymes: ['अंगार', 'रात', 'याद', 'खाक', 'राख'],
    cadenceRhymes: ['सीने में आग', 'लगी ये आग', 'माइक पे आग', 'धधकती आग'],
    synonyms: ['अग्नि', 'अनल', 'ज्वाला', 'पावक', 'शोला'],
    antonyms: ['पानी', 'बर्फ', 'ओस'],
    relatedImagery: ['धुआं', 'अंगार', 'राख', 'शोले', 'माचिस', 'जलन'],
    sampleBars: [
      'सीने में आग और ज़बान पे चिंगारी / एक-एक लफ़्ज़ मेरा सब पे है भारी',
      'राख समझ के छेड़ना मत ये दहकते अंगार हैं / जब भी मैं बोलूं माइक पे सीधे वार हैं'
    ]
  },
  {
    id: 'fanaa',
    devanagari: 'फ़ना',
    roman: 'fanaa',
    aliases: ['fanaa', 'fana', 'fanā'],
    pronunciation: '/fəˈnaː/',
    meaning: 'Self-destruction in love/art, mortal dissolution, transcendence',
    hindiMeaning: 'नष्ट, लीन, समर्पित, समा जाना',
    origin: 'Urdu',
    moods: ['Deep', 'Spiritual', 'Passion', 'Dark'],
    category: ['PHILOSOPHY', 'LOVE', 'EMOTION'],
    syllables: 2,
    coda: 'ana',
    phoneticKey: { nucleus: 'aː', coda: '', rhymeEnding: 'ना', syllables: 2 },
    perfectRhymes: ['गुनाह', 'पनाह', 'सफ़ा', 'दुआ', 'हवा', 'जुदा', 'खुदा', 'सदा', 'अदा'],
    strongRhymes: ['ज़माना', 'दीवाना', 'फ़साना', 'तराना'],
    nearRhymes: ['मौत', 'खाक', 'राख', 'मिट्टी'],
    cadenceRhymes: ['हो गया फ़ना', 'खुद को किया फ़ना'],
    synonyms: ['विलीन', 'नष्ट', 'स्वाहा', 'समर्पित'],
    relatedImagery: ['राख', 'शमा-परवाना', 'आग', 'हवा'],
    sampleBars: [
      'हिप-हॉप के इश्क में खुद को किया फ़ना / जो सच ना बोले उसका यहाँ कोई काम ना'
    ]
  }
];

export const WORD_MAP_BY_ID = new Map(WORDS_DATABASE.map(w => [w.id, w]));
export const WORD_MAP_BY_DEVANAGARI = new Map(WORDS_DATABASE.map(w => [w.devanagari, w]));
export const WORD_MAP_BY_ROMAN = new Map(WORDS_DATABASE.map(w => [w.roman.toLowerCase(), w]));
