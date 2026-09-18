'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardCheatSheet: React.FC<KeyboardCheatSheetProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ / Ctrl + P or K', description: 'Global Search & Command Palette' },
    { key: '⌘ / Ctrl + N', description: 'Create New Song' },
    { key: '⌘ / Ctrl + S', description: 'Save Song & Sync Drafts' },
    { key: '⌘ / Ctrl + Shift + V', description: 'Save Version Snapshot' },
    { key: '⌘ / Ctrl + B', description: 'Toggle Contextual Rhyme Rack' },
    { key: '⌘ / Ctrl + Shift + R', description: 'Toggle Rhyme Scheme Mode' },
    { key: '⌘ / Ctrl + Shift + F', description: 'Toggle Syllable Meter & Flow Mode' },
    { key: '⌘ / Ctrl + Shift + S', description: 'Toggle Song Structure Drawer' },
    { key: '⌘ / Ctrl + Shift + I', description: 'Open "+ I\'M STUCK" Creative Catalyst' },
    { key: '⌘ / Ctrl + M', description: 'Toggle Metronome Audio Click' },
    { key: 'Esc', description: 'Close Modal, Drawer or Palette' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100 select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-obsidian-925 border border-obsidian-700/80 rounded-lg shadow-2xl p-6 text-obsidian-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-obsidian-700/60 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-accent" />
            <h3 className="text-base font-bold font-mono tracking-wide">
              KEYBOARD SHORTCUTS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-obsidian-400 hover:text-white rounded hover:bg-obsidian-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-3 rounded bg-obsidian-950 border border-obsidian-800 text-xs font-mono"
            >
              <span className="text-obsidian-300 font-sans">{s.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-700/60 text-accent font-semibold text-[11px]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-obsidian-700/60 text-center text-xs font-mono text-obsidian-400">
          BHASHA is built to be 100% keyboard operable for unbroken lyrical flow.
        </div>
      </div>
    </div>
  );
};
