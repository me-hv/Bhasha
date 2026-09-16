'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  BookOpen,
  Sparkles,
  Flame,
  Bookmark,
  Music,
  ArrowRight,
  X
} from 'lucide-react';
import { getRhymes, getWord, searchDictionary } from '../../lib/language-engine';
import { useSongs } from '../../hooks/useSongs';
import { WordEntry, RhymeResult } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: WordEntry) => void;
  onSelectRhyme?: (rhyme: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectWord,
  onSelectRhyme,
}) => {
  const router = useRouter();
  const { songs, createSong, selectSong } = useSongs();
  const [query, setQuery] = useState('');
  const [rhymeResult, setRhymeResult] = useState<RhymeResult | null>(null);
  const [matchingWords, setMatchingWords] = useState<WordEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
      setRhymeResult(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setRhymeResult(null);
      setMatchingWords([]);
      return;
    }

    const rhymes = getRhymes(query);
    setRhymeResult(rhymes);

    const words = searchDictionary(query, 5);
    setMatchingWords(words);
  }, [query]);

  if (!isOpen) return null;

  const handleCreateNewSong = () => {
    const newSong = createSong('UNTITLED TRACK', 92, 'Am');
    onClose();
    router.push(`/write?id=${newSong.id}`);
  };

  const handleSelectSong = (songId: string) => {
    selectSong(songId);
    onClose();
    router.push(`/write?id=${songId}`);
  };

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-obsidian-925 border border-obsidian-700/80 rounded-lg shadow-panel overflow-hidden text-obsidian-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-obsidian-700/60 bg-obsidian-950">
          <Search className="w-4 h-4 text-accent" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Hindi or Roman Hindi... (e.g. raat, dil, pyaar, khwaab)"
            className="flex-1 bg-transparent text-sm text-obsidian-100 placeholder-obsidian-500 focus:outline-none font-mono"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-obsidian-500 hover:text-white rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-900 text-obsidian-500 border border-obsidian-700/50">
              ESC
            </span>
          )}
        </div>

        {/* Results / Navigation Body */}
        <div className="max-h-[55vh] overflow-y-auto p-2 space-y-3">
          {/* Live Rhyme Search Resolution */}
          {rhymeResult && rhymeResult.totalMatches > 0 && (
            <div className="p-3 rounded bg-obsidian-950 border border-obsidian-700/60">
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono text-obsidian-500">Root:</span>
                  <span className="text-lg font-bold font-devanagari text-white">
                    {rhymeResult.resolvedDevanagari}
                  </span>
                  {rhymeResult.resolvedWord && (
                    <span className="text-xs font-mono text-accent">
                      {rhymeResult.resolvedWord.pronunciation}
                    </span>
                  )}
                </div>

                {rhymeResult.resolvedWord && onSelectWord && (
                  <button
                    onClick={() => {
                      onSelectWord(rhymeResult.resolvedWord!);
                      onClose();
                    }}
                    className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Rhyme Groupings */}
              <div className="space-y-2 mt-2">
                {rhymeResult.perfect.length > 0 && (
                  <div>
                    <span className="text-[9px] font-mono font-semibold text-rhyme-perfect uppercase tracking-wider block mb-1">
                      PERFECT RHYMES
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rhymeResult.perfect.slice(0, 6).map((r) => (
                        <button
                          key={r.word}
                          onClick={() => {
                            if (onSelectRhyme) onSelectRhyme(r.word);
                            const w = getWord(r.word);
                            if (w && onSelectWord) onSelectWord(w);
                            onClose();
                          }}
                          className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 hover:border-rhyme-perfect text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                        >
                          {r.word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {rhymeResult.strong.length > 0 && (
                  <div>
                    <span className="text-[9px] font-mono font-semibold text-rhyme-strong uppercase tracking-wider block mb-1">
                      STRONG ASSONANCES
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rhymeResult.strong.slice(0, 6).map((r) => (
                        <button
                          key={r.word}
                          onClick={() => {
                            if (onSelectRhyme) onSelectRhyme(r.word);
                            const w = getWord(r.word);
                            if (w && onSelectWord) onSelectWord(w);
                            onClose();
                          }}
                          className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 hover:border-rhyme-strong text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                        >
                          {r.word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Word Dictionary Matches */}
          {matchingWords.length > 0 && (
            <div>
              <span className="text-[9px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider px-2 block mb-1">
                WORDS
              </span>
              <div className="space-y-0.5">
                {matchingWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      if (onSelectWord) onSelectWord(word);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded hover:bg-obsidian-900 border border-transparent hover:border-obsidian-700/60 text-left transition-fast group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold font-devanagari text-white group-hover:text-accent transition-fast">
                        {word.devanagari}
                      </span>
                      <span className="text-xs font-mono text-obsidian-500">
                        /{word.roman}/
                      </span>
                      <span className="text-xs text-obsidian-400 truncate max-w-[260px]">
                        {word.meaning}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-obsidian-600 group-hover:text-obsidian-300">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions Navigation */}
          <div>
            <span className="text-[9px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider px-2 block mb-1">
              ACTIONS
            </span>
            <div className="space-y-0.5">
              <button
                onClick={handleCreateNewSong}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-obsidian-900 text-xs text-obsidian-300 hover:text-white transition-fast group"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>Create New Song</span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">⌘N</span>
              </button>

              <button
                onClick={() => handleNavigate('/explore/rhymes')}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-obsidian-900 text-xs text-obsidian-300 hover:text-white transition-fast group"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-3.5 h-3.5 text-rhyme-perfect" />
                  <span>Explore Rhymes</span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">Phonetics</span>
              </button>

              <button
                onClick={() => handleNavigate('/explore/words')}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-obsidian-900 text-xs text-obsidian-300 hover:text-white transition-fast group"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-rhyme-strong" />
                  <span>Word Directory</span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">150+ Words</span>
              </button>

              <button
                onClick={() => handleNavigate('/explore/prompts')}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-obsidian-900 text-xs text-obsidian-300 hover:text-white transition-fast group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-rhyme-near" />
                  <span>Songwriting Ideas</span>
                </div>
                <span className="text-[10px] font-mono text-obsidian-500">Prompts</span>
              </button>
            </div>
          </div>

          {/* Recent Songs */}
          {songs.length > 0 && (
            <div>
              <span className="text-[9px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider px-2 block mb-1">
                SONGS
              </span>
              <div className="space-y-0.5">
                {songs.slice(0, 3).map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSelectSong(song.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded hover:bg-obsidian-900 text-xs text-obsidian-300 hover:text-white transition-fast group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Music className="w-3.5 h-3.5 text-obsidian-500 group-hover:text-accent" />
                      <span className="font-mono text-xs truncate">{song.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      {song.bpm} BPM
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-obsidian-700/50 bg-obsidian-950 text-[10px] font-mono text-obsidian-500">
          <span>↑↓ Navigate · ↵ Select · ESC Close</span>
          <span>BHASHA</span>
        </div>
      </div>
    </div>
  );
};
