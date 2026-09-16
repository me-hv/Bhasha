'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  RotateCw,
  Plus,
  Eye,
  Heart,
  Volume2,
  MapPin,
  Flame,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { IdeaSeed, WordEntry } from '../../types';
import { getIdeaSeed, getWordAssociationSeed } from '../../lib/language-engine/idea-seeds';
import { getWord } from '../../lib/language-engine/rhyme-engine';

interface StuckModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWord?: string;
  onInsertText: (text: string) => void;
  onSearchRhymes?: (word: string) => void;
  onViewWordDetails?: (word: WordEntry) => void;
}

type StuckCategory = 'ALL' | 'CONCEPT' | 'IMAGE' | 'CONTRAST' | 'EMOTION' | 'WORD_GRAPH';

export const StuckModal: React.FC<StuckModalProps> = ({
  isOpen,
  onClose,
  activeWord,
  onInsertText,
  onSearchRhymes,
  onViewWordDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<StuckCategory>('ALL');
  const [currentSeed, setCurrentSeed] = useState<IdeaSeed>(() => getIdeaSeed(undefined, activeWord));

  // Refresh seed
  const handleCycleSeed = () => {
    if (selectedCategory === 'WORD_GRAPH' && activeWord) {
      const assoc = getWordAssociationSeed(activeWord);
      if (assoc) {
        setCurrentSeed(assoc);
        return;
      }
    }
    const cat = selectedCategory === 'ALL' || selectedCategory === 'WORD_GRAPH' ? undefined : selectedCategory;
    setCurrentSeed(getIdeaSeed(cat, activeWord));
  };

  const handleCategoryChange = (cat: StuckCategory) => {
    setSelectedCategory(cat);
    if (cat === 'WORD_GRAPH' && activeWord) {
      const assoc = getWordAssociationSeed(activeWord);
      if (assoc) {
        setCurrentSeed(assoc);
        return;
      }
    }
    const apiCat = cat === 'ALL' || cat === 'WORD_GRAPH' ? undefined : cat;
    setCurrentSeed(getIdeaSeed(apiCat, activeWord));
  };

  if (!isOpen) return null;

  const wordEntry = activeWord ? getWord(activeWord) : null;
  const graph = wordEntry?.relatedGraph;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-obsidian-925 border border-obsidian-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-700/60 bg-obsidian-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-accent/15 border border-accent/30 text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold tracking-wider text-obsidian-100 uppercase">
                Creative Catalyst · I&apos;m Stuck
              </h2>
              <p className="text-[11px] font-mono text-obsidian-500">
                Unlock the next bar with structured concept seeds and sensory imagery.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-obsidian-400 hover:text-white hover:bg-obsidian-850 transition-fast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-obsidian-900 border-b border-obsidian-700/50 overflow-x-auto text-xs font-mono">
          <span className="text-[10px] text-obsidian-500 uppercase tracking-wider mr-1">Need:</span>
          {(
            [
              { id: 'ALL', label: 'Surprise Me' },
              { id: 'CONCEPT', label: 'A Concept' },
              { id: 'IMAGE', label: 'An Image' },
              { id: 'CONTRAST', label: 'A Contrast' },
              { id: 'EMOTION', label: 'An Emotion' },
              ...(activeWord ? [{ id: 'WORD_GRAPH' as StuckCategory, label: `"${activeWord}" Graph` }] : []),
            ] as { id: StuckCategory; label: string }[]
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1 rounded text-xs font-mono transition-fast whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-accent/20 text-accent border border-accent/50 font-semibold'
                  : 'bg-obsidian-950 text-obsidian-400 hover:text-white border border-obsidian-700/60 hover:bg-obsidian-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Main Idea Card */}
          <div className="p-5 rounded-lg bg-obsidian-950 border border-obsidian-700/70 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 uppercase tracking-wider">
                  {currentSeed.category}
                </span>
                {currentSeed.title && (
                  <span className="text-xs font-mono font-semibold text-obsidian-200">
                    {currentSeed.title}
                  </span>
                )}
              </div>

              {/* Cycle Button */}
              <button
                onClick={handleCycleSeed}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 text-xs font-mono text-obsidian-300 hover:text-accent transition-fast active:scale-95"
                title="Generate another idea seed"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>↻ Another</span>
              </button>
            </div>

            {/* Seed Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="p-3 rounded bg-obsidian-900/90 border border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block">
                  Concept
                </span>
                <p className="text-xs text-obsidian-200 font-sans leading-relaxed">
                  {currentSeed.concept}
                </p>
              </div>

              <div className="p-3 rounded bg-obsidian-900/90 border border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono font-semibold text-cyan-400/90 uppercase tracking-wider block">
                  Visual Image
                </span>
                <p className="text-xs text-obsidian-200 font-sans leading-relaxed">
                  {currentSeed.image}
                </p>
              </div>

              <div className="p-3 rounded bg-obsidian-900/90 border border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono font-semibold text-amber-400/90 uppercase tracking-wider block">
                  Poetic Contrast
                </span>
                <p className="text-xs text-obsidian-200 font-sans leading-relaxed">
                  {currentSeed.contrast}
                </p>
              </div>

              <div className="p-3 rounded bg-obsidian-900/90 border border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono font-semibold text-rose-400/90 uppercase tracking-wider block">
                  Emotional Core
                </span>
                <p className="text-xs text-obsidian-200 font-sans leading-relaxed">
                  {currentSeed.emotion}
                </p>
              </div>
            </div>

            {/* Keyword Chips */}
            {currentSeed.keywords && currentSeed.keywords.length > 0 && (
              <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider">
                  Anchor Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSeed.keywords.map((kw) => (
                    <button
                      key={kw.devanagari}
                      onClick={() => onInsertText(kw.devanagari)}
                      className="group flex items-center gap-1 px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/60 hover:border-accent text-xs font-devanagari text-obsidian-200 hover:text-white transition-fast"
                      title={`Click to insert "${kw.devanagari}" into lyrics`}
                    >
                      <span>{kw.devanagari}</span>
                      <span className="text-[10px] text-obsidian-500 font-mono group-hover:text-accent">
                        /{kw.roman}/
                      </span>
                      <Plus className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Opening Bar */}
            {currentSeed.sampleBar && (
              <div className="p-3 rounded bg-obsidian-900/60 border border-dashed border-obsidian-700/60 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] font-mono text-obsidian-500 uppercase">
                    Sample Meter / Bar:
                  </span>
                  <p className="text-xs font-devanagari text-obsidian-300 italic truncate">
                    &quot;{currentSeed.sampleBar}&quot;
                  </p>
                </div>
                <button
                  onClick={() => onInsertText(currentSeed.sampleBar!)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-accent/15 hover:bg-accent/25 border border-accent/40 text-[11px] font-mono text-accent whitespace-nowrap transition-fast"
                >
                  <Plus className="w-3 h-3" />
                  <span>Insert Bar</span>
                </button>
              </div>
            )}
          </div>

          {/* Lexical Graph Dimensions for Current Anchor Word */}
          {activeWord && graph && (
            <div className="p-4 rounded-lg bg-obsidian-950 border border-obsidian-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-obsidian-400">
                    Sensory Graph for:
                  </span>
                  <span className="text-sm font-bold font-devanagari text-white">
                    {activeWord}
                  </span>
                </div>

                {onSearchRhymes && (
                  <button
                    onClick={() => {
                      onSearchRhymes(activeWord);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-rhyme-perfect hover:underline"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>View Rhymes</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Visual */}
                {graph.visual && graph.visual.length > 0 && (
                  <div className="p-2.5 rounded bg-obsidian-900/80 border border-obsidian-800 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-semibold">
                      <Eye className="w-3 h-3" />
                      <span>VISUAL</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {graph.visual.map((item) => (
                        <button
                          key={item}
                          onClick={() => onInsertText(item)}
                          className="px-1.5 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-300 hover:text-white"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emotion */}
                {graph.emotion && graph.emotion.length > 0 && (
                  <div className="p-2.5 rounded bg-obsidian-900/80 border border-obsidian-800 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-rose-400 font-semibold">
                      <Heart className="w-3 h-3" />
                      <span>EMOTION</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {graph.emotion.map((item) => (
                        <button
                          key={item}
                          onClick={() => onInsertText(item)}
                          className="px-1.5 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-300 hover:text-white"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sound */}
                {graph.sound && graph.sound.length > 0 && (
                  <div className="p-2.5 rounded bg-obsidian-900/80 border border-obsidian-800 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-semibold">
                      <Volume2 className="w-3 h-3" />
                      <span>SOUND</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {graph.sound.map((item) => (
                        <button
                          key={item}
                          onClick={() => onInsertText(item)}
                          className="px-1.5 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-300 hover:text-white"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Place */}
                {graph.place && graph.place.length > 0 && (
                  <div className="p-2.5 rounded bg-obsidian-900/80 border border-obsidian-800 space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                      <MapPin className="w-3 h-3" />
                      <span>PLACE</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {graph.place.map((item) => (
                        <button
                          key={item}
                          onClick={() => onInsertText(item)}
                          className="px-1.5 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-850 border border-obsidian-700/50 text-[11px] font-devanagari text-obsidian-300 hover:text-white"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-obsidian-700/60 bg-obsidian-950 text-xs font-mono text-obsidian-500">
          <span>Click any word or phrase to insert at cursor</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
