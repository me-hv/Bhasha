'use client';

import React from 'react';
import {
  Search,
  Play,
  Square,
  Maximize2,
  Minimize2,
  Keyboard,
  Plus
} from 'lucide-react';
import { useMetronome } from '../../hooks/useMetronome';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  currentSongTitle?: string;
  currentBpm?: number;
  onBpmChange?: (bpm: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenShortcuts,
  isZenMode = false,
  onToggleZenMode,
  currentSongTitle,
  currentBpm = 92,
  onBpmChange,
}) => {
  const {
    bpm,
    isPlaying,
    currentBeat,
    isDownbeat,
    toggle: toggleMetronome,
    changeBpm,
    tapTempo,
  } = useMetronome(currentBpm);

  const handleBpmUpdate = (newBpm: number) => {
    changeBpm(newBpm);
    if (onBpmChange) onBpmChange(newBpm);
  };

  return (
    <header className="h-12 bg-obsidian-925 border-b border-obsidian-700/60 px-4 sm:px-6 flex items-center justify-between select-none z-20">
      {/* Left: Track name / Status */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-mono text-obsidian-400 font-medium truncate max-w-[200px]">
          {currentSongTitle ? currentSongTitle.toUpperCase() : 'BHASHA STUDIO'}
        </span>
      </div>

      {/* Center: Compact Songwriter Workstation Toolbar (● ▶ 92 BPM TAP) */}
      <div className="flex items-center gap-2 bg-obsidian-950 border border-obsidian-700/60 rounded px-2 py-1">
        {/* Subtle Beat Pulse Indicator */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map((b) => (
            <div
              key={b}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-75 ${
                isPlaying && currentBeat === b
                  ? b === 0
                    ? 'bg-accent shadow-glow-emerald scale-125'
                    : 'bg-accent/70 scale-110'
                  : 'bg-obsidian-800'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={toggleMetronome}
          className={`p-1 rounded text-xs transition-fast ${
            isPlaying
              ? 'bg-accent/20 text-accent border border-accent/40'
              : 'text-obsidian-400 hover:text-white hover:bg-obsidian-850'
          }`}
          title="Toggle Metronome Click (⌘M)"
        >
          {isPlaying ? (
            <Square className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current" />
          )}
        </button>

        {/* BPM Selector */}
        <div className="flex items-center gap-1 text-xs font-mono text-obsidian-400">
          <input
            type="number"
            value={bpm}
            onChange={(e) => handleBpmUpdate(Number(e.target.value))}
            className="w-10 bg-transparent text-center text-obsidian-100 font-mono text-xs focus:outline-none"
            min={40}
            max={240}
          />
          <span className="text-[10px] text-obsidian-500">BPM</span>
        </div>

        {/* Tap Tempo Button */}
        <button
          onClick={tapTempo}
          className="px-1.5 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-[10px] font-mono text-obsidian-400 hover:text-accent transition-fast active:scale-95"
          title="Tap Tempo (click 4 times to detect tempo)"
        >
          TAP
        </button>
      </div>

      {/* Right: Quick Search, Zen Mode, Keyboard Shortcuts */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/60 text-xs font-mono text-obsidian-400 hover:text-white transition-fast"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-accent" />
          <span className="hidden md:inline">Search</span>
          <kbd className="text-[10px] font-mono px-1 rounded bg-obsidian-900 text-obsidian-500 border border-obsidian-700/40">
            ⌘K
          </kbd>
        </button>

        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className={`p-1.5 rounded border transition-fast ${
              isZenMode
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
            }`}
            title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Focus Mode (⌘+Shift+F)'}
          >
            {isZenMode ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded bg-obsidian-950 border border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-900 transition-fast"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
