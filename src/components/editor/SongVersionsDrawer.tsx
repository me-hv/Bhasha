'use client';

import React, { useState, useMemo } from 'react';
import {
  History,
  Plus,
  RotateCcw,
  GitCompare,
  Trash2,
  X,
  Check,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { Song, SongVersion, SongDiffResult } from '../../types';
import { compareLyrics } from '../../lib/utils/diff';

interface SongVersionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  versions: SongVersion[];
  onCreateVersion: (song: Song, label: string) => void;
  onRestoreVersion: (snapshotId: string) => void;
  onDeleteVersion: (versionId: string) => void;
}

export const SongVersionsDrawer: React.FC<SongVersionsDrawerProps> = ({
  isOpen,
  onClose,
  song,
  versions,
  onCreateVersion,
  onRestoreVersion,
  onDeleteVersion,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [comparingVersion, setComparingVersion] = useState<SongVersion | null>(null);
  const [restoreConfirmVersion, setRestoreConfirmVersion] = useState<SongVersion | null>(null);

  if (!isOpen) return null;

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onCreateVersion(song, newLabel.trim());
    setNewLabel('');
    setIsCreating(false);
  };

  const handleConfirmRestore = (ver: SongVersion) => {
    onRestoreVersion(ver.id);
    setRestoreConfirmVersion(null);
    setComparingVersion(null);
  };

  const currentAsVersion = {
    label: 'Current Workspace',
    timestamp: new Date().toISOString(),
    content: song.content || '',
  };

  const diffResult: SongDiffResult | null = comparingVersion
    ? compareLyrics(comparingVersion, currentAsVersion)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg sm:max-w-xl h-full bg-obsidian-925 border-l border-obsidian-700/80 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-obsidian-700/60 bg-obsidian-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-accent" />
            <div>
              <h2 className="text-sm sm:text-base font-mono font-bold text-obsidian-50">
                Version History
              </h2>
              <p className="text-[11px] text-obsidian-400 font-mono truncate max-w-[180px] sm:max-w-xs">
                {song.title} · {versions.length} {versions.length === 1 ? 'snapshot' : 'snapshots'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent hover:bg-accent-dark text-obsidian-950 text-xs font-mono font-bold transition-fast shadow-glow-subtle active:scale-95 touch-manipulation whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Save Version</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-obsidian-400 hover:text-white rounded hover:bg-obsidian-900 transition-fast touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Snapshot Creation Modal / Row */}
        {isCreating && (
          <form
            onSubmit={handleSaveSnapshot}
            className="p-4 bg-obsidian-900 border-b border-obsidian-700/60 flex items-center gap-2 animate-fade-in"
          >
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Changed hook, 2nd draft, Verse 2 rewrite..."
              autoFocus
              className="flex-1 bg-obsidian-950 border border-obsidian-700/60 rounded px-3 py-1.5 text-xs font-mono text-obsidian-100 placeholder-obsidian-500 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={!newLabel.trim()}
              className="px-3 py-1.5 rounded bg-accent disabled:opacity-40 text-obsidian-950 font-mono font-bold text-xs"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-2 py-1.5 text-obsidian-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Diff Comparison View */}
          {comparingVersion && diffResult ? (
            <div className="space-y-3 bg-obsidian-950 p-4 rounded-lg border border-obsidian-700/60">
              <div className="flex items-center justify-between pb-2 border-b border-obsidian-800">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono text-obsidian-200">
                    Comparing <strong className="text-white">&quot;{comparingVersion.label}&quot;</strong> vs Current
                  </span>
                </div>
                <button
                  onClick={() => setComparingVersion(null)}
                  className="text-xs font-mono text-obsidian-400 hover:text-white"
                >
                  Close Diff
                </button>
              </div>

              {/* Summary Stats */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-obsidian-400">
                <span className="text-emerald-400">+{diffResult.summary.addedLines} Added</span>
                <span>·</span>
                <span className="text-red-400">-{diffResult.summary.removedLines} Removed</span>
                <span>·</span>
                <span className="text-amber-400">~{diffResult.summary.changedLines} Changed</span>
              </div>

              {/* Lyric Diff Lines */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto p-2 rounded bg-obsidian-925 font-devanagari text-xs">
                {diffResult.lines.map((dl, idx) => {
                  if (dl.type === 'unchanged') {
                    return (
                      <div key={idx} className="text-obsidian-500 py-0.5 px-2">
                        {dl.lineA}
                      </div>
                    );
                  }
                  if (dl.type === 'added') {
                    return (
                      <div key={idx} className="bg-emerald-950/40 border-l-2 border-emerald-500 text-emerald-300 py-0.5 px-2">
                        + {dl.lineB}
                      </div>
                    );
                  }
                  if (dl.type === 'removed') {
                    return (
                      <div key={idx} className="bg-red-950/40 border-l-2 border-red-500 text-red-400 line-through py-0.5 px-2">
                        - {dl.lineA}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="bg-amber-950/30 border-l-2 border-amber-500 py-1 px-2 space-y-0.5">
                      <div className="text-red-400/80 text-[11px] line-through">
                        - {dl.lineA}
                      </div>
                      <div className="text-amber-200">
                        + {dl.lineB}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Restore from Compare Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setRestoreConfirmVersion(comparingVersion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-obsidian-850 hover:bg-obsidian-800 border border-accent/40 text-xs font-mono text-accent"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore This Version</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Restore Confirmation Safety Alert */}
          {restoreConfirmVersion && (
            <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/50 space-y-2.5 animate-fade-in">
              <div className="flex items-start gap-2 text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-xs font-mono">
                  <strong>Safe Restore:</strong> BHASHA will automatically create a safety snapshot of your current work before restoring <em>&quot;{restoreConfirmVersion.label}&quot;</em>.
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1 font-mono text-xs">
                <button
                  onClick={() => setRestoreConfirmVersion(null)}
                  className="px-3 py-1 rounded text-obsidian-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmRestore(restoreConfirmVersion)}
                  className="px-3 py-1 rounded bg-accent hover:bg-accent-dark text-obsidian-950 font-bold"
                >
                  Confirm & Restore
                </button>
              </div>
            </div>
          )}

          {/* Versions List */}
          {versions.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-500 block">
                SAVED SNAPSHOTS
              </span>

              {versions.map((v) => {
                const isComparing = comparingVersion?.id === v.id;
                const barCount = v.content ? v.content.split('\n').filter(l => l.trim() && !l.trim().startsWith('[') && !l.trim().endsWith(']')).length : 0;

                return (
                  <div
                    key={v.id}
                    className={`p-3.5 rounded-lg bg-obsidian-950 border transition-fast flex flex-col justify-between group ${
                      isComparing ? 'border-accent shadow-glow-subtle' : 'border-obsidian-700/60 hover:border-obsidian-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-mono font-semibold text-obsidian-100 group-hover:text-accent transition-fast">
                            {v.label}
                          </h4>
                          {v.isAutoSafetySnapshot && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
                              Safety
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-obsidian-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(v.timestamp).toLocaleString()}</span>
                          <span>·</span>
                          <span>{barCount} {barCount === 1 ? 'bar' : 'bars'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setComparingVersion(isComparing ? null : v)}
                          className={`p-1.5 rounded transition-fast text-xs font-mono flex items-center gap-1 ${
                            isComparing ? 'bg-accent text-obsidian-950 font-bold' : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                          }`}
                          title="Compare with Current Lyrics"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Compare</span>
                        </button>

                        <button
                          onClick={() => setRestoreConfirmVersion(v)}
                          className="p-1.5 text-obsidian-400 hover:text-accent rounded hover:bg-obsidian-900 transition-fast"
                          title="Restore this version"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteVersion(v.id)}
                          className="p-1.5 text-obsidian-500 hover:text-red-400 rounded hover:bg-obsidian-900 transition-fast"
                          title="Delete snapshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Preview line */}
                    <div className="mt-2 text-[11px] font-devanagari text-obsidian-400 line-clamp-2 bg-obsidian-900/60 p-2 rounded border border-obsidian-800">
                      {v.content || 'Empty draft snapshot'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 border border-dashed border-obsidian-800 rounded-lg">
              <p className="text-xs font-mono text-obsidian-400">
                No versions saved yet.
              </p>
              <p className="text-[11px] font-sans text-obsidian-500">
                Save a version whenever your song takes a new direction or before major rewrites.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-obsidian-700/60 bg-obsidian-950 flex items-center justify-between text-[11px] font-mono text-obsidian-500">
          <span>Shortcuts: ⌘⇧V to Save</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 text-obsidian-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
