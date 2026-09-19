'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  X,
  Layers,
  Activity,
  PenTool,
  Save,
  Download,
  History,
  FileText,
  Lightbulb
} from 'lucide-react';
import { getRhymes, getWord, searchDictionary } from '../../lib/language-engine';
import { searchService, GlobalSearchResult } from '../../lib/services/search-service';
import { useSongs } from '../../hooks/useSongs';
import { useLexicon } from '../../hooks/useLexicon';
import { useIdeas } from '../../hooks/useIdeas';
import { WordEntry, RhymeResult, Song, SavedWord, CreativeIdea } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord?: (word: WordEntry) => void;
  onSelectRhyme?: (rhyme: string) => void;
  onTriggerAction?: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectWord,
  onSelectRhyme,
  onTriggerAction,
}) => {
  const router = useRouter();
  const { songs, createSong, selectSong } = useSongs();
  const { lexicon } = useLexicon();
  const { ideas } = useIdeas();

  const [query, setQuery] = useState('');
  const [globalResults, setGlobalResults] = useState<GlobalSearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
      setGlobalResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setGlobalResults(null);
      return;
    }

    const res = searchService.globalSearch(query, songs, lexicon, ideas);
    setGlobalResults(res);
  }, [query, songs, lexicon, ideas]);

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 p-2.5 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-obsidian-925 border border-obsidian-700/80 rounded-lg shadow-panel overflow-hidden text-obsidian-50 max-h-[88dvh] sm:max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-obsidian-700/60 bg-obsidian-950">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, lyrics, lexicon, ideas... (⌘P)"
            className="flex-1 bg-transparent text-sm text-obsidian-100 placeholder-obsidian-500 focus:outline-none font-mono"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-obsidian-500 hover:text-white rounded touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-[10px] font-mono px-2 py-1 rounded bg-obsidian-900 text-obsidian-500 border border-obsidian-700/50 touch-manipulation"
            >
              ESC
            </button>
          )}
        </div>

        {/* Results / Navigation Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {/* Live Global Search Results */}
          {globalResults && (
            <div className="space-y-3">
              {/* Songs & Lyrics Matches */}
              {globalResults.songs.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-500 px-2 block">
                    SONGS & LYRICS ({globalResults.songs.length})
                  </span>
                  {globalResults.songs.map(({ song, matchType, matchedSnippet }) => (
                    <div
                      key={song.id}
                      onClick={() => handleSelectSong(song.id)}
                      className="p-2.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-800 transition-fast cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Music className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-mono font-bold text-white">
                            {song.title}
                          </span>
                          <span className="text-[10px] font-mono text-obsidian-500">
                            ({matchType})
                          </span>
                        </div>
                        {matchedSnippet && (
                          <p className="text-[11px] font-devanagari text-obsidian-300 pl-5 line-clamp-1">
                            &quot;{matchedSnippet}&quot;
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-obsidian-500" />
                    </div>
                  ))}
                </div>
              )}

              {/* Lexicon Matches */}
              {globalResults.lexicon.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-500 px-2 block">
                    MY LEXICON ({globalResults.lexicon.length})
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {globalResults.lexicon.map((w) => (
                      <div
                        key={w.id || w.devanagari}
                        onClick={() => {
                          onClose();
                          router.push('/library/lexicon');
                        }}
                        className="p-2 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-800 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-devanagari font-bold text-white">
                            {w.devanagari}
                          </div>
                          <div className="text-[10px] font-mono text-obsidian-400">
                            /{w.roman}/
                          </div>
                        </div>
                        <Bookmark className="w-3.5 h-3.5 text-accent" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creative Ideas Matches */}
              {globalResults.ideas.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-500 px-2 block">
                    IDEAS & FRAGMENTS ({globalResults.ideas.length})
                  </span>
                  {globalResults.ideas.map((idea) => (
                    <div
                      key={idea.id}
                      onClick={() => {
                        onClose();
                        router.push('/library/ideas');
                      }}
                      className="p-2 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-800 cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-mono font-bold text-white">
                            {idea.title}
                          </span>
                          <span className="text-[10px] font-mono text-accent">
                            [{idea.type}]
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-obsidian-400 line-clamp-1 pl-5">
                          {idea.content}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-obsidian-500" />
                    </div>
                  ))}
                </div>
              )}

              {/* Live Rhyme Match Resolution */}
              {globalResults.rhymeResult && globalResults.rhymeResult.totalMatches > 0 && (
                <div className="p-3 rounded bg-obsidian-950 border border-obsidian-700/60">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono text-obsidian-500">Rhyme Root:</span>
                      <span className="text-lg font-bold font-devanagari text-white">
                        {globalResults.rhymeResult.resolvedDevanagari}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {globalResults.rhymeResult.perfect.slice(0, 8).map((rm) => (
                      <button
                        key={rm.wordId || rm.devanagari}
                        onClick={() => {
                          if (onSelectRhyme) onSelectRhyme(rm.devanagari);
                          onClose();
                        }}
                        className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 text-xs font-devanagari text-white border border-obsidian-700/40"
                      >
                        {rm.devanagari}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Studio Commands */}
          {!query.trim() && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-500 px-2 block">
                STUDIO ACTIONS
              </span>

              <button
                onClick={handleCreateNewSong}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-obsidian-900 transition-fast text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-xs font-mono text-obsidian-100 group-hover:text-white font-medium">
                      + New Song
                    </div>
                    <div className="text-[10px] font-sans text-obsidian-500">
                      Start writing with a clean canvas
                    </div>
                  </div>
                </div>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-950 text-obsidian-400 border border-obsidian-700/40">
                  ⌘N
                </kbd>
              </button>

              <button
                onClick={() => handleNavigate('/library/songs')}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-obsidian-900 transition-fast text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-obsidian-400" />
                  <div>
                    <div className="text-xs font-mono text-obsidian-100 group-hover:text-white font-medium">
                      Open Song Library
                    </div>
                    <div className="text-[10px] font-sans text-obsidian-500">
                      Browse all songs, versions and drafts
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-obsidian-600" />
              </button>

              <button
                onClick={() => handleNavigate('/library/lexicon')}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-obsidian-900 transition-fast text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-xs font-mono text-obsidian-100 group-hover:text-white font-medium">
                      Open My Lexicon
                    </div>
                    <div className="text-[10px] font-sans text-obsidian-500">
                      Personal saved vocabulary collections
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-obsidian-600" />
              </button>

              <button
                onClick={() => handleNavigate('/library/ideas')}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-obsidian-900 transition-fast text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <div>
                    <div className="text-xs font-mono text-obsidian-100 group-hover:text-white font-medium">
                      Open Ideas Library
                    </div>
                    <div className="text-[10px] font-sans text-obsidian-500">
                      Concepts, imagery and contrasts
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-obsidian-600" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-obsidian-700/60 bg-obsidian-950 flex items-center justify-between text-[11px] font-mono text-obsidian-500">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
