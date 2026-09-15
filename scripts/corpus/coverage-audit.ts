/**
 * BHASHA — Corpus Coverage Audit Tool
 * Audits corpus statistics, inspects metadata completeness, and evaluates coverage against songwriting test sets.
 */

import * as fs from 'fs';
import * as path from 'path';
import { LexicalEntry, InvertedRhymeIndex } from '../../src/types';
import { removeNuqta } from './phonetics-generator';

const CORPUS_PATH = path.join(__dirname, '../../src/data/lexicon/corpus.json');
const RHYME_INDEX_PATH = path.join(__dirname, '../../src/data/lexicon/rhyme-index.json');

// Real Songwriting Domain Test Sets
export const TEST_LISTS = {
  'Everyday Hindi': [
    'घर', 'कमरा', 'दरवाज़ा', 'खाना', 'पानी', 'सुबह', 'शाम', 'रात', 'आज', 'कल',
    'लोग', 'आदमी', 'औरत', 'बच्चा', 'काम', 'पैसा', 'दोस्त', 'सड़क', 'आँख', 'हाथ',
    'बात', 'रोटी', 'कपड़ा', 'मकान', 'रास्ता', 'हवा', 'आग', 'शहर', 'दिन', 'धूप',
    'नींद', 'सपना', 'नाम'
  ],
  'Common Hindustani': [
    'दिल', 'दर्द', 'प्यार', 'याद', 'वक़्त', 'सफ़र', 'मंज़िल', 'ख़्वाब', 'ज़िंदगी',
    'सुकून', 'असर', 'ख़बर', 'नज़र', 'मौका', 'साया', 'जुनून', 'सच', 'झूठ',
    'अकेला', 'साथ', 'दुनिया', 'ज़माना', 'पहचान', 'हौसला', 'कदम', 'आवाज़', 'खामोशी',
    'चेहरा', 'आँसू', 'हँसी'
  ],
  'Urdu / Persian / Arabic vocabulary': [
    'मोहब्बत', 'वफ़ा', 'जफ़ा', 'फ़ुरसत', 'क़ुदरत', 'जज़्बात', 'हालात', 'कायनात',
    'तन्हाई', 'जुदाई', 'रुसवाई', 'फ़ना', 'क़िस्मत', 'मुक़द्दर', 'इश्क़', 'शब',
    'नूर', 'दीद', 'गुलज़ार', 'मयख़ाना', 'पैमाना', 'आफ़ताब', 'फ़साना', 'दीवाना',
    'परवाना', 'मस्ताना', 'साकी', 'तहज़ीब', 'रहबर', 'रवाँ', 'कारवां', 'मुलाक़ात',
    'औक़ात', 'बयान', 'एहसास', 'जहान'
  ],
  'Poetic vocabulary': [
    'गुल', 'चमन', 'बुलबुल', 'सहर', 'शफ़क़', 'महताब', 'क़यामत', 'सोज़', 'साज़',
    'राज़', 'इल्तिजा', 'दुआ', 'सज़ा', 'इल्ज़ाम', 'पैगाम', 'जाम', 'अंजाम',
    'ख़ुमार', 'क़रार', 'इंतज़ार', 'दीदार', 'हसरत', 'कसरत', 'अफ़सोस', 'सदा',
    'आशियाना', 'फ़रेब', 'अदा', 'नफ़रत', 'बंदगी', 'सादगी'
  ],
  'Contemporary / Street / Hip-Hop': [
    'हसल', 'सीन', 'बत्ती', 'पंटर', 'तोप', 'रफ़्तार', 'शोहरत', 'गद्दी', 'खौफ़',
    'भौकाल', 'आवाम', 'खल्लास', 'बवाल', 'चमक', 'कड़क', 'ठोक', 'बंटा', 'बंदी',
    'भाई', 'खजाना', 'गेम', 'फ्लो', 'बीट', 'माइक', 'कलम', 'वर्स', 'हुक', 'ट्रैक'
  ]
};

export interface AuditReport {
  totalWords: number;
  uniqueDevanagari: number;
  uniqueUrdu: number;
  uniqueRomanForms: number;
  uniqueAliases: number;
  withPronunciation: number;
  withSyllables: number;
  withRhymeKey: number;
  withMeaning: number;
  byOrigin: Record<string, number>;
  byRegister: Record<string, number>;
  byCategory: Record<string, number>;
  bySyllableCount: Record<number, number>;
  topRhymeKeys: Record<string, number>;
  domainCoverage: Record<string, { total: number; matched: number; percentage: number }>;
  missingWords: Record<string, string[]>;
  missingRomanMappings: string[];
  missingPronunciation: string[];
  missingRhymeIndex: string[];
}

