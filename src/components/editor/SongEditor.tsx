'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Song, WordEntry, WritingMode, RhymeTarget } from '../../types';
import { EditorHeader } from './EditorHeader';
import { RhymeDrawer } from './RhymeDrawer';
import { Scratchpad } from './Scratchpad';
import { SongStructureDrawer } from './SongStructureDrawer';
import { WritingStatsModal } from './WritingStatsModal';
import { StuckModal } from './StuckModal';
import { WordDetailModal } from '../words/WordDetailModal';
import { getRhymes, getWord } from '../../lib/language-engine/rhyme-engine';
import { parseSongContent } from '../../lib/language-engine/verse-analyzer';
import {
  Flame,
  FileText,
  Sparkles,
  Layers,
  BarChart3,
  Target,
  PenTool,
  Activity,
  Plus,
  X,
  ArrowRight
} from 'lucide-react';

interface SongEditorProps {
  song: Song;
  onUpdateSong: (updated: Partial<Song>) => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  song,
  onUpdateSong,
  isZenMode = false,
  onToggleZenMode,
}) => {
  const [content, setContent] = useState(song.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [writingMode, setWritingMode] = useState<WritingMode>('write');
  const [targetSyllables, setTargetSyllables] = useState<number>(10);
  const [pinnedTarget, setPinnedTarget] = useState<RhymeTarget | null>(null);
  const [cursorWord, setCursorWord] = useState<string>('रात');
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  // Drawers and Modals State
  const [isRhymeDrawerOpen, setIsRhymeDrawerOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isStructureDrawerOpen, setIsStructureDrawerOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isStuckModalOpen, setIsStuckModalOpen] = useState(false);
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if active song changes from outside
  useEffect(() => {
    setContent(song.content || '');
  }, [song.id]);

  // Debounced Autosave
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onUpdateSong({ content: newContent });
      setIsSaving(false);
    }, 400);
  };

  const [explicitSelectedWord, setExplicitSelectedWord] = useState<string | null>(null);

  // Helper to extract clean word at or near cursor with explicit selection detection
  const extractWordAtCursor = useCallback((text: string, selectionStart: number, selectionEnd: number) => {
    // 1. Explicit selection takes highest precedence
    if (selectionStart !== selectionEnd) {
      const selected = text.substring(selectionStart, selectionEnd).trim();
      const cleaned = selected.replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+$/g, '');
      if (cleaned.length > 0 && cleaned.length < 35) {
        return { word: cleaned, isExplicit: true };
      }
    }

    // 2. Identify the current line and cursor offset within this line
    const textBefore = text.substring(0, selectionStart);
    const lineStartPos = textBefore.lastIndexOf('\n') + 1;
    const nextNewline = text.indexOf('\n', selectionStart);
    const lineEndPos = nextNewline === -1 ? text.length : nextNewline;
    const currentLine = text.substring(lineStartPos, lineEndPos);
    const cursorInLine = selectionStart - lineStartPos;

    if (!currentLine.trim()) return null;

    // Ignore section headers like [Verse 1]
    if (currentLine.trim().startsWith('[') && currentLine.trim().endsWith(']')) {
      return null;
    }

    // 3. Find word boundaries around cursor position
    const isWordChar = (char: string) => char && !/\s|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]/.test(char);

    let start = cursorInLine;
    let end = cursorInLine;

    // If cursor is at a space, look backwards for the word right before it
    if (start > 0 && !isWordChar(currentLine[start]) && isWordChar(currentLine[start - 1])) {
      start--;
      end = start;
    }

    if (isWordChar(currentLine[start])) {
      while (start > 0 && isWordChar(currentLine[start - 1])) {
        start--;
      }
      while (end < currentLine.length && isWordChar(currentLine[end])) {
        end++;
      }
      const rawWord = currentLine.substring(start, end).trim();
      if (rawWord) return { word: rawWord, isExplicit: false };
    }

    // 4. Fallback: find the last word on the line before the cursor
    const lineUpToCursor = currentLine.substring(0, cursorInLine).trim();
    if (lineUpToCursor) {
      const words = lineUpToCursor.split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        const last = words[words.length - 1].replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+$/g, '');
        if (last) return { word: last, isExplicit: false };
      }
    }

    // 5. Fallback to last word of entire line
    const allWordsOnLine = currentLine.split(/\s+/).filter(Boolean);
    if (allWordsOnLine.length > 0) {
      const last = allWordsOnLine[allWordsOnLine.length - 1].replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+$/g, '');
      if (last) return { word: last, isExplicit: false };
    }

    return null;
  }, []);

  // Inspect cursor position to identify active line and active end-word
  const handleCursorMove = useCallback(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLineNumber = lines.length - 1;
    setActiveLineIndex(currentLineNumber);

    const detected = extractWordAtCursor(content, textarea.selectionStart, textarea.selectionEnd);
    if (detected) {
      if (detected.isExplicit) {
        setExplicitSelectedWord(detected.word);
        setCursorWord(detected.word);
      } else {
        setExplicitSelectedWord(null);
        setCursorWord(detected.word);
      }
    } else {
      setExplicitSelectedWord(null);
    }
  }, [content, extractWordAtCursor]);

  // Global & Local keydown handler for studio shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    // ⌘/Ctrl + B -> Toggle Rhyme Rack
    if (isCmdOrCtrl && !e.shiftKey && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      handleCursorMove();
      setIsRhymeDrawerOpen((prev) => !prev);
      if (isScratchpadOpen) setIsScratchpadOpen(false);
      if (isStructureDrawerOpen) setIsStructureDrawerOpen(false);
      return;
    }

    // ⌘/Ctrl + Shift + R -> Toggle Rhyme Mode
    if (isCmdOrCtrl && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      setWritingMode((prev) => (prev === 'rhyme' ? 'write' : 'rhyme'));
      return;
    }

    // ⌘/Ctrl + Shift + F -> Toggle Flow Mode
    if (isCmdOrCtrl && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      setWritingMode((prev) => (prev === 'flow' ? 'write' : 'flow'));
      return;
    }

    // ⌘/Ctrl + Shift + S -> Toggle Song Structure Drawer
    if (isCmdOrCtrl && e.shiftKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      setIsStructureDrawerOpen((prev) => !prev);
      if (isRhymeDrawerOpen) setIsRhymeDrawerOpen(false);
      if (isScratchpadOpen) setIsScratchpadOpen(false);
      return;
    }

    // ⌘/Ctrl + Shift + I -> Toggle "+ I'M STUCK" Catalyst
    if (isCmdOrCtrl && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      setIsStuckModalOpen((prev) => !prev);
      return;
    }

    // ⌘/Ctrl + S -> Trigger manual save indicator
    if (isCmdOrCtrl && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      onUpdateSong({ content });
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 500);
      return;
    }
  };

  // Full Verse Analysis (End-rhymes, Rhyme Groups, Syllables, Flow, Stats)
  const analysis = useMemo(() => {
    return parseSongContent(content, song.bpm, targetSyllables, pinnedTarget || undefined);
  }, [content, song.bpm, targetSyllables, pinnedTarget]);

  // Priority: 1. Explicit selection -> 2. Pinned Target -> 3. Cursor word / Line ending
  const effectiveSearchWord = explicitSelectedWord || (pinnedTarget ? pinnedTarget.devanagari : cursorWord);
  const activeRhymes = useMemo(() => {
    if (!effectiveSearchWord) return [];
    const res = getRhymes(effectiveSearchWord);
    return [...res.perfect.slice(0, 5), ...res.strong.slice(0, 4)];
  }, [effectiveSearchWord]);

  // Insert word at current cursor position
  const handleInsertWord = (wordToInsert: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    const charBefore = startPos > 0 ? content[startPos - 1] : '';
    const prefix = charBefore && charBefore !== ' ' && charBefore !== '\n' ? ' ' : '';

    const newContent = content.substring(0, startPos) + prefix + wordToInsert + ' ' + content.substring(endPos);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = startPos + prefix.length + wordToInsert.length + 1;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleInsertSection = (sectionTag: string) => {
    if (!textareaRef.current) {
      handleContentChange(content + sectionTag);
      return;
    }
    const textarea = textareaRef.current;
    const startPos = textarea.selectionStart;
    const newContent = content.substring(0, startPos) + sectionTag + content.substring(startPos);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = startPos + sectionTag.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleSetRhymeTarget = (wordStr: string) => {
    const entry = getWord(wordStr);
    setPinnedTarget({
      word: wordStr,
      devanagari: entry?.devanagari || wordStr,
      roman: entry?.roman,
      isPinned: true,
    });
  };

  const handleScrollToLine = (lineIndex: number) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const lines = content.split('\n');
    let charOffset = 0;
    for (let i = 0; i < Math.min(lineIndex, lines.length); i++) {
      charOffset += lines[i].length + 1;
    }
    textarea.focus();
    textarea.setSelectionRange(charOffset, charOffset);
    setIsStructureDrawerOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-obsidian-950 overflow-hidden relative select-none">
      {/* Top Header if not in full Zen mode */}
      {!isZenMode && (
        <EditorHeader
          song={song}
          onUpdateSong={onUpdateSong}
          onInsertSection={handleInsertSection}
          isSaving={isSaving}
          mode={writingMode}
          onModeChange={setWritingMode}
          targetSyllables={targetSyllables}
          onTargetSyllablesChange={setTargetSyllables}
          onOpenStructure={() => {
            setIsStructureDrawerOpen((prev) => !prev);
            if (isRhymeDrawerOpen) setIsRhymeDrawerOpen(false);
            if (isScratchpadOpen) setIsScratchpadOpen(false);
          }}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onOpenStuck={() => setIsStuckModalOpen(true)}
        />
      )}

      {/* Rhyme Target Active Indicator Banner */}
      {pinnedTarget && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 sm:px-12 py-1.5 flex items-center justify-between text-xs font-mono text-amber-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-400">
              RHYME TARGET PINNED:
            </span>
            <span className="font-bold font-devanagari text-white text-sm">
              {pinnedTarget.devanagari}
            </span>
            {pinnedTarget.roman && (
              <span className="text-obsidian-400 text-xs">/{pinnedTarget.roman}/</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCursorWord(pinnedTarget.devanagari);
                setIsRhymeDrawerOpen(true);
              }}
              className="text-[11px] text-amber-300 hover:text-white underline hover:no-underline"
            >
              Open Rhymes (⌘B)
            </button>
            <button
              onClick={() => setPinnedTarget(null)}
              className="p-1 text-amber-400/70 hover:text-white rounded"
              title="Unpin Rhyme Target"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex overflow-y-auto px-4 sm:px-10 md:px-16 py-8 max-w-5xl mx-auto w-full">
            {/* Left Gutter: Bar Number, Rhyme Group Badge (A, B..), Syllable Counter, Cadence Pattern */}
            <div className="flex flex-col pr-4 select-none text-right font-mono text-xs border-r border-obsidian-700/40 mr-5 space-y-0 leading-[2.2] pt-[2px] min-w-[90px]">
              {analysis.lines.map((item) => {
                const isCurrent = activeLineIndex === item.index;
                const formattedNum = item.barNumber !== null ? String(item.barNumber).padStart(2, '0') : '';

                return (
                  <div
                    key={item.index}
                    className={`h-[35.2px] flex items-center justify-end gap-2 transition-fast ${
                      isCurrent ? 'text-accent font-medium' : 'text-obsidian-500'
                    }`}
                  >
                    {/* Rhyme Group Badge (A, B, C...) or Unrhymed (—) in Rhyme Mode */}
                    {writingMode === 'rhyme' ? (
                      item.rhymeGroup ? (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border shadow-sm ${
                            item.rhymeGroupColor || 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          }`}
                          title={`Rhyme Group ${item.rhymeGroup}`}
                        >
                          {item.rhymeGroup}
                        </span>
                      ) : item.barNumber !== null ? (
                        <span
                          className="text-[10px] font-mono text-obsidian-600 px-1 rounded border border-obsidian-800/40 bg-obsidian-950/60"
                          title="Unrhymed bar"
                        >
                          —
                        </span>
                      ) : (
                        <span className="w-4" />
                      )
                    ) : item.rhymeGroup ? (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border shadow-sm ${
                          item.rhymeGroupColor || 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        }`}
                        title={`Rhyme Group ${item.rhymeGroup}`}
                      >
                        {item.rhymeGroup}
                      </span>
                    ) : (
                      <span className="w-4" />
                    )}

                    {/* Bar Number */}
                    {item.barNumber !== null ? (
                      <span className="text-[11px] font-mono tracking-tighter w-5 opacity-75">
                        {formattedNum}
                      </span>
                    ) : (
                      <span className="w-5" />
                    )}

                    {/* Syllable Counter / Target Ratio */}
                    {item.syllables !== null ? (
                      <span
                        className={`text-[10px] px-1 rounded font-mono ${
                          writingMode === 'flow'
                            ? item.flow?.isDense
                              ? 'bg-rose-500/20 text-rose-400 font-bold'
                              : 'bg-cyan-500/15 text-cyan-400'
                            : isCurrent
                            ? 'bg-accent/15 text-accent'
                            : 'text-obsidian-600'
                        }`}
                        title={
                          writingMode === 'flow'
                            ? `${item.syllables} syllables · Target: ${targetSyllables} · Density: ${item.flow?.density} syl/beat`
                            : `${item.syllables} syllables`
                        }
                      >
                        {writingMode === 'flow' ? `${item.syllables}/${targetSyllables}` : writingMode === 'write' && !isCurrent ? '' : item.syllables}
                      </span>
                    ) : (
                      <span className="w-3" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Main Seamless Writing Canvas */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleCursorMove}
                onClick={handleCursorMove}
                onSelect={handleCursorMove}
                placeholder="Start writing your verse in Hindi or Hinglish...&#10;&#10;रात में जागता, सवाल मेरे साथ&#10;शहर सो रहा लेकिन आँखों में रात"
                className="w-full h-full min-h-[650px] text-obsidian-50 font-devanagari text-base sm:text-lg focus:outline-none resize-none leading-[2.2] tracking-wide placeholder-obsidian-600 lyrics-canvas-textarea"
                autoFocus
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Fast Rhyme Discovery & Status Bar */}
          <div className="border-t border-obsidian-700/60 bg-obsidian-925/95 backdrop-blur-md px-4 sm:px-8 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5 overflow-x-auto min-w-0">
              {/* Active / Detected Rhyme Word Trigger */}
              <button
                onClick={() => setIsRhymeDrawerOpen(!isRhymeDrawerOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-rhyme-perfect text-xs font-mono text-accent transition-fast whitespace-nowrap"
                title="Toggle Rhyme Rack (⌘B)"
              >
                <Flame className="w-3.5 h-3.5 text-rhyme-perfect" />
                <span className="font-bold font-devanagari text-white">{effectiveSearchWord || 'Rhymes'}</span>
                <span className="text-[10px] text-obsidian-500 font-mono">⌘B</span>
              </button>

              {/* Pin Rhyme Target Button */}
              {effectiveSearchWord && (
                <button
                  onClick={() => {
                    if (pinnedTarget?.devanagari === effectiveSearchWord) {
                      setPinnedTarget(null);
                    } else {
                      handleSetRhymeTarget(effectiveSearchWord);
                    }
                  }}
                  className={`p-1 rounded border transition-fast text-xs ${
                    pinnedTarget?.devanagari === effectiveSearchWord
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-amber-400 hover:bg-obsidian-900'
                  }`}
                  title={
                    pinnedTarget?.devanagari === effectiveSearchWord
                      ? 'Target Pinned (Click to unpin)'
                      : 'Pin as Rhyme Target'
                  }
                >
                  <Target className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Quick Rhyme Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {activeRhymes.map((r) => (
                  <button
                    key={r.word}
                    onClick={() => handleInsertWord(r.word)}
                    className="group flex items-center gap-1 px-2.5 py-0.5 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/50 hover:border-accent text-xs font-devanagari text-obsidian-300 hover:text-white transition-fast whitespace-nowrap"
                    title={`Click to insert "${r.word}"`}
                  >
                    <span>{r.word}</span>
                    <span className="text-[10px] text-obsidian-600 group-hover:text-accent font-mono">
                      +{r.syllables}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Status, Catalyst & Drawer Toggles */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* I'M STUCK Trigger */}
              <button
                onClick={() => setIsStuckModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-accent/15 hover:bg-accent/25 border border-accent/40 text-xs font-mono text-accent transition-fast"
                title="I'm Stuck Creative Catalyst (⌘Shift+I)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ I&apos;M STUCK</span>
              </button>

              {/* Scratchpad Toggle */}
              <button
                onClick={() => {
                  setIsScratchpadOpen(!isScratchpadOpen);
                  if (isRhymeDrawerOpen) setIsRhymeDrawerOpen(false);
                  if (isStructureDrawerOpen) setIsStructureDrawerOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-mono transition-fast ${
                  isScratchpadOpen
                    ? 'bg-accent/15 border-accent text-accent'
                    : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                }`}
                title="Toggle Notes & Scratchpad"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scratchpad</span>
              </button>

              {/* Rhyme Rack Toggle */}
              <button
                onClick={() => {
                  setIsRhymeDrawerOpen(!isRhymeDrawerOpen);
                  if (isScratchpadOpen) setIsScratchpadOpen(false);
                  if (isStructureDrawerOpen) setIsStructureDrawerOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-mono transition-fast ${
                  isRhymeDrawerOpen
                    ? 'bg-rhyme-perfect/15 border-rhyme-perfect text-rhyme-perfect'
                    : 'bg-obsidian-950 border-obsidian-700/60 text-obsidian-400 hover:text-white hover:bg-obsidian-900'
                }`}
                title="Toggle Rhyme Rack (⌘B)"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Rhyme Rack</span>
              </button>
            </div>
          </div>
        </div>

        {/* Signature Rhyme Panel Drawer */}
        <RhymeDrawer
          isOpen={isRhymeDrawerOpen}
          onClose={() => setIsRhymeDrawerOpen(false)}
          selectedWord={effectiveSearchWord}
          onInsertWord={handleInsertWord}
          onViewWordDetails={(word) => setInspectingWord(word)}
          pinnedTarget={pinnedTarget}
          onSetRhymeTarget={handleSetRhymeTarget}
          onClearRhymeTarget={() => setPinnedTarget(null)}
        />

        {/* Scratchpad Drawer */}
        <Scratchpad
          isOpen={isScratchpadOpen}
          onClose={() => setIsScratchpadOpen(false)}
          song={song}
          onUpdateSong={onUpdateSong}
          onInsertWord={handleInsertWord}
        />

        {/* Song Structure Drawer */}
        <SongStructureDrawer
          isOpen={isStructureDrawerOpen}
          onClose={() => setIsStructureDrawerOpen(false)}
          sections={analysis.sections}
          onInsertSection={handleInsertSection}
          onScrollToLine={handleScrollToLine}
        />
      </div>

      {/* Writing Analytics Modal */}
      <WritingStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={analysis.stats}
        songTitle={song.title}
      />

      {/* I'M STUCK Creative Catalyst Modal */}
      <StuckModal
        isOpen={isStuckModalOpen}
        onClose={() => setIsStuckModalOpen(false)}
        activeWord={effectiveSearchWord}
        onInsertText={handleInsertWord}
        onSearchRhymes={(word) => {
          setCursorWord(word);
          setIsRhymeDrawerOpen(true);
        }}
        onViewWordDetails={(word) => setInspectingWord(word)}
      />

      {/* Full Word Detail Modal */}
      <WordDetailModal
        word={inspectingWord}
        isOpen={!!inspectingWord}
        onClose={() => setInspectingWord(null)}
        onSelectRhyme={handleInsertWord}
        onNavigateWord={(targetWord) => {
          const w = getWord(targetWord);
          if (w) {
            setInspectingWord(w);
          } else {
            setCursorWord(targetWord);
            setInspectingWord(null);
            setIsRhymeDrawerOpen(true);
          }
        }}
      />
    </div>
  );
};
