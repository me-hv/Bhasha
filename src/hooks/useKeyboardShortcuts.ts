'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  onSearch?: () => void;
  onNewSong?: () => void;
  onSave?: () => void;
  onEscape?: () => void;
  onToggleMetronome?: () => void;
  onToggleRhymeDrawer?: () => void;
  onToggleZenMode?: () => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // ⌘/Ctrl + K -> Global Command / Search Palette
      if (isCmdOrCtrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }

      // ⌘/Ctrl + N -> New Song
      if (isCmdOrCtrl && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handlers.onNewSong?.();
        return;
      }

      // ⌘/Ctrl + S -> Save Song
      if (isCmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // ⌘/Ctrl + B -> Toggle Rhyme Drawer
      if (isCmdOrCtrl && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handlers.onToggleRhymeDrawer?.();
        return;
      }

      // ⌘/Ctrl + M -> Toggle Metronome
      if (isCmdOrCtrl && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        handlers.onToggleMetronome?.();
        return;
      }

      // ⌘/Ctrl + Shift + F -> Toggle Zen Focus Mode
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        handlers.onToggleZenMode?.();
        return;
      }

      // Escape -> Close Modals / Drawers
      if (e.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }

      // '/' -> Focus Search (when not in an input field)
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        handlers.onFocusSearch?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
