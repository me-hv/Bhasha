'use client';

import React, { useState } from 'react';
import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CommandPalette } from '../components/layout/CommandPalette';
import { KeyboardCheatSheet } from '../components/layout/KeyboardCheatSheet';
import { WordDetailModal } from '../components/words/WordDetailModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSongs } from '../hooks/useSongs';
import { WordEntry } from '../types';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    onToggleZenMode: () => setIsZenMode(prev => !prev),
    onFocusSearch: () => setIsSearchOpen(true),
  });

  return (
    <html lang="en" className="dark">
      <head>
        <title>BHASHA — Hindi/Hinglish Rap Writing OS</title>
        <meta
          name="description"
          content="A personal songwriting and lyric-writing companion for Hindi and Hinglish rappers, lyricists, poets, and songwriters."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-obsidian-950 text-obsidian-50 font-sans antialiased overflow-hidden flex h-screen w-screen">
        {/* Navigation Sidebar (hidden in Zen mode) */}
        {!isZenMode && (
          <Sidebar
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          />
        )}

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {!isZenMode && (
            <Header
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              isZenMode={isZenMode}
              onToggleZenMode={() => setIsZenMode(prev => !prev)}
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
      </body>
    </html>
  );
}
