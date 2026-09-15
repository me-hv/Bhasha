'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Flame,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Info,
  Sparkles
} from 'lucide-react';
import { getRhymes, getWordDetails } from '../../../lib/rhyme-engine';
import { useLexicon } from '../../../hooks/useLexicon';
import { WordDetailModal } from '../../../components/words/WordDetailModal';
import { RhymeResult, WordEntry, RhymeMatch } from '../../../types';
import { copyToClipboard } from '../../../lib/utils/export';
import { EmptyState } from '../../../components/ui/EmptyState';

const QUICK_SUGGESTIONS = [
  { devanagari: 'रात', roman: 'raat' },
  { devanagari: 'बात', roman: 'baat' },
  { devanagari: 'दिल', roman: 'dil' },
  { devanagari: 'प्यार', roman: 'pyaar' },
  { devanagari: 'दर्द', roman: 'dard' },
  { devanagari: 'शहर', roman: 'shehar' },
  { devanagari: 'ख्वाब', roman: 'khwaab' },
  { devanagari: 'ज़िंदगी', roman: 'zindagi' },
  { devanagari: 'पैसा', roman: 'paisa' },
  { devanagari: 'नाम', roman: 'naam' },
  { devanagari: 'काम', roman: 'kaam' },
  { devanagari: 'रास्ता', roman: 'raasta' },
  { devanagari: 'जुनून', roman: 'junoon' },
  { devanagari: 'सुकून', roman: 'sukoon' },
  { devanagari: 'तन्हाई', roman: 'tanhai' },
  { devanagari: 'मुक़द्दर', roman: 'muqaddar' },
  { devanagari: 'आग', roman: 'aag' },
  { devanagari: 'वक़्त', roman: 'waqt' },
];

