import { IdeaSeed } from '../../types';
import { lexicalDatabase } from './lexical-database';
import { normalizeRomanHindi } from './normalizer';

export interface WordSpark {
  devanagari: string;
  roman: string;
  category: 'OBJECT' | 'SETTING' | 'EMOTION' | 'STREET' | 'ABSTRACT';
  meaning: string;
}

export const WORD_SPARKS: WordSpark[] = [
  { devanagari: 'आईना', roman: 'aaina', category: 'OBJECT', meaning: 'Mirror / Truth' },
  { devanagari: 'खिड़की', roman: 'khidki', category: 'OBJECT', meaning: 'Window / Perspective' },
  { devanagari: 'धुआँ', roman: 'dhuaan', category: 'OBJECT', meaning: 'Smoke / Illusion' },
  { devanagari: 'सीढ़ियाँ', roman: 'seedhiyan', category: 'SETTING', meaning: 'Stairwell / Climb' },
  { devanagari: 'सन्नाटा', roman: 'sannata', category: 'SETTING', meaning: 'Silence / Void' },
  { devanagari: 'ज़ंजीर', roman: 'zanjeer', category: 'OBJECT', meaning: 'Chains / Bondage' },
  { devanagari: 'साया', roman: 'saaya', category: 'ABSTRACT', meaning: 'Shadow / Past' },
  { devanagari: 'अंगार', roman: 'angaar', category: 'STREET', meaning: 'Burning Ember / Fire' },
  { devanagari: 'क़दम', roman: 'qadam', category: 'STREET', meaning: 'Footsteps / Journey' },
  { devanagari: 'नक़ाब', roman: 'naqaab', category: 'OBJECT', meaning: 'Mask / Persona' },
  { devanagari: 'तूफ़ान', roman: 'toofan', category: 'ABSTRACT', meaning: 'Storm / Chaos' },
  { devanagari: 'शिखर', roman: 'shikhar', category: 'SETTING', meaning: 'Peak / Solitude' },
  { devanagari: 'पसीना', roman: 'paseena', category: 'STREET', meaning: 'Sweat / Grind' },
  { devanagari: 'ज़ख़्म', roman: 'zakhm', category: 'EMOTION', meaning: 'Scars / Resilience' },
  { devanagari: 'मंज़िल', roman: 'manzil', category: 'SETTING', meaning: 'Destination' },
  { devanagari: 'हक़ीक़त', roman: 'haqeeqat', category: 'ABSTRACT', meaning: 'Raw Reality' },
];

