'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Info
} from 'lucide-react';
import { WORDS_DATABASE } from '../../../data/words';
import { useLexicon } from '../../../hooks/useLexicon';
import { WordDetailModal } from '../../../components/words/WordDetailModal';
import { WordEntry } from '../../../types';

const MOOD_FILTERS = [
  'All',
  'Dark',
  'Street',
  'Hustle',
  'Ambition',
  'Emotional',
  'Philosophy',
  'Battle',
  'Loyalty',
  'Pain',
  'Love',
];

export default function WordsDirectoryPage() {
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);

  const { isSaved, addWord, removeWord } = useLexicon();

  const filteredWords = React.useMemo(() => {
    let list = WORDS_DATABASE;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(w => (
        w.devanagari.includes(q) ||
        w.roman.toLowerCase().includes(q) ||
        w.aliases.some(a => a.toLowerCase().includes(q)) ||
        w.meaning.toLowerCase().includes(q) ||
        w.relatedImagery.some(img => img.includes(q))
      ));
    }

    if (selectedMood !== 'All') {
      list = list.filter(w => w.moods.some(m => m.toLowerCase() === selectedMood.toLowerCase()));
    }

    return list;
  }, [query, selectedMood]);

  const handleToggleSave = (word: WordEntry) => {
    const saved = isSaved(word.devanagari);
    if (saved) {
      removeWord(word.devanagari);
    } else {
      addWord({
        id: word.id,
        devanagari: word.devanagari,
        roman: word.roman,
        meaning: word.meaning,
        pronunciation: word.pronunciation,
        tags: word.moods,
        perfectRhymes: word.perfectRhymes,
        strongRhymes: word.strongRhymes,
        nearRhymes: word.nearRhymes,
        relatedImagery: word.relatedImagery,
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 overflow-y-auto p-6 sm:p-12 md:p-16 select-none animate-fade-in">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-obsidian-700/60">
          <span className="text-xs font-mono text-obsidian-500 uppercase tracking-widest block mb-1">
            EXPLORATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-obsidian-50 font-sans tracking-tight">
            Word Lexicon Directory
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-400 font-sans mt-1">
            Essential vocabulary, pronunciations, and rhyme networks for Hindi/Hinglish lyricists.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-obsidian-925 border border-obsidian-700/60 focus-within:border-accent">
          <Search className="w-4 h-4 text-accent" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words by Hindi, Roman, meaning, or imagery..."
            className="w-full bg-transparent text-xs sm:text-sm font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none"
          />
        </div>

        {/* Mood Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {MOOD_FILTERS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast whitespace-nowrap ${
                selectedMood === mood
                  ? 'bg-obsidian-100 text-obsidian-950 font-bold'
                  : 'bg-obsidian-925 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => {
            const saved = isSaved(word.devanagari);

            return (
              <div
                key={word.id}
                className="p-4 rounded-lg bg-obsidian-925 border border-obsidian-700/60 hover:border-obsidian-600 transition-fast flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  {/* Card Top */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-bold font-devanagari text-white group-hover:text-accent transition-fast">
                          {word.devanagari}
                        </h3>
                        <span className="text-xs font-mono text-obsidian-400">
                          /{word.roman}/
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-accent">
                        {word.pronunciation}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleSave(word)}
                      className={`p-1.5 rounded border transition-fast ${
                        saved
                          ? 'bg-accent/15 border-accent text-accent'
                          : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white'
                      }`}
                      title={saved ? 'Saved in Lexicon' : '+ Save to Lexicon'}
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4 text-accent" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Meaning */}
                  <p className="text-xs text-obsidian-300 font-sans line-clamp-2">
                    {word.meaning}
                  </p>

                  {/* Mood Tags */}
                  <div className="flex flex-wrap gap-1">
                    {word.moods.slice(0, 3).map((m) => (
                      <span
                        key={m}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-obsidian-950 text-obsidian-500 border border-obsidian-700/40"
                      >
                        #{m}
                      </span>
                    ))}
                  </div>

                  {/* Rhymes Preview */}
                  <div className="pt-2 border-t border-obsidian-700/40">
                    <span className="text-[9px] font-mono font-semibold text-rhyme-perfect uppercase tracking-wider block mb-1">
                      KEY RHYMES
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[...word.perfectRhymes.slice(0, 3), ...word.strongRhymes.slice(0, 2)].map((r) => (
                        <span
                          key={r}
                          className="text-[11px] font-devanagari px-1.5 py-0.2 rounded bg-obsidian-950 border border-obsidian-700/40 text-obsidian-300"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-obsidian-700/40 text-xs font-mono text-obsidian-500">
                  <span>
                    {word.origin} · {word.syllables} Syl
                  </span>

                  <button
                    onClick={() => setInspectingWord(word)}
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    <span>Full Card</span>
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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
