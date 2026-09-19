'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { KeyboardCheatSheet } from './KeyboardCheatSheet';
import { WordDetailModal } from '../words/WordDetailModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useSongs } from '../../hooks/useSongs';
import { WordEntry } from '../../types';
import { useRouter } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeSong, createSong } = useSongs();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onSearch: () => setIsSearchOpen(true),
    onNewSong: () => {
      const newSong = createSong('UNTITLED TRACK', 92, 'Am');
      router.push(`/write?id=${newSong.id}`);
    },
    onEscape: () => {
      setIsSearchOpen(false);
      setIsShortcutsOpen(false);
      setInspectingWord(null);
      if (isZenMode) setIsZenMode(false);
    },
    onToggleZenMode: () => setIsZenMode((prev) => !prev),
    onFocusSearch: () => setIsSearchOpen(true),
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-obsidian-950 text-obsidian-50">
      {/* Navigation Sidebar (hidden in Zen mode) */}
      {!isZenMode && (
        <Sidebar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      )}

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {!isZenMode && (
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode((prev) => !prev)}
            currentSongTitle={activeSong?.title}
            currentBpm={activeSong?.bpm}
          />
        )}

        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectWord={(word) => setInspectingWord(word)}
      />

      <KeyboardCheatSheet
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <WordDetailModal
        word={inspectingWord}
        isOpen={!!inspectingWord}
        onClose={() => setInspectingWord(null)}
      />
    </div>
  );
}
