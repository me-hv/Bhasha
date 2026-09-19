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
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Disc3,
  FileText,
  Bookmark,
  Search,
  Menu,
  Plus
} from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeSong, createSong } = useSongs();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
      setIsMobileNavOpen(false);
      setInspectingWord(null);
      if (isZenMode) setIsZenMode(false);
    },
    onToggleZenMode: () => setIsZenMode((prev) => !prev),
    onFocusSearch: () => setIsSearchOpen(true),
  });

  const isRouteActive = (path: string) => {
    if (path === '/write' && pathname.startsWith('/write')) return true;
    return pathname === path;
  };

  const handleNavigate = (path: string) => {
    setIsMobileNavOpen(false);
    router.push(path);
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-obsidian-950 text-obsidian-50 select-none">
      {/* Navigation Sidebar (Desktop persistent + Mobile slide-over) */}
      {!isZenMode && (
        <Sidebar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden min-w-0">
        {!isZenMode && (
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode((prev) => !prev)}
            onToggleMobileMenu={() => setIsMobileNavOpen((prev) => !prev)}
            currentSongTitle={activeSong?.title}
            currentBpm={activeSong?.bpm}
          />
        )}

        {/* Content Area with dynamic height */}
        <main className={`flex-1 overflow-hidden relative ${!isZenMode ? 'pb-14 md:pb-0' : ''}`}>
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Hidden in Zen Mode and Desktop) */}
        {!isZenMode && (
          <nav className="fixed bottom-0 inset-x-0 h-14 bg-obsidian-925/95 backdrop-blur-md border-t border-obsidian-700/60 z-30 flex md:hidden items-center justify-around px-2 pb-safe">
            <button
              onClick={() => handleNavigate('/')}
              className={`flex flex-col items-center justify-center flex-1 py-1 touch-target transition-fast ${
                pathname === '/' ? 'text-accent font-semibold' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono">Home</span>
            </button>

            <button
              onClick={() => handleNavigate('/write')}
              className={`flex flex-col items-center justify-center flex-1 py-1 touch-target transition-fast ${
                isRouteActive('/write') ? 'text-accent font-semibold' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <Disc3 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono">Studio</span>
            </button>

            <button
              onClick={() => handleNavigate('/library/songs')}
              className={`flex flex-col items-center justify-center flex-1 py-1 touch-target transition-fast ${
                isRouteActive('/library/songs') ? 'text-accent font-semibold' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono">Songs</span>
            </button>

            <button
              onClick={() => handleNavigate('/library/lexicon')}
              className={`flex flex-col items-center justify-center flex-1 py-1 touch-target transition-fast ${
                isRouteActive('/library/lexicon') ? 'text-accent font-semibold' : 'text-obsidian-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono">Lexicon</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 touch-target text-obsidian-400 hover:text-accent transition-fast"
            >
              <Search className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono">Search</span>
            </button>

            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 touch-target text-obsidian-400 hover:text-white transition-fast"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono">Menu</span>
            </button>
          </nav>
        )}
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