export function runCorpusAudit(): AuditReport {
  if (!fs.existsSync(CORPUS_PATH) || !fs.existsSync(RHYME_INDEX_PATH)) {
    throw new Error('Corpus or Rhyme Index file missing. Run `npm run build-corpus` first.');
  }

  const corpus: LexicalEntry[] = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf-8'));
  const rhymeIndex: InvertedRhymeIndex = JSON.parse(fs.readFileSync(RHYME_INDEX_PATH, 'utf-8'));

  const devanagariMap = new Map<string, LexicalEntry>();
  const urduSet = new Set<string>();
  const romanFormsSet = new Set<string>();
  const aliasesSet = new Set<string>();

  const byOrigin: Record<string, number> = {};
  const byRegister: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const bySyllableCount: Record<number, number> = {};
  const rhymeKeyCounts: Record<string, number> = {};

  let withPronunciation = 0;
  let withSyllables = 0;
  let withRhymeKey = 0;
  let withMeaning = 0;

  const missingRomanMappings: string[] = [];
  const missingPronunciation: string[] = [];
  const missingRhymeIndex: string[] = [];

  for (const entry of corpus) {
    devanagariMap.set(entry.devanagari, entry);
    devanagariMap.set(removeNuqta(entry.devanagari), entry);
    if (entry.variants) {
      for (const v of entry.variants) devanagariMap.set(v, entry);
    }

    if (entry.urdu && entry.urdu.trim()) urduSet.add(entry.urdu);
    if (entry.roman) romanFormsSet.add(entry.roman.toLowerCase());
    if (entry.aliases) {
      for (const a of entry.aliases) {
        aliasesSet.add(a.toLowerCase());
        romanFormsSet.add(a.toLowerCase());
      }
    }
    if (entry.normalizedSearchForms) {
      for (const f of entry.normalizedSearchForms) romanFormsSet.add(f.toLowerCase());
    }

    if (entry.pronunciation && entry.pronunciation.trim()) {
      withPronunciation++;
    } else {
      missingPronunciation.push(entry.devanagari);
    }

    if (entry.syllables && entry.syllables > 0) {
      withSyllables++;
      bySyllableCount[entry.syllables] = (bySyllableCount[entry.syllables] || 0) + 1;
    }

    if (entry.rhymeKey && entry.rhymeKey.trim()) {
      withRhymeKey++;
      rhymeKeyCounts[entry.rhymeKey] = (rhymeKeyCounts[entry.rhymeKey] || 0) + 1;
    } else {
      missingRhymeIndex.push(entry.devanagari);
    }

    if (entry.meaning && entry.meaning.trim()) {
      withMeaning++;
    }

    if (!entry.aliases || entry.aliases.length === 0) {
      missingRomanMappings.push(entry.devanagari);
    }

    // Origin breakdown
    const orig = entry.origin || 'Hindustani';
    byOrigin[orig] = (byOrigin[orig] || 0) + 1;

    // Register breakdown
    if (entry.register) {
      for (const reg of entry.register) {
        byRegister[reg] = (byRegister[reg] || 0) + 1;
      }
    }

    // Category breakdown
    if (entry.category) {
      for (const cat of entry.category) {
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      }
    }
  }

  // Evaluate Coverage Against Songwriting Test Lists
  const domainCoverage: Record<string, { total: number; matched: number; percentage: number }> = {};
  const missingWords: Record<string, string[]> = {};

  for (const [domain, list] of Object.entries(TEST_LISTS)) {
    let matched = 0;
    const missing: string[] = [];

    for (const word of list) {
      const clean = word.trim();
      const resolved = devanagariMap.get(clean) || devanagariMap.get(removeNuqta(clean));
      if (resolved) {
        matched++;
      } else {
        missing.push(clean);
      }
    }

    const percentage = Math.round((matched / list.length) * 100);
    domainCoverage[domain] = {
      total: list.length,
      matched,
      percentage
    };
    missingWords[domain] = missing;
  }

  // Top 10 Rhyme Keys
  const sortedRhymeKeys = Object.entries(rhymeKeyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const topRhymeKeys: Record<string, number> = Object.fromEntries(sortedRhymeKeys);

  return {
    totalWords: corpus.length,
    uniqueDevanagari: new Set(corpus.map(w => w.devanagari)).size,
    uniqueUrdu: urduSet.size,
    uniqueRomanForms: romanFormsSet.size,
    uniqueAliases: aliasesSet.size,
    withPronunciation,
    withSyllables,
    withRhymeKey,
    withMeaning,
    byOrigin,
    byRegister,
    byCategory,
    bySyllableCount,
    topRhymeKeys,
    domainCoverage,
    missingWords,
    missingRomanMappings,
    missingPronunciation,
    missingRhymeIndex
  };
}

export function printAuditReport(report: AuditReport) {
  console.log('\n=================================================================');
  console.log('📊 BHASHA CORPUS AUDIT REPORT');
  console.log('=================================================================\n');

  console.log('LEXICAL TOTALS & COMPLETENESS:');
  console.log(`  Total lexical entries:    ${report.totalWords.toLocaleString()}`);
  console.log(`  Unique Devanagari words:  ${report.uniqueDevanagari.toLocaleString()}`);
  console.log(`  Unique Urdu entries:      ${report.uniqueUrdu.toLocaleString()}`);
  console.log(`  Unique Roman forms:       ${report.uniqueRomanForms.toLocaleString()}`);
  console.log(`  Unique Aliases:           ${report.uniqueAliases.toLocaleString()}`);
  console.log(`  Words with Pronunciation: ${report.withPronunciation.toLocaleString()} (${Math.round((report.withPronunciation/report.totalWords)*100)}%)`);
  console.log(`  Words with Syllable Data: ${report.withSyllables.toLocaleString()} (${Math.round((report.withSyllables/report.totalWords)*100)}%)`);
  console.log(`  Words with Rhyme Keys:    ${report.withRhymeKey.toLocaleString()} (${Math.round((report.withRhymeKey/report.totalWords)*100)}%)`);
  console.log(`  Words with Meanings:      ${report.withMeaning.toLocaleString()} (${Math.round((report.withMeaning/report.totalWords)*100)}%)`);

  console.log('\nDISTRIBUTION BY ORIGIN:');
  for (const [orig, count] of Object.entries(report.byOrigin)) {
    console.log(`  - ${orig.padEnd(20)}: ${count}`);
  }

  console.log('\nDISTRIBUTION BY REGISTER:');
  for (const [reg, count] of Object.entries(report.byRegister)) {
    console.log(`  - ${reg.padEnd(20)}: ${count}`);
  }

  console.log('\nDISTRIBUTION BY CATEGORY:');
  for (const [cat, count] of Object.entries(report.byCategory)) {
    console.log(`  - ${cat.padEnd(20)}: ${count}`);
  }

  console.log('\nDISTRIBUTION BY SYLLABLE COUNT:');
  for (const [syl, count] of Object.entries(report.bySyllableCount)) {
    console.log(`  - ${syl} Syllable(s):`.padEnd(22) + `${count}`);
  }

  console.log('\nTOP RHYME KEYS:');
  for (const [key, count] of Object.entries(report.topRhymeKeys)) {
    console.log(`  - /${key}/`.padEnd(22) + `${count} words`);
  }

  console.log('\n=================================================================');
  console.log('🎯 SONGWRITING DOMAIN COVERAGE');
  console.log('=================================================================\n');

  for (const [domain, stat] of Object.entries(report.domainCoverage)) {
    const bar = '█'.repeat(Math.round(stat.percentage / 5)) + '░'.repeat(20 - Math.round(stat.percentage / 5));
    console.log(`  ${domain.padEnd(35)} [${bar}] ${stat.percentage}% (${stat.matched}/${stat.total})`);
  }

  console.log('\nMISSING WORDS BY DOMAIN:');
  let hasMissing = false;
  for (const [domain, words] of Object.entries(report.missingWords)) {
    if (words.length > 0) {
      hasMissing = true;
      console.log(`  ❌ ${domain} (${words.length} missing): ${words.join(', ')}`);
    }
  }
  if (!hasMissing) {
    console.log('  ✅ Zero missing words across all evaluated songwriting domains!');
  }

  console.log('\n=================================================================\n');
}

// Direct Execution
if (require.main === module) {
  const report = runCorpusAudit();
  printAuditReport(report);
}