export const IDEA_SEEDS: IdeaSeed[] = [
  // --- CONCEPT SEEDS ---
  {
    id: 'concept-1',
    category: 'CONCEPT',
    title: 'Empty Pinnacle',
    concept: 'Success that feels hollow once you finally reach it.',
    image: 'Looking down at city lights at 3 AM from a glass penthouse balcony.',
    contrast: 'A full bank account versus an empty room.',
    emotion: 'Ambition colliding with solitude and quiet regret.',
    keywords: [
      { devanagari: 'कामयाबी', roman: 'kaamyaabi' },
      { devanagari: 'तन्हाई', roman: 'tanhai' },
      { devanagari: 'सुकून', roman: 'sukoon' },
      { devanagari: 'शिखर', roman: 'shikhar' },
    ],
    sampleBar: 'जीत के भी हारा जैसे खाली ये मकान / आसमान छू लिया पर छूट गया जहान',
  },
  {
    id: 'concept-2',
    category: 'CONCEPT',
    title: 'The Unforgiving Blueprint',
    concept: 'Building your sound bar by bar in a damp room while the world doubts.',
    image: 'Flickering CFL tube-light over a beat-up spiral notebook.',
    contrast: 'Zero industry support versus 100% self-reliance.',
    emotion: 'Defiance, hunger, and quiet spiritual certainty.',
    keywords: [
      { devanagari: 'मेहनत', roman: 'mehnat' },
      { devanagari: 'हुनर', roman: 'hunar' },
      { devanagari: 'रास्ता', roman: 'raasta' },
      { devanagari: 'इरादा', roman: 'iraada' },
    ],
    sampleBar: 'एक कमरे की छत से नापा सारा आसमान / कलम मेरी ढाल और ये शब्द ही कमान',
  },
  {
    id: 'concept-3',
    category: 'CONCEPT',
    title: 'Currency of Loyalty',
    concept: 'How money and fame filter fake friends and expose true intentions.',
    image: 'Two cups of roadside cutting chai turning into split bills at luxury hotels.',
    contrast: 'Old handshakes versus new contracts.',
    emotion: 'Cynicism tempered by street wisdom.',
    keywords: [
      { devanagari: 'दौलत', roman: 'daulat' },
      { devanagari: 'दोस्त', roman: 'dost' },
      { devanagari: 'सच्चाई', roman: 'sachhaai' },
      { devanagari: 'धोखा', roman: 'dhokha' },
    ],
    sampleBar: 'कागज़ के इन नोटों ने क्या रंग है दिखाया / अपने ही सगे को यहाँ गैर है बनाया',
  },
  {
    id: 'concept-4',
    category: 'CONCEPT',
    title: 'The Mask of Bravado',
    concept: 'The loud confidence on stage hiding the anxiety of an uncertain future.',
    image: 'Sweat drying under the green room mirror after the crowd goes silent.',
    contrast: 'Roaring audience vs deafening quiet on the cab ride home.',
    emotion: 'Vulnerability masked by heavy cadence.',
    keywords: [
      { devanagari: 'चेहरा', roman: 'chehra' },
      { devanagari: 'नक़ाब', roman: 'naqaab' },
      { devanagari: 'आवाज़', roman: 'aawaaz' },
      { devanagari: 'सन्नाटा', roman: 'sannata' },
    ],
    sampleBar: 'माइक पे दहाड़े जैसे कोई डर नहीं / मंच से जो उतरे तो कहीं भी घर नहीं',
  },

  // --- IMAGE SEEDS ---
  {
    id: 'image-1',
    category: 'IMAGE',
    title: 'Midnight Asphalt',
    concept: 'The nocturnal rhythm of a city where dreams never sleep.',
    image: 'Neon billboards reflected in broken puddle asphalt under a yellow sodium streetlamp.',
    contrast: 'The speeding night train versus the frozen silence of a lone wanderer.',
    emotion: 'Cinematic introspection and street grit.',
    keywords: [
      { devanagari: 'सड़क', roman: 'sadak' },
      { devanagari: 'रात', roman: 'raat' },
      { devanagari: 'अंधेरा', roman: 'andhera' },
      { devanagari: 'शहर', roman: 'shehar' },
    ],
    sampleBar: 'गीली ये सड़कें और आँखों में रात / खामोश ये शहर पर सवाल मेरे साथ',
  },
  {
    id: 'image-2',
    category: 'IMAGE',
    title: 'Rusted Microphones',
    concept: 'Underground cyphers and basement rehearsals before the lights came on.',
    image: 'A dented Shure SM58 mic with peeled black tape in a dimly lit studio.',
    contrast: 'Cheap equipment producing world-class bars.',
    emotion: 'Pure, raw underground passion.',
    keywords: [
      { devanagari: 'कलम', roman: 'kalam' },
      { devanagari: 'आवाज़', roman: 'aawaaz' },
      { devanagari: 'धुन', roman: 'dhun' },
      { devanagari: 'जुनून', roman: 'junoon' },
    ],
    sampleBar: 'सस्ते से इस माइक पे तराशा ये जुनून / लफ्जों की इस जंग में बहाया अपना खून',
  },
  {
    id: 'image-3',
    category: 'IMAGE',
    title: 'The Worn Sole Hustle',
    concept: 'The physical toll of walking miles for a meeting that never happened.',
    image: 'Dust-covered sneakers resting on the stairwell of a subway station.',
    contrast: 'Physical exhaustion versus unstoppable momentum.',
    emotion: 'Heavy fatigue fueling relentless ambition.',
    keywords: [
      { devanagari: 'सफ़र', roman: 'safar' },
      { devanagari: 'मंज़िल', roman: 'manzil' },
      { devanagari: 'पसीना', roman: 'paseena' },
      { devanagari: 'क़दम', roman: 'qadam' },
    ],
    sampleBar: 'घिस गए हैं जूते पर रुका नहीं कदम / मंज़िलें पुकारेंगी दिखाएंगे वो दम',
  },
  {
    id: 'image-4',
    category: 'IMAGE',
    title: 'Smoke in the Flyover Shadows',
    concept: 'Escaping the noise beneath the concrete pillars of the city highway.',
    image: 'Thin spiral of cigarette smoke rising under the concrete pillars of an overpass.',
    contrast: 'Traffic roaring above vs stillness underneath.',
    emotion: 'Detachment, observant quiet, city melancholy.',
    keywords: [
      { devanagari: 'धुआं', roman: 'dhuaan' },
      { devanagari: 'राख', roman: 'raakh' },
      { devanagari: 'छांव', roman: 'chhaanv' },
      { devanagari: 'तन्हाई', roman: 'tanhai' },
    ],
    sampleBar: 'पुल के नीचे धुआं और यादों का कहर / ऊपर से गुजरता रहा मतलबी शहर',
  },

  // --- CONTRAST SEEDS ---
  {
    id: 'contrast-1',
    category: 'CONTRAST',
    title: 'Noise Outside / Silence Inside',
    concept: 'Surrounded by roaring crowds yet experiencing profound mental solitude.',
    image: 'Noise canceling headphones resting over ears in a jam-packed Mumbai local.',
    contrast: 'External chaos versus internal frozen silence.',
    emotion: 'Introspective clarity amidst street madness.',
    keywords: [
      { devanagari: 'शोर', roman: 'shor' },
      { devanagari: 'खामोशी', roman: 'khaamoshi' },
      { devanagari: 'भीड़', roman: 'bheed' },
      { devanagari: 'दिल', roman: 'dil' },
    ],
    sampleBar: 'बाहर ये शोर सारा अंदर है सन्नाटा / भीड़ में भी खुद को अकेले ही है पाया',
  },
  {
    id: 'contrast-2',
    category: 'CONTRAST',
    title: 'Gold Chains / Heavy Scars',
    concept: 'Wearing jewelry on the outside to hide internal fractures.',
    image: 'A gold pendant resting over a chest marked by old battle wounds.',
    contrast: 'Polished luxury versus jagged survival memories.',
    emotion: 'Hardened pride and unhealed trauma.',
    keywords: [
      { devanagari: 'सोना', roman: 'sona' },
      { devanagari: 'ज़ख़्म', roman: 'zakhm' },
      { devanagari: 'दर्द', roman: 'dard' },
      { devanagari: 'निशान', roman: 'nishaan' },
    ],
    sampleBar: 'गले में है सोना पर सीने में निशान / दर्द से ही सीखी हमने जीने की उड़ान',
  },
  {
    id: 'contrast-3',
    category: 'CONTRAST',
    title: 'Poison as Medicine',
    concept: 'Turning heartbreak, anger, and betrayal into the very fuel for masterpieces.',
    image: 'Spilling black ink over a white sheet like poison turning into medicine.',
    contrast: 'Toxicity converted into art.',
    emotion: 'Alchemical resilience and lyrical vengeance.',
    keywords: [
      { devanagari: 'ज़हर', roman: 'zahar' },
      { devanagari: 'दवा', roman: 'dawa' },
      { devanagari: 'आग', roman: 'aag' },
      { devanagari: 'शायरी', roman: 'shaayari' },
    ],
    sampleBar: 'जो ज़हर दिया तुमने वही अब दवा बनी / हर एक चोट मेरी आज ये सदा बनी',
  },

  // --- EMOTION SEEDS ---
  {
    id: 'emotion-1',
    category: 'EMOTION',
    title: 'Defiance & Reverence',
    concept: 'Standing fearless before enemies while keeping head bowed before mother’s prayers.',
    image: 'Fists clenched ready for battle, but hands open in gratitude at home.',
    contrast: 'Ruthless warrior on the block vs humble son in the kitchen.',
    emotion: 'Honor, filial duty, unstoppable spine.',
    keywords: [
      { devanagari: 'दुआ', roman: 'dua' },
      { devanagari: 'मां', roman: 'maa' },
      { devanagari: 'वार', roman: 'waar' },
      { devanagari: 'ताक़त', roman: 'taaqat' },
    ],
    sampleBar: 'मां की दुआएं सिर पे तो दुनिया की क्या बिसात / दुश्मन के आगे खड़े सीना ताने दिन-रात',
  },
  {
    id: 'emotion-2',
    category: 'EMOTION',
    title: 'Cold Hunger',
    concept: 'The specific type of hunger when you haven’t eaten and your notepad is full.',
    image: 'Drinking tap water to quiet the stomach so you can finish writing verse 2.',
    contrast: 'Empty belly versus razor-sharp focus.',
    emotion: 'Raw desperation transformed into iron will.',
    keywords: [
      { devanagari: 'भूख', roman: 'bhookh' },
      { devanagari: 'आग', roman: 'aag' },
      { devanagari: 'वक़्त', roman: 'waqt' },
      { devanagari: 'इम्तिहान', roman: 'imtihaan' },
    ],
    sampleBar: 'खाली पेट जलती रही सीने में जो आग / उसी आग ने जगाया मेरा सोया हुआ भाग',
  },
];

