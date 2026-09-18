'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  onSearch?: () => void;
  onNewSong?: () => void;
  onSave?: () => void;
  onSaveVersion?: () => void;
  onEscape?: () => void;
  onToggleMetronome?: () => void;
  onToggleRhymeDrawer?: () => void;
  onToggleRhymeMode?: () => void;
  onToggleFlowMode?: () => void;
  onToggleStructureDrawer?: () => void;
  onToggleStuckModal?: () => void;
  onToggleZenMode?: () => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // ⌘/Ctrl + K or ⌘/Ctrl + P -> Global Command / Search Palette
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'k' || e.key === 'K' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }

      // ⌘/Ctrl + Shift + V -> Save Version Snapshot
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        handlers.onSaveVersion?.();
        return;
      }

      // ⌘/Ctrl + N -> New Song
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handlers.onNewSong?.();
        return;
      }

      // ⌘/Ctrl + S -> Save Song
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // ⌘/Ctrl + B -> Toggle Rhyme Drawer
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handlers.onToggleRhymeDrawer?.();
        return;
      }

      // ⌘/Ctrl + M -> Toggle Metronome
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        handlers.onToggleMetronome?.();
        return;
      }

      // ⌘/Ctrl + Shift + R -> Toggle Rhyme Mode
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        handlers.onToggleRhymeMode?.();
        return;
      }

      // ⌘/Ctrl + Shift + F -> Toggle Flow Mode
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        handlers.onToggleFlowMode?.();
        return;
      }

      // ⌘/Ctrl + Shift + S -> Toggle Song Structure Drawer
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        handlers.onToggleStructureDrawer?.();
        return;
      }

      // ⌘/Ctrl + Shift + I -> Toggle I'M STUCK
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        handlers.onToggleStuckModal?.();
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
