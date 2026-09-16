'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Bookmark,
  BookmarkCheck,
  Plus,
  Flame,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { getRhymes, getWord } from '../../lib/language-engine/rhyme-engine';
import { useLexicon } from '../../hooks/useLexicon';
import { RhymeResult, WordEntry, RhymeTarget } from '../../types';
import { Target } from 'lucide-react';

interface RhymeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWord: string;
  onInsertWord: (word: string) => void;
  onViewWordDetails?: (word: WordEntry) => void;
  pinnedTarget?: RhymeTarget | null;
  onSetRhymeTarget?: (word: string) => void;
  onClearRhymeTarget?: () => void;
}

export const RhymeDrawer: React.FC<RhymeDrawerProps> = ({
  isOpen,
  onClose,
  selectedWord,
  onInsertWord,
  onViewWordDetails,
  pinnedTarget,
  onSetRhymeTarget,
  onClearRhymeTarget,
}) => {
  const [searchTerm, setSearchTerm] = useState(selectedWord);
  const [rhymeData, setRhymeData] = useState<RhymeResult | null>(null);
  const { isSaved, addWord, removeWord } = useLexicon();

  useEffect(() => {
    setSearchTerm(selectedWord);
  }, [selectedWord]);

  useEffect(() => {
    if (searchTerm && searchTerm.trim()) {
      const result = getRhymes(searchTerm);
      setRhymeData(result);
    } else {
      setRhymeData(null);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  const currentDevanagari = rhymeData?.resolvedDevanagari || searchTerm;
  const saved = currentDevanagari ? isSaved(currentDevanagari) : false;
  const wordEntry = rhymeData?.resolvedWord || getWord(currentDevanagari);

  const toggleSave = () => {
    if (!currentDevanagari) return;
    if (saved) {
      removeWord(currentDevanagari);
    } else {
      addWord({
        devanagari: currentDevanagari,
        roman: wordEntry?.roman || searchTerm,
        meaning: wordEntry?.meaning || '',
        pronunciation: wordEntry?.pronunciation || '',
        tags: wordEntry?.moods || ['Rhyme'],
        perfectRhymes: rhymeData?.perfect.map(p => p.word) || [],
        strongRhymes: rhymeData?.strong.map(s => s.word) || [],
        nearRhymes: rhymeData?.near.map(n => n.word) || [],
        relatedImagery: wordEntry?.relatedImagery || [],
        relatedGraph: wordEntry?.relatedGraph,
      });
    }
  };

  return (
    <div className="w-80 sm:w-88 md:w-96 h-full bg-obsidian-925 border-l border-obsidian-700/60 flex flex-col justify-between shadow-panel select-none z-20 animate-fade-in">
      {/* Header & Word Banner */}
      <div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-obsidian-700/60 bg-obsidian-950">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-rhyme-perfect" />
            <span className="text-xs font-mono font-semibold text-obsidian-200 tracking-wider">
              RHYME RACK
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-obsidian-500 hover:text-white rounded hover:bg-obsidian-850 transition-fast"
            title="Close Drawer (Esc or ⌘B)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-obsidian-700/50 bg-obsidian-925">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-obsidian-950 border border-obsidian-700/60 focus-within:border-accent">
            <Search className="w-3.5 h-3.5 text-accent" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search word or rhyme... (e.g. raat, saath)"
              className="w-full bg-transparent text-xs font-mono text-obsidian-100 placeholder-obsidian-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Word Title & Pronunciation Header */}
        {currentDevanagari && (
          <div className="px-4 py-3.5 bg-obsidian-900 border-b border-obsidian-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl font-bold font-devanagari text-white">
                  {currentDevanagari}
                </span>
                {wordEntry?.urdu && (
                  <span className="text-lg font-serif text-amber-200/80 px-1 py-0.2 rounded bg-obsidian-950 border border-obsidian-800" title="Urdu Script">
                    {wordEntry.urdu}
                  </span>
                )}
                {wordEntry?.pronunciation && (
                  <span className="text-xs font-mono text-obsidian-400">
                    {wordEntry.pronunciation}
                  </span>
                )}
              </div>
              {wordEntry?.meaning && (
                <p className="text-[11px] text-obsidian-400 font-sans line-clamp-1">
                  {wordEntry.meaning}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {onSetRhymeTarget && (
                <button
                  onClick={() => {
                    if (pinnedTarget?.devanagari === currentDevanagari && onClearRhymeTarget) {
                      onClearRhymeTarget();
                    } else {
                      onSetRhymeTarget(currentDevanagari);
                    }
                  }}
                  className={`p-1.5 rounded border transition-fast ${
                    pinnedTarget?.devanagari === currentDevanagari
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-amber-400 hover:bg-obsidian-850'
                  }`}
                  title={
                    pinnedTarget?.devanagari === currentDevanagari
                      ? 'Pinned as Rhyme Target (Click to unpin)'
                      : 'Pin as Rhyme Target'
                  }
                >
                  <Target className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={toggleSave}
                className={`p-1.5 rounded border transition-fast ${
                  saved
                    ? 'bg-accent/15 border-accent text-accent'
                    : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-850'
                }`}
                title={saved ? 'Saved in Lexicon' : '+ Save to Lexicon'}
              >
                {saved ? (
                  <BookmarkCheck className="w-4 h-4 text-accent" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              {wordEntry && onViewWordDetails && (
                <button
                  onClick={() => onViewWordDetails(wordEntry)}
                  className="p-1.5 rounded bg-obsidian-950 border border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-850 transition-fast"
                  title="Full Word Details Card"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Rhyme Rack Sections: PERFECT, STRONG, NEAR, MULTI-SYLLABLES, RELATED */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-270px)]">
          {rhymeData && rhymeData.totalMatches > 0 ? (
            <>
              {/* PERFECT RHYMES (1.00) */}
              {rhymeData.perfect.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold text-rhyme-perfect uppercase tracking-wider">
                      PERFECT
                    </span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      Score: 1.00
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rhymeData.perfect.map((r) => (
                      <button
                        key={r.word}
                        onClick={() => onInsertWord(r.word)}
                        className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-rhyme-perfect text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                        title={`Score: ${r.score.toFixed(2)} · Click to insert`}
                      >
                        <span>{r.word}</span>
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rhyme-perfect transition-fast" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STRONG ASSONANCES (0.85 - 0.95) */}
              {rhymeData.strong.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold text-rhyme-strong uppercase tracking-wider">
                      STRONG
                    </span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      Score: 0.88–0.94
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rhymeData.strong.map((r) => (
                      <button
                        key={r.word}
                        onClick={() => onInsertWord(r.word)}
                        className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-rhyme-strong text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                        title={`Score: ${r.score.toFixed(2)} · Click to insert`}
                      >
                        <span>{r.word}</span>
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rhyme-strong transition-fast" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NEAR / SLANT RHYMES (0.50 - 0.75) */}
              {rhymeData.near.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold text-rhyme-near uppercase tracking-wider">
                      NEAR
                    </span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      Score: 0.50–0.72
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rhymeData.near.map((r) => (
                      <button
                        key={r.word}
                        onClick={() => onInsertWord(r.word)}
                        className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-rhyme-near text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                        title={`Score: ${r.score.toFixed(2)} · Click to insert`}
                      >
                        <span>{r.word}</span>
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rhyme-near transition-fast" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MULTI-SYLLABLE CADENCES */}
              {((rhymeData.multisyllabic && rhymeData.multisyllabic.length > 0) || (rhymeData.multiSyllable && rhymeData.multiSyllable.length > 0)) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold text-accent uppercase tracking-wider">
                      MULTISYLLABIC
                    </span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      Cadence: 2+ Syls
                    </span>
                  </div>
                  {rhymeData.multisyllabic && rhymeData.multisyllabic.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {rhymeData.multisyllabic.map((r) => (
                        <button
                          key={r.word}
                          onClick={() => onInsertWord(r.word)}
                          className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-accent/40 hover:border-accent text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          title={`Multisyllabic cadence · Score: ${r.score.toFixed(2)}`}
                        >
                          <span>{r.word}</span>
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-accent transition-fast" />
                        </button>
                      ))}
                    </div>
                  )}
                  {rhymeData.multiSyllable && rhymeData.multiSyllable.length > 0 && (
                    <div className="space-y-1">
                      {rhymeData.multiSyllable.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => onInsertWord(p.phraseOrWord)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast group"
                        >
                          <span>{p.phraseOrWord}</span>
                          <span className="text-[10px] font-mono text-obsidian-500 group-hover:text-accent">
                            {p.syllables} Syls
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CONSONANCE RHYMES */}
              {rhymeData.consonance && rhymeData.consonance.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold text-obsidian-400 uppercase tracking-wider">
                      CONSONANCE
                    </span>
                    <span className="text-[10px] font-mono text-obsidian-500">
                      Matching Coda
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rhymeData.consonance.map((r) => (
                      <button
                        key={r.word}
                        onClick={() => onInsertWord(r.word)}
                        className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-obsidian-400 text-xs font-devanagari text-obsidian-300 hover:text-white transition-fast"
                        title={`Consonance · Score: ${r.score.toFixed(2)}`}
                      >
                        <span>{r.word}</span>
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-obsidian-400 transition-fast" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* RELATED WORD GRAPH (VISUAL, EMOTION, SOUND, PLACE) */}
              {wordEntry?.relatedGraph ? (
                <div className="pt-4 border-t border-obsidian-700/50 space-y-3">
                  <span className="text-[10px] font-mono font-semibold text-obsidian-400 uppercase tracking-wider block">
                    RELATED WORD GRAPH
                  </span>

                  {/* Visual */}
                  {wordEntry.relatedGraph.visual && (
                    <div>
                      <span className="text-[9px] font-mono text-obsidian-500 uppercase block mb-1">
                        Visual & Imagery
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.visual.map((img) => (
                          <button
                            key={img}
                            onClick={() => setSearchTerm(img)}
                            className="px-2 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/40 text-[11px] font-devanagari text-obsidian-300 hover:text-white transition-fast"
                          >
                            {img}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emotion */}
                  {wordEntry.relatedGraph.emotion && (
                    <div>
                      <span className="text-[9px] font-mono text-obsidian-500 uppercase block mb-1">
                        Emotion & Mood
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.emotion.map((emo) => (
                          <button
                            key={emo}
                            onClick={() => setSearchTerm(emo)}
                            className="px-2 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/40 text-[11px] font-devanagari text-obsidian-300 hover:text-white transition-fast"
                          >
                            {emo}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sound */}
                  {wordEntry.relatedGraph.sound && (
                    <div>
                      <span className="text-[9px] font-mono text-obsidian-500 uppercase block mb-1">
                        Sound & Rhythm
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.sound.map((snd) => (
                          <button
                            key={snd}
                            onClick={() => setSearchTerm(snd)}
                            className="px-2 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/40 text-[11px] font-devanagari text-obsidian-300 hover:text-white transition-fast"
                          >
                            {snd}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Place */}
                  {wordEntry.relatedGraph.place && (
                    <div>
                      <span className="text-[9px] font-mono text-obsidian-500 uppercase block mb-1">
                        Place & Setting
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.place.map((plc) => (
                          <button
                            key={plc}
                            onClick={() => setSearchTerm(plc)}
                            className="px-2 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/40 text-[11px] font-devanagari text-obsidian-300 hover:text-white transition-fast"
                          >
                            {plc}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : wordEntry && wordEntry.relatedImagery.length > 0 ? (
                <div className="pt-4 border-t border-obsidian-700/50">
                  <span className="text-[10px] font-mono font-semibold text-obsidian-400 uppercase tracking-wider block mb-2">
                    RELATED
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wordEntry.relatedImagery.map((img) => (
                      <button
                        key={img}
                        onClick={() => setSearchTerm(img)}
                        className="px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 text-xs font-devanagari text-obsidian-300 hover:text-white transition-fast"
                      >
                        {img}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="py-12 text-center text-obsidian-500 font-mono text-xs">
              <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-30 text-accent" />
              <p>Type or click any word in your verse</p>
              <p className="text-[11px] text-obsidian-600 mt-1">
                Try: raat, saath, dil, pyaar, khwaab
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-obsidian-700/60 bg-obsidian-950 text-[10px] font-mono text-obsidian-500 text-center">
        Click any word to insert at cursor
      </div>
    </div>
  );
};
