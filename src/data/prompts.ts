import { SongPrompt } from '../types';

export const SONG_PROMPTS: SongPrompt[] = [
  // --- AMBITION ---
  {
    id: 'ambition-1',
    category: 'AMBITION',
    title: 'The Blueprint & The Scars',
    premise: 'Write about building an empire from a damp one-room flat while everyone laughed at your notepad.',
    angle: 'Focus on the contrast between physical poverty and mental sovereignty. Highlight the late-night tea, the silence of 3 AM, and the unshakeable certainty that your time is coming.',
    suggestedBpm: '90 - 96 BPM (Hard Boom Bap)',
    mood: 'Defiant, Hungry, Raw, Relentless',
    keywords: [
      { devanagari: 'ख्वाब', roman: 'khwaab' },
      { devanagari: 'कामयाबी', roman: 'kaamyaab' },
      { devanagari: 'मेहनत', roman: 'mehnat' },
      { devanagari: 'अंधेरा', roman: 'andhera' },
      { devanagari: 'मुकाम', roman: 'mukaam' },
      { devanagari: 'जुनून', roman: 'junoon' }
    ],
    rhymeAnchors: [
      { word: 'ख्वाब', rhymes: ['जवाब', 'हिसाब', 'किताब', 'कामयाब', 'लाजवाब'] },
      { word: 'नाम', rhymes: ['काम', 'मुकाम', 'अंजाम', 'सलाम'] }
    ],
    sampleOpeningBar: 'एक कमरे की छत से मैंने आसमान को नापा था / जब जेब में ना सिक्का था तब ख्वाबों को था पाला'
  },
  {
    id: 'ambition-2',
    category: 'AMBITION',
    title: 'No Co-Signs',
    premise: 'Write a verse about refusing to compromise your sound or beg gatekeepers for approval.',
    angle: 'Independent sovereignty. Rejecting industry shortcuts and building your fanbase bar by bar, show by show.',
    suggestedBpm: '135 - 142 BPM (Heavy Drill)',
    mood: 'Aggressive, Unapologetic, Gritty',
    keywords: [
      { devanagari: 'हुनर', roman: 'hunar' },
      { devanagari: 'रास्ता', roman: 'raasta' },
      { devanagari: 'हथियार', roman: 'hathiyaar' },
      { devanagari: 'पहचान', roman: 'pehchaan' },
      { devanagari: 'औकात', roman: 'auqaat' }
    ],
    rhymeAnchors: [
      { word: 'पहचान', rhymes: ['आसमान', 'तूफान', 'निशान', 'उड़ान'] },
      { word: 'हुनर', rhymes: ['शहर', 'सफ़र', 'असर', 'ज़हर'] }
    ],
    sampleOpeningBar: 'ना चाहिए कोई सिफारिश ना किसी का उपकार / मेरा फ्लो ही है ढाल और ये कलम हथियार'
  },

  // --- SUCCESS & ITS HOLLOWNESS ---
  {
    id: 'success-1',
    category: 'SUCCESS',
    title: 'The View from the Top Floor',
    premise: 'Achieving your dream and realizing you miss the person you were before you became successful.',
    angle: 'The luxury apartment is silent. The money came, but the simplicity of sharing a cigarette with old friends is gone forever.',
    suggestedBpm: '85 - 92 BPM (Lo-Fi Hip-Hop / Soulful)',
    mood: 'Melancholic, Reflective, Nostalgic',
    keywords: [
      { devanagari: 'पैसा', roman: 'paisa' },
      { devanagari: 'सुकून', roman: 'sukoon' },
      { devanagari: 'पुराना मैं', roman: 'purana main' },
      { devanagari: 'तन्हाई', roman: 'tanhai' },
      { devanagari: 'यादें', roman: 'yaadein' },
      { devanagari: 'बचपन', roman: 'bachpan' }
    ],
    rhymeAnchors: [
      { word: 'सुकून', rhymes: ['जुनून', 'खून', 'कानून'] },
      { word: 'पैसा', rhymes: ['कैसा', 'वैसा', 'जैसा'] }
    ],
    sampleOpeningBar: 'बैंक में भरे करोड़ पर सीने में खालीपन / जीत के भी हार गया वो मासूम सा बचपन'
  },

  // --- PAIN & HEARTBREAK ---
  {
    id: 'pain-1',
    category: 'PAIN',
    title: 'Ink Over Open Wounds',
    premise: 'Write about a betrayal that cut so deep it permanently changed your personality.',
    angle: 'Not just sad, but callous. The moment you stopped trusting promises and turned emotional scars into lyrical armor.',
    suggestedBpm: '80 - 88 BPM (Dark Trap)',
    mood: 'Cold, Cynical, Piercing',
    keywords: [
      { devanagari: 'दर्द', roman: 'dard' },
      { devanagari: 'धोखा', roman: 'dhokha' },
      { devanagari: 'ज़हर', roman: 'zahar' },
      { devanagari: 'हमदर्द', roman: 'hamdard' },
      { devanagari: 'खंजर', roman: 'khanjar' }
    ],
    rhymeAnchors: [
      { word: 'दर्द', rhymes: ['बेदर्द', 'हमदर्द', 'शागिर्द'] },
      { word: 'ज़हर', rhymes: ['शहर', 'सफ़र', 'असर', 'कहर'] }
    ],
    sampleOpeningBar: 'ढूंढता रहा हमदर्द इस मतलबी शहर में / हर कोई मिला यहाँ जहर लिए नजर में'
  },

  // --- CITY & STREETS ---
  {
    id: 'city-1',
    category: 'CITY',
    title: 'Concrete Jungle Chronicles',
    premise: 'Write about the dual life of your city: bright skyline towers above, dark alleys and local trains below.',
    angle: 'Capture sensory details: cutting chai steam, screeching local train brakes, midnight sirens, overhead flyovers.',
    suggestedBpm: '94 - 100 BPM (Classic Street Boom Bap)',
    mood: 'Atmospheric, Gritty, Rhythmic, Cinematic',
    keywords: [
      { devanagari: 'शहर', roman: 'shehar' },
      { devanagari: 'सड़कें', roman: 'sadkein' },
      { devanagari: 'रात', roman: 'raat' },
      { devanagari: 'भीड़', roman: 'bheed' },
      { devanagari: 'सन्नाटा', roman: 'sannata' }
    ],
    rhymeAnchors: [
      { word: 'रात', rhymes: ['बात', 'साथ', 'हाथ', 'हालात', 'जज़्बात'] },
      { word: 'शहर', rhymes: ['सफ़र', 'असर', 'ज़हर', 'मंज़र'] }
    ],
    sampleOpeningBar: 'ये शहर कंक्रीट का यहाँ कोई दिल नहीं / दौड़ रहे सब अंधी राहों में कोई मंज़िल नहीं'
  },

  // --- LONELINESS & MIDNIGHT ---
  {
    id: 'loneliness-1',
    category: 'LONELINESS',
    title: '3 AM Solitude',
    premise: 'Write about the conversation you have with your reflection when the music stops and everyone is asleep.',
    angle: 'Stripped of bravado. Honest admission of fears, sleepless nights, and the addiction to creating art in the dark.',
    suggestedBpm: '75 - 85 BPM (Ambient / Melancholic)',
    mood: 'Vulnerable, Introspective, Quiet',
    keywords: [
      { devanagari: 'तन्हाई', roman: 'tanhai' },
      { devanagari: 'परछाई', roman: 'parchhai' },
      { devanagari: 'सन्नाटा', roman: 'sannata' },
      { devanagari: 'नींद', roman: 'neend' },
      { devanagari: 'आँखें', roman: 'aankhein' }
    ],
    rhymeAnchors: [
      { word: 'तन्हाई', rhymes: ['सच्चाई', 'गहराई', 'परछाई', 'रुसवाई'] },
      { word: 'रात', rhymes: ['बात', 'साथ', 'मात', 'जज़्बात'] }
    ],
    sampleOpeningBar: 'रात में जागता, सवाल मेरे साथ / शहर सो रहा लेकिन आँखों में रात'
  },

  // --- LOVE & OBSESSION ---
  {
    id: 'love-1',
    category: 'LOVE',
    title: 'Poisonous Chemistry',
    premise: 'Write about a magnetic connection with someone you know will eventually destroy you.',
    angle: 'Acknowledge the impending disaster while consciously leaning into the euphoria. Toxic, poetic, irresistible.',
    suggestedBpm: '105 - 115 BPM (Afro-trap / Melodic Rap)',
    mood: 'Sensual, Dark, Addictive',
    keywords: [
      { devanagari: 'प्यार', roman: 'pyaar' },
      { devanagari: 'आग', roman: 'aag' },
      { devanagari: 'फ़ना', roman: 'fanaa' },
      { devanagari: 'दिल', roman: 'dil' },
      { devanagari: 'जुनून', roman: 'junoon' }
    ],
    rhymeAnchors: [
      { word: 'प्यार', rhymes: ['यार', 'वार', 'अंगार', 'इंतज़ार', 'हथियार'] },
      { word: 'दिल', rhymes: ['मंज़िल', 'महफ़िल', 'क़ातिल', 'मुश्किल'] }
    ],
    sampleOpeningBar: 'तेरी आँखों में वो नशा जो किसी मयखाने में नहीं / तुझसे बच के निकल जाऊं ऐसा कोई ज़माने में नहीं'
  },

  // --- FAMILY & SACRIFICE ---
  {
    id: 'family-1',
    category: 'FAMILY',
    title: 'Mother’s Prayers & Father’s Back',
    premise: 'Write about the weight of your family’s sacrifices and the drive to repay them ten-fold.',
    angle: 'Seeing your mother’s worn hands and your father’s bent spine. Writing not for ego, but to retire your parents forever.',
    suggestedBpm: '85 - 90 BPM (Soulful Sample Loop)',
    mood: 'Emotional, Reverent, Heavy, Grounded',
    keywords: [
      { devanagari: 'मां', roman: 'maa' },
      { devanagari: 'दुआ', roman: 'dua' },
      { devanagari: 'रिश्ता', roman: 'rishta' },
      { devanagari: 'विरासत', roman: 'viraasat' },
      { devanagari: 'हक', roman: 'haq' }
    ],
    rhymeAnchors: [
      { word: 'दुआ', rhymes: ['खुदा', 'सदा', 'वफ़ा', 'सफ़ा'] },
      { word: 'रिश्ता', rhymes: ['फरिश्ता', 'रास्ता', 'वास्ता'] }
    ],
    sampleOpeningBar: 'मां की दुआएं सिर पे तो दुनिया की क्या बिसात / पिता के पसीने का कर्ज चुकाना है दिन-रात'
  },

  // --- MONEY & GREED ---
  {
    id: 'money-1',
    category: 'MONEY',
    title: 'Paper Gods',
    premise: 'Analyze how money turns best friends into strangers and blood relatives into rivals.',
    angle: 'Philosophical critique of capitalism and street greed. The paradox that you need money to survive, but chasing it eats your soul.',
    suggestedBpm: '128 - 135 BPM (Dark Trap)',
    mood: 'Cynical, Hard-hitting, Analytical',
    keywords: [
      { devanagari: 'पैसा', roman: 'paisa' },
      { devanagari: 'हिसाब', roman: 'hisaab' },
      { devanagari: 'दौलत', roman: 'daulat' },
      { devanagari: 'दुनिया', roman: 'duniya' },
      { devanagari: 'अंजाम', roman: 'anjaam' }
    ],
    rhymeAnchors: [
      { word: 'पैसा', rhymes: ['कैसा', 'वैसा', 'जैसा'] },
      { word: 'अंजाम', rhymes: ['इल्ज़ाम', 'बदनाम', 'काम', 'नाम'] }
    ],
    sampleOpeningBar: 'कागज़ के इन टुकड़ों ने क्या खेल दिखाया है / अपने ही भाई से भाई को लड़वाया है'
  },

  // --- FAILURE & RESILIENCE ---
  {
    id: 'failure-1',
    category: 'FAILURE',
    title: 'The Dust On My Knees',
    premise: 'Write about hitting absolute rock bottom, losing all momentum, and deciding to stand back up anyway.',
    angle: 'Celebrate failure as the ultimate teacher. Refusing pity and treating defeat as mandatory fuel.',
    suggestedBpm: '90 - 95 BPM (Anthemic Rap)',
    mood: 'Triumphant, Unbroken, Resilient',
    keywords: [
      { devanagari: 'हार', roman: 'haar' },
      { devanagari: 'जीत', roman: 'jeet' },
      { devanagari: 'हौसला', roman: 'hausla' },
      { devanagari: 'मुक़द्दर', roman: 'muqaddar' },
      { devanagari: 'वक़्त', roman: 'waqt' }
    ],
    rhymeAnchors: [
      { word: 'हार', rhymes: ['प्यार', 'यार', 'वार', 'हथियार', 'संसार'] },
      { word: 'जीत', rhymes: ['गीत', 'मीत', 'संगीत', 'अतीत'] }
    ],
    sampleOpeningBar: 'हार से ही सीखा मैंने जीतने का हुनर / डरता नहीं अब चाहे कितना भी हो कहर'
  }
];
