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
  Layers,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Heart,
  Volume2,
  MapPin,
  Tag
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

const INITIAL_DISPLAY_LIMIT = 12;

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
  const [activeTab, setActiveTab] = useState<'rhymes' | 'discovery'>('rhymes');
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});
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

  const toggleTierExpansion = (tierKey: string) => {
    setExpandedTiers((prev) => ({ ...prev, [tierKey]: !prev[tierKey] }));
  };

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
        perfectRhymes: rhymeData?.perfect.map((p) => p.word) || [],
        strongRhymes: rhymeData?.strong.map((s) => s.word) || [],
        nearRhymes: rhymeData?.near.map((n) => n.word) || [],
        relatedImagery: wordEntry?.relatedImagery || [],
        relatedGraph: wordEntry?.relatedGraph,
      });
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:relative md:w-96 md:inset-auto h-full bg-obsidian-925 border-l border-obsidian-700/60 flex flex-col justify-between shadow-2xl select-none animate-slide-up md:animate-fade-in">
        {/* Top Header & Search */}
        <div>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-obsidian-700/60 bg-obsidian-950">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rhyme-perfect" />
              <span className="text-xs font-mono font-semibold text-obsidian-200 tracking-wider">
                RHYME RACK
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-obsidian-400 hover:text-white rounded-lg hover:bg-obsidian-850 transition-fast touch-target flex items-center justify-center"
              title="Close Drawer (Esc or ⌘B)"
            >
              <X className="w-5 h-5" />
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

        {/* Word Title & Actions Header */}
        {currentDevanagari && (
          <div className="px-4 py-3 bg-obsidian-900 border-b border-obsidian-700/60 flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-bold font-devanagari text-white">
                  {currentDevanagari}
                </span>
                {wordEntry?.urdu && (
                  <span
                    className="text-base font-serif text-amber-200/80 px-1 py-0.2 rounded bg-obsidian-950 border border-obsidian-800"
                    title="Urdu Script"
                  >
                    {wordEntry.urdu}
                  </span>
                )}
                {wordEntry?.pronunciation && (
                  <span className="text-[11px] font-mono text-obsidian-400">
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

            <div className="flex items-center gap-1.5 flex-shrink-0">
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

        {/* View Switcher: RHYMES vs DISCOVERY & ASSOCIATIONS */}
        <div className="flex items-center px-4 py-1.5 bg-obsidian-950 border-b border-obsidian-700/50 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('rhymes')}
            className={`flex-1 py-1 text-center rounded transition-fast ${
              activeTab === 'rhymes'
                ? 'bg-obsidian-850 text-accent font-semibold border border-obsidian-700/60'
                : 'text-obsidian-500 hover:text-obsidian-300'
            }`}
          >
            Rhymes ({rhymeData?.totalMatches || 0})
          </button>
          <button
            onClick={() => setActiveTab('discovery')}
            className={`flex-1 py-1 text-center rounded transition-fast flex items-center justify-center gap-1 ${
              activeTab === 'discovery'
                ? 'bg-obsidian-850 text-cyan-400 font-semibold border border-obsidian-700/60'
                : 'text-obsidian-500 hover:text-obsidian-300'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Discovery</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-290px)]">
          {activeTab === 'rhymes' ? (
            rhymeData && rhymeData.totalMatches > 0 ? (
              <>
                {/* PERFECT RHYMES */}
                {rhymeData.perfect.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-rhyme-perfect uppercase tracking-wider">
                          PERFECT
                        </span>
                        <span className="text-[9px] font-mono text-obsidian-500">
                          · Exact Vowel & Coda
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-obsidian-500">
                        {rhymeData.perfect.length} matches
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(expandedTiers['perfect']
                        ? rhymeData.perfect
                        : rhymeData.perfect.slice(0, INITIAL_DISPLAY_LIMIT)
                      ).map((r) => (
                        <button
                          key={r.word}
                          onClick={() => onInsertWord(r.word)}
                          className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-rhyme-perfect text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          title="Click to insert into lyrics"
                        >
                          <span>{r.word}</span>
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rhyme-perfect transition-fast" />
                        </button>
                      ))}
                    </div>

                    {rhymeData.perfect.length > INITIAL_DISPLAY_LIMIT && (
                      <button
                        onClick={() => toggleTierExpansion('perfect')}
                        className="mt-1.5 text-[10px] font-mono text-obsidian-500 hover:text-rhyme-perfect flex items-center gap-1 transition-fast"
                      >
                        {expandedTiers['perfect'] ? (
                          <>
                            <ChevronUp className="w-3 h-3" /> Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" /> + Show{' '}
                            {rhymeData.perfect.length - INITIAL_DISPLAY_LIMIT} more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* MULTI-SYLLABLE CADENCES */}
                {((rhymeData.multisyllabic && rhymeData.multisyllabic.length > 0) ||
                  (rhymeData.multiSyllable && rhymeData.multiSyllable.length > 0)) && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">
                          MULTISYLLABIC
                        </span>
                        <span className="text-[9px] font-mono text-obsidian-500">
                          · 2+ Syllable Cadence
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-obsidian-500">
                        {(rhymeData.multisyllabic?.length || 0) +
                          (rhymeData.multiSyllable?.length || 0)}{' '}
                        cadences
                      </span>
                    </div>

                    {rhymeData.multisyllabic && rhymeData.multisyllabic.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(expandedTiers['multisyllabic']
                          ? rhymeData.multisyllabic
                          : rhymeData.multisyllabic.slice(0, INITIAL_DISPLAY_LIMIT)
                        ).map((r) => (
                          <button
                            key={r.word}
                            onClick={() => onInsertWord(r.word)}
                            className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-accent/40 hover:border-accent text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                            title="Multisyllabic cadence · Click to insert"
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

                {/* STRONG ASSONANCES */}
                {rhymeData.strong.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-rhyme-strong uppercase tracking-wider">
                          STRONG
                        </span>
                        <span className="text-[9px] font-mono text-obsidian-500">
                          · Matching Vowel Nucleus
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-obsidian-500">
                        {rhymeData.strong.length} matches
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(expandedTiers['strong']
                        ? rhymeData.strong
                        : rhymeData.strong.slice(0, INITIAL_DISPLAY_LIMIT)
                      ).map((r) => (
                        <button
                          key={r.word}
                          onClick={() => onInsertWord(r.word)}
                          className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-rhyme-strong text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          title="Click to insert"
                        >
                          <span>{r.word}</span>
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rhyme-strong transition-fast" />
                        </button>
                      ))}
                    </div>

                    {rhymeData.strong.length > INITIAL_DISPLAY_LIMIT && (
                      <button
                        onClick={() => toggleTierExpansion('strong')}
                        className="mt-1.5 text-[10px] font-mono text-obsidian-500 hover:text-rhyme-strong flex items-center gap-1 transition-fast"
                      >
                        {expandedTiers['strong'] ? (
                          <>
                            <ChevronUp className="w-3 h-3" /> Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" /> + Show{' '}
                            {rhymeData.strong.length - INITIAL_DISPLAY_LIMIT} more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* NEAR / SLANT RHYMES */}
                {rhymeData.near.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-rhyme-near uppercase tracking-wider">
                          NEAR
                        </span>
                        <span className="text-[9px] font-mono text-obsidian-500">
                          · Slant Coda & Proximity
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-obsidian-500">
                        {rhymeData.near.length} matches
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(expandedTiers['near']
                        ? rhymeData.near
                        : rhymeData.near.slice(0, INITIAL_DISPLAY_LIMIT)
                      ).map((r) => (
                        <button
                          key={r.word}
                          onClick={() => onInsertWord(r.word)}
                          className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-rhyme-near text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          title="Click to insert"
                        >
                          <span>{r.word}</span>
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-rhyme-near transition-fast" />
                        </button>
                      ))}
                    </div>

                    {rhymeData.near.length > INITIAL_DISPLAY_LIMIT && (
                      <button
                        onClick={() => toggleTierExpansion('near')}
                        className="mt-1.5 text-[10px] font-mono text-obsidian-500 hover:text-rhyme-near flex items-center gap-1 transition-fast"
                      >
                        {expandedTiers['near'] ? (
                          <>
                            <ChevronUp className="w-3 h-3" /> Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" /> + Show{' '}
                            {rhymeData.near.length - INITIAL_DISPLAY_LIMIT} more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* CONSONANCE RHYMES */}
                {rhymeData.consonance && rhymeData.consonance.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-obsidian-400 uppercase tracking-wider">
                          CONSONANCE
                        </span>
                        <span className="text-[9px] font-mono text-obsidian-500">
                          · Matching Final Consonant
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-obsidian-500">
                        {rhymeData.consonance.length} matches
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(expandedTiers['consonance']
                        ? rhymeData.consonance
                        : rhymeData.consonance.slice(0, INITIAL_DISPLAY_LIMIT)
                      ).map((r) => (
                        <button
                          key={r.word}
                          onClick={() => onInsertWord(r.word)}
                          className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-obsidian-400 text-xs font-devanagari text-obsidian-300 hover:text-white transition-fast"
                          title="Click to insert"
                        >
                          <span>{r.word}</span>
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-obsidian-400 transition-fast" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-obsidian-500 font-mono text-xs">
                <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-30 text-accent" />
                <p>Type or click any word in your verse</p>
                <p className="text-[11px] text-obsidian-600 mt-1">
                  Try: raat, saath, dil, pyaar, khwaab
                </p>
              </div>
            )
          ) : (
            /* DISCOVERY & ASSOCIATIONS TAB */
            <div className="space-y-4">
              {wordEntry?.origin && (
                <div className="flex items-center gap-2 text-xs font-mono text-obsidian-400 pb-2 border-b border-obsidian-800">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  <span>Register & Etymology:</span>
                  <span className="text-white font-semibold">{wordEntry.origin}</span>
                </div>
              )}

              {/* 4-Quadrant Sensory Graph */}
              {wordEntry?.relatedGraph ? (
                <div className="space-y-3">
                  {/* Visual */}
                  {wordEntry.relatedGraph.visual && (
                    <div className="p-2.5 rounded bg-obsidian-950 border border-obsidian-800 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                        <Eye className="w-3 h-3" />
                        <span>Visual & Imagery</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.visual.map((img) => (
                          <button
                            key={img}
                            onClick={() => setSearchTerm(img)}
                            className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          >
                            {img}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emotion */}
                  {wordEntry.relatedGraph.emotion && (
                    <div className="p-2.5 rounded bg-obsidian-950 border border-obsidian-800 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-rose-400 font-semibold uppercase">
                        <Heart className="w-3 h-3" />
                        <span>Emotion & Mood</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.emotion.map((emo) => (
                          <button
                            key={emo}
                            onClick={() => setSearchTerm(emo)}
                            className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          >
                            {emo}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sound */}
                  {wordEntry.relatedGraph.sound && (
                    <div className="p-2.5 rounded bg-obsidian-950 border border-obsidian-800 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-semibold uppercase">
                        <Volume2 className="w-3 h-3" />
                        <span>Sound & Rhythm</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.sound.map((snd) => (
                          <button
                            key={snd}
                            onClick={() => setSearchTerm(snd)}
                            className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          >
                            {snd}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Place */}
                  {wordEntry.relatedGraph.place && (
                    <div className="p-2.5 rounded bg-obsidian-950 border border-obsidian-800 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                        <MapPin className="w-3 h-3" />
                        <span>Place & Setting</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {wordEntry.relatedGraph.place.map((plc) => (
                          <button
                            key={plc}
                            onClick={() => setSearchTerm(plc)}
                            className="px-2 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-200 hover:text-white transition-fast"
                          >
                            {plc}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : wordEntry && wordEntry.relatedImagery.length > 0 ? (
                <div className="p-3 rounded bg-obsidian-950 border border-obsidian-800 space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-obsidian-400 uppercase tracking-wider block">
                    Related Themes & Vocabulary
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wordEntry.relatedImagery.map((img) => (
                      <button
                        key={img}
                        onClick={() => setSearchTerm(img)}
                        className="px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                      >
                        {img}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-obsidian-500 font-mono text-xs">
                  <Compass className="w-5 h-5 mx-auto mb-2 opacity-30 text-cyan-400" />
                  <p>Explore vocabulary associations for &quot;{currentDevanagari}&quot;</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-obsidian-700/60 bg-obsidian-950 text-[10px] font-mono text-obsidian-500 text-center">
        Click any word to insert at cursor · ESC to close
      </div>
    </div>
    </>
  );
};
