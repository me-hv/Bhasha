'use client';

import React from 'react';
import {
  Search,
  Play,
  Square,
  Maximize2,
  Minimize2,
  Keyboard,
  Menu,
  Sparkles
} from 'lucide-react';
import { useMetronome } from '../../hooks/useMetronome';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  onToggleMobileMenu?: () => void;
  currentSongTitle?: string;
  currentBpm?: number;
  onBpmChange?: (bpm: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenShortcuts,
  isZenMode = false,
  onToggleZenMode,
  onToggleMobileMenu,
  currentSongTitle,
  currentBpm = 92,
  onBpmChange,
}) => {
  const {
    bpm,
    isPlaying,
    currentBeat,
    toggle: toggleMetronome,
    changeBpm,
    tapTempo,
  } = useMetronome(currentBpm);

  const handleBpmUpdate = (newBpm: number) => {
    changeBpm(newBpm);
    if (onBpmChange) onBpmChange(newBpm);
  };

  return (
    <header className="h-12 sm:h-13 bg-obsidian-925 border-b border-obsidian-700/60 px-3 sm:px-6 flex items-center justify-between select-none z-20 flex-shrink-0">
      {/* Left: Mobile Menu Trigger + Track Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-1 text-obsidian-400 hover:text-white rounded-lg hover:bg-obsidian-850 md:hidden flex items-center justify-center touch-target transition-fast"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <span className="text-xs sm:text-sm font-mono text-obsidian-300 font-medium truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[200px] md:max-w-[280px]">
          {currentSongTitle ? currentSongTitle.toUpperCase() : 'BHASHA'}
        </span>
      </div>

      {/* Center: Compact Songwriter Workstation Toolbar (● ▶ 92 BPM TAP) */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-obsidian-950 border border-obsidian-700/60 rounded-lg px-2 py-1 flex-shrink-0">
        {/* Beat Pulse Indicator (Hidden on very small screens <375px) */}
        <div className="hidden xs:flex items-center gap-1">
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
          className={`p-1.5 sm:p-1 rounded text-xs transition-fast flex items-center justify-center ${
            isPlaying
              ? 'bg-accent/20 text-accent border border-accent/40'
              : 'text-obsidian-400 hover:text-white hover:bg-obsidian-850'
          }`}
          title="Toggle Metronome Click (⌘M)"
        >
          {isPlaying ? (
            <Square className="w-3.5 h-3.5 sm:w-3 sm:h-3 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 sm:w-3 sm:h-3 fill-current" />
          )}
        </button>

        {/* BPM Selector */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-xs font-mono text-obsidian-400">
          <input
            type="number"
            value={bpm}
            onChange={(e) => handleBpmUpdate(Number(e.target.value))}
            className="w-9 sm:w-10 bg-transparent text-center text-obsidian-100 font-mono text-xs focus:outline-none p-0"
            min={40}
            max={240}
          />
          <span className="text-[9px] sm:text-[10px] text-obsidian-500 font-bold">BPM</span>
        </div>

        {/* Tap Tempo Button */}
        <button
          onClick={tapTempo}
          className="px-1.5 py-0.5 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-700/50 text-[10px] font-mono text-obsidian-400 hover:text-accent transition-fast active:scale-95 touch-manipulation"
          title="Tap Tempo (click 4 times to detect tempo)"
        >
          TAP
        </button>
      </div>

      {/* Right: Quick Search, Zen Mode, Keyboard Shortcuts */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Search button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-1 rounded-lg bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/60 text-xs font-mono text-obsidian-400 hover:text-white transition-fast touch-target"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-accent" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 rounded bg-obsidian-900 text-obsidian-500 border border-obsidian-700/40">
            ⌘K
          </kbd>
        </button>

        {/* Zen Mode toggle */}
        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className={`p-2 sm:p-1.5 rounded-lg border transition-fast touch-target flex items-center justify-center ${
              isZenMode
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
            }`}
            title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Focus Mode (⌘+Shift+F)'}
          >
            {isZenMode ? (
              <Minimize2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            )}
          </button>
        )}

        {/* Keyboard Shortcuts Dialog Trigger */}
        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex p-1.5 rounded-lg bg-obsidian-950 border border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-900 transition-fast items-center justify-center touch-target"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
