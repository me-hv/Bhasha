'use client';

import React from 'react';
import { X, BarChart3, Flame, Layers, Hash, Activity } from 'lucide-react';
import { SongStats } from '../../types';

interface WritingStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SongStats;
  songTitle?: string;
}

export const WritingStatsModal: React.FC<WritingStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  songTitle,
}) => {
  if (!isOpen) return null;

  // Build ascii-style visual bar for density
  const totalBlocks = 16;
  const filledBlocks = Math.round((stats.rhymeDensity / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const barString = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-obsidian-925 border border-obsidian-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-700/60 bg-obsidian-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-accent/15 border border-accent/30 text-accent">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold tracking-wider text-obsidian-100 uppercase">
                Writing Analytics · {songTitle || 'Verse'}
              </h2>
              <p className="text-[11px] font-mono text-obsidian-500">
                Non-destructive phonetic metrics and cadence statistics.
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

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Grid Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-obsidian-950 border border-obsidian-700/60 text-center space-y-1">
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block">
                TOTAL WORDS
              </span>
              <span className="text-2xl font-mono font-bold text-white">
                {stats.totalWords}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-obsidian-950 border border-obsidian-700/60 text-center space-y-1">
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block">
                BARS
              </span>
              <span className="text-2xl font-mono font-bold text-accent">
                {stats.totalBars}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-obsidian-950 border border-obsidian-700/60 text-center space-y-1">
              <span className="text-[10px] font-mono font-semibold text-obsidian-500 uppercase tracking-wider block">
                TOTAL SYLLABLES
              </span>
              <span className="text-2xl font-mono font-bold text-white">
                {stats.totalSyllables}
              </span>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-700/60 space-y-1 text-center">
              <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider block">
                AVG SYLS / BAR
              </span>
              <span className="text-lg font-mono font-semibold text-cyan-400">
                {stats.avgSyllables}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-700/60 space-y-1 text-center">
              <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider block">
                RHYME GROUPS
              </span>
              <span className="text-lg font-mono font-semibold text-emerald-400">
                {stats.rhymeGroups}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-700/60 space-y-1 text-center">
              <span className="text-[10px] font-mono text-obsidian-500 uppercase tracking-wider block">
                INTERNAL RHYMES
              </span>
              <span className="text-lg font-mono font-semibold text-amber-400">
                {stats.internalRhymes}
              </span>
            </div>
          </div>

          {/* Rhyme Density Progress Card */}
          <div className="p-4 rounded-lg bg-obsidian-950 border border-obsidian-700/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rhyme-perfect" />
                <span className="text-xs font-mono font-bold text-obsidian-200 uppercase tracking-wider">
                  Rhyme Density
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-accent">
                {stats.rhymeDensity}%
              </span>
            </div>

            {/* Visual ASCII / Meter representation */}
            <div className="font-mono text-base tracking-widest text-emerald-400/90 bg-obsidian-900 px-3 py-2 rounded border border-obsidian-800 text-center overflow-x-auto">
              {barString}
            </div>

            <p className="text-[11px] font-mono text-obsidian-500">
              Measures the percentage of bars actively participating in end-rhyme chains or high-confidence internal rhymes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-obsidian-700/60 bg-obsidian-950 text-xs font-mono text-obsidian-500">
          <span>Non-destructive lyrical metrics</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