/**
 * Returns a random or category-filtered idea seed
 */
export function getIdeaSeed(category?: string, seedWord?: string): IdeaSeed {
  let pool = IDEA_SEEDS;

  if (category && category !== 'ALL') {
    const matched = pool.filter((s) => s.category.toUpperCase() === category.toUpperCase());
    if (matched.length > 0) pool = matched;
  }

  // If a seed word is provided, try to find seeds that match its keywords or themes
  if (seedWord) {
    const normalized = normalizeRomanHindi(seedWord);
    const related = pool.filter((s) =>
      s.keywords?.some(
        (k) =>
          k.devanagari.includes(normalized) ||
          k.roman.includes(normalized) ||
          seedWord.includes(k.devanagari)
      )
    );
    if (related.length > 0) {
      return related[Math.floor(Math.random() * related.length)];
    }
  }

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/**
 * Returns structured idea seeds linked directly to a word's lexical graph
 */
export function getWordAssociationSeed(wordStr: string): IdeaSeed | null {
  const entry = lexicalDatabase.getByDevanagari(wordStr) || lexicalDatabase.getBySearchForm(wordStr);
  if (!entry) return null;

  const graph = entry.relatedGraph;
  const visuals = graph?.visual?.slice(0, 3).join(', ') || entry.relatedImagery?.slice(0, 3).join(', ') || '';
  const emotions = graph?.emotion?.slice(0, 3).join(', ') || entry.moods?.slice(0, 3).join(', ') || '';
  const places = graph?.place?.slice(0, 3).join(', ') || '';
  const sounds = graph?.sound?.slice(0, 3).join(', ') || '';

  return {
    id: `assoc-${entry.id}`,
    category: 'IMAGE',
    title: `Inspiration from "${entry.devanagari}" (${entry.roman})`,
    concept: entry.meaning ? `Explore: "${entry.meaning}"` : `Evoke imagery and mood around ${entry.devanagari}`,
    image: visuals || places || `Imagery anchored by ${entry.devanagari}`,
    contrast: emotions ? `Emotion: ${emotions}` : sounds ? `Sonic mood: ${sounds}` : 'Light vs Shadow',
    emotion: emotions || entry.moods?.join(', ') || 'Intense & Poetic',
    keywords: [
      { devanagari: entry.devanagari, roman: entry.roman },
      ...(entry.perfectRhymes?.slice(0, 3).map((r) => ({ devanagari: r, roman: r })) || []),
    ],
    sampleBar: entry.sampleBars?.[0] || undefined,
  };
}

/**
 * Returns a quick batch of spark vocabulary words
 */
export function getQuickWordSparks(count = 6): WordSpark[] {
  const shuffled = [...WORD_SPARKS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