export default function RhymesExplorerPage() {
  const [query, setQuery] = useState('रात');
  const [rhymeResult, setRhymeResult] = useState<RhymeResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'perfect' | 'strong' | 'near' | 'cadence'>('all');
  const [syllableFilter, setSyllableFilter] = useState<'all' | '1' | '2' | '3+'>('all');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);

  const { isSaved, addWord, removeWord } = useLexicon();

  useEffect(() => {
    if (query.trim()) {
      const res = getRhymes(query);
      setRhymeResult(res);
    } else {
      setRhymeResult(null);
    }
  }, [query]);

  const handleCopy = (wordStr: string) => {
    copyToClipboard(wordStr);
    setCopiedWord(wordStr);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const handleToggleSave = (item: RhymeMatch) => {
    const saved = isSaved(item.word);
    if (saved) {
      removeWord(item.word);
    } else {
      const details = getWordDetails(item.word);
      addWord({
        devanagari: item.word,
        roman: item.roman,
        meaning: item.meaning || details?.meaning || '',
        pronunciation: details?.pronunciation || '',
        tags: details?.moods || ['Rhyme'],
        perfectRhymes: details?.perfectRhymes || [],
        strongRhymes: details?.strongRhymes || [],
        nearRhymes: details?.nearRhymes || [],
      });
    }
  };

  const filteredMatches = React.useMemo(() => {
    if (!rhymeResult) return [];

    let list: RhymeMatch[] = [];
    if (activeCategory === 'all') {
      list = [
        ...rhymeResult.perfect,
        ...rhymeResult.strong,
        ...rhymeResult.near,
        ...rhymeResult.cadence,
      ];
    } else if (activeCategory === 'perfect') {
      list = rhymeResult.perfect;
    } else if (activeCategory === 'strong') {
      list = rhymeResult.strong;
    } else if (activeCategory === 'near') {
      list = rhymeResult.near;
    } else if (activeCategory === 'cadence') {
      list = rhymeResult.cadence;
    }

    if (syllableFilter !== 'all') {
      if (syllableFilter === '1') {
        list = list.filter(m => m.syllables === 1);
      } else if (syllableFilter === '2') {
        list = list.filter(m => m.syllables === 2);
      } else if (syllableFilter === '3+') {
        list = list.filter(m => m.syllables >= 3);
      }
    }

    return list;
  }, [rhymeResult, activeCategory, syllableFilter]);

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto p-6 sm:p-12 md:p-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-obsidian-700/60">
          <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
            EXPLORATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
            Rhyme Engine
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
            Phonetic similarity and cadence finder. Type in Roman Hindi (e.g. "raat") or Devanagari.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 focus-within:border-accent transition-fast">
            <Search className="w-4 h-4 text-accent" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search word or rhyme... (e.g. raat, dil, pyaar, khwaab)"
              className="flex-1 bg-transparent text-sm sm:text-base font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none"
              autoFocus
            />
            {query && (
              <span className="text-xs font-mono text-obsidian-400 px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-700/50">
                Resolved: <strong className="text-white font-devanagari">{rhymeResult?.resolvedDevanagari}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Quick Roots */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-obsidian-500 whitespace-nowrap mr-1">
            Roots:
          </span>
          {QUICK_SUGGESTIONS.map((item) => (
            <button
              key={item.roman}
              onClick={() => setQuery(item.devanagari)}
              className={`px-2.5 py-1 rounded text-xs font-devanagari transition-fast whitespace-nowrap ${
                query === item.devanagari || query === item.roman
                  ? 'bg-accent/15 border border-accent text-accent'
                  : 'bg-obsidian-925 hover:bg-obsidian-900 border border-obsidian-700/50 text-obsidian-400 hover:text-white'
              }`}
            >
              {item.devanagari} <span className="text-[10px] font-mono text-obsidian-500">/{item.roman}/</span>
            </button>
          ))}
        </div>

        {/* Active Word Overview Card */}
        {rhymeResult?.resolvedWord && (
          <div className="p-4 rounded-lg bg-obsidian-925 border border-obsidian-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold font-devanagari text-white">
                  {rhymeResult.resolvedWord.devanagari}
                </span>
                <span className="text-xs font-mono text-obsidian-400">
                  /{rhymeResult.resolvedWord.roman}/
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-950 text-accent border border-obsidian-700/50">
                  {rhymeResult.resolvedWord.pronunciation}
                </span>
              </div>
              <p className="text-xs text-obsidian-300 font-sans">
                {rhymeResult.resolvedWord.meaning}
              </p>
            </div>

            <button
              onClick={() => setInspectingWord(rhymeResult.resolvedWord!)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-white transition-fast whitespace-nowrap self-start sm:self-auto"
            >
              <Info className="w-3.5 h-3.5 text-accent" />
              <span>Full Word Card</span>
            </button>
          </div>
        )}

        {/* Category & Syllable Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-obsidian-700/50">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast ${
                activeCategory === 'all'
                  ? 'bg-obsidian-100 text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
              }`}
            >
              All ({rhymeResult?.totalMatches || 0})
            </button>
            <button
              onClick={() => setActiveCategory('perfect')}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast ${
                activeCategory === 'perfect'
                  ? 'bg-rhyme-perfect text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-rhyme-perfect hover:bg-obsidian-900'
              }`}
            >
              Perfect ({rhymeResult?.perfect.length || 0})
            </button>
            <button
              onClick={() => setActiveCategory('strong')}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast ${
                activeCategory === 'strong'
                  ? 'bg-rhyme-strong text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-rhyme-strong hover:bg-obsidian-900'
              }`}
            >
              Strong ({rhymeResult?.strong.length || 0})
            </button>
            <button
              onClick={() => setActiveCategory('near')}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast ${
                activeCategory === 'near'
                  ? 'bg-rhyme-near text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-rhyme-near hover:bg-obsidian-900'
              }`}
            >
              Near ({rhymeResult?.near.length || 0})
            </button>
            <button
              onClick={() => setActiveCategory('cadence')}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast ${
                activeCategory === 'cadence'
                  ? 'bg-rhyme-cadence text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-rhyme-cadence hover:bg-obsidian-900'
              }`}
            >
              Cadence ({rhymeResult?.cadence.length || 0})
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-obsidian-500 mr-1">Syllables:</span>
            {(['all', '1', '2', '3+'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSyllableFilter(s)}
                className={`px-2 py-0.5 rounded border transition-fast ${
                  syllableFilter === s
                    ? 'bg-obsidian-800 border-accent text-accent'
                    : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : `${s} Syl`}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((item) => {
              const saved = isSaved(item.word);
              const isCopied = copiedWord === item.word;

              let badgeColor = 'text-rhyme-perfect border-rhyme-perfect/30';
              if (item.category === 'strong') badgeColor = 'text-rhyme-strong border-rhyme-strong/30';
              if (item.category === 'near') badgeColor = 'text-rhyme-near border-rhyme-near/30';
              if (item.category === 'cadence') badgeColor = 'text-rhyme-cadence border-rhyme-cadence/30';

              return (
                <div
                  key={item.word}
                  className="p-3.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-lg font-bold font-devanagari text-white group-hover:text-accent transition-fast">
                          {item.word}
                        </span>
                        {item.roman && item.roman !== item.word && (
                          <span className="text-[11px] font-mono text-obsidian-500 block">
                            /{item.roman}/
                          </span>
                        )}
                      </div>

                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border bg-obsidian-950 uppercase ${badgeColor}`}>
                        {item.category}
                      </span>
                    </div>

                    {item.meaning && (
                      <p className="text-[11px] text-obsidian-400 font-sans mt-1 line-clamp-2">
                        {item.meaning}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-obsidian-700/40 text-[10px] font-mono text-obsidian-500">
                    <span>
                      {item.syllables} {item.syllables === 1 ? 'Syl' : 'Syls'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(item.word)}
                        className="p-1 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-900 transition-fast"
                        title="Copy word"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleSave(item)}
                        className={`p-1 rounded transition-fast ${
                          saved
                            ? 'text-accent'
                            : 'text-obsidian-500 hover:text-white hover:bg-obsidian-900'
                        }`}
                        title={saved ? 'Remove from Lexicon' : 'Save to Lexicon'}
                      >
                        {saved ? (
                          <BookmarkCheck className="w-3.5 h-3.5 fill-accent/20" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const w = getWordDetails(item.word);
                          if (w) setInspectingWord(w);
                        }}
                        className="p-1 text-obsidian-500 hover:text-accent rounded hover:bg-obsidian-900 transition-fast"
                        title="Inspect Details"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-obsidian-500 font-mono text-xs">
              <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-30 text-accent" />
              <p>No rhymes found matching your filters</p>
              <p className="text-[11px] text-obsidian-600 mt-1">
                Try searching for "raat", "dil", "pyaar", "khwaab"
              </p>
            </div>
          )}
        </div>
      </div>

      <WordDetailModal
        word={inspectingWord}
        isOpen={!!inspectingWord}
        onClose={() => setInspectingWord(null)}
      />
    </div>
  );
}
