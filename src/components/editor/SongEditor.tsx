'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Song, WordEntry } from '../../types';
import { EditorHeader } from './EditorHeader';
import { RhymeDrawer } from './RhymeDrawer';
import { Scratchpad } from './Scratchpad';
import { WordDetailModal } from '../words/WordDetailModal';
import { countSyllables } from '../../lib/rhyme-engine/phonetics';
import { getRhymes, getWordDetails } from '../../lib/rhyme-engine';
import {
  Flame,
  FileText,
  Search,
  Sparkles,
  Maximize2,
  Minimize2,
  Bookmark,
  Plus
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
  const [cursorWord, setCursorWord] = useState<string>('रात');
  const [isRhymeDrawerOpen, setIsRhymeDrawerOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [inspectingWord, setInspectingWord] = useState<WordEntry | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

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

  // Helper to extract clean word at or near cursor
  const extractWordAtCursor = useCallback((text: string, selectionStart: number, selectionEnd: number) => {
    // 1. Explicit selection takes highest precedence
    if (selectionStart !== selectionEnd) {
      const selected = text.substring(selectionStart, selectionEnd).trim();
      const cleaned = selected.replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+$/g, '');
      if (cleaned.length > 0 && cleaned.length < 35) {
        return cleaned;
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
    // First, check if cursor is directly on or adjacent to a word
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
      if (rawWord) return rawWord;
    }

    // 4. Fallback: find the last word on the line before the cursor
    const lineUpToCursor = currentLine.substring(0, cursorInLine).trim();
    if (lineUpToCursor) {
      const words = lineUpToCursor.split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        const last = words[words.length - 1].replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+$/g, '');
        if (last) return last;
      }
    }

    // 5. Fallback to last word of entire line
    const allWordsOnLine = currentLine.split(/\s+/).filter(Boolean);
    if (allWordsOnLine.length > 0) {
      const last = allWordsOnLine[allWordsOnLine.length - 1].replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+|[.,/#!$%^&*;:{}=\-_`~()?"'<>।॥]+$/g, '');
      if (last) return last;
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
      setCursorWord(detected);
    }
  }, [content, extractWordAtCursor]);

  // Global & Local keydown handler for ⌘B and quick writing shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    // ⌘/Ctrl + B -> Toggle Rhyme Rack
    if (isCmdOrCtrl && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      handleCursorMove();
      setIsRhymeDrawerOpen((prev) => !prev);
      if (isScratchpadOpen) setIsScratchpadOpen(false);
      return;
    }

    // ⌘/Ctrl + S -> Trigger manual save indicator
    if (isCmdOrCtrl && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      onUpdateSong({ content });
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 500);
      return;
    }
  };

  // Line by line breakdown for syllable and bar analysis
  const linesAnalysis = useMemo(() => {
    const rawLines = content.split('\n');
    let barCount = 0;

    return rawLines.map((line, idx) => {
      const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
      const isBlank = !line.trim();
      let barNumber: number | null = null;

      if (!isHeader && !isBlank) {
        barCount++;
        barNumber = barCount;
      }

      const syllables = isHeader || isBlank ? null : countSyllables(line);

      return {
        line,
        index: idx,
        barNumber,
        isHeader,
        isBlank,
        syllables,
      };
    });
  }, [content]);

  // Top fast rhymes for the active cursor word
  const activeRhymes = useMemo(() => {
    if (!cursorWord) return [];
    const res = getRhymes(cursorWord);
    return [...res.perfect.slice(0, 5), ...res.strong.slice(0, 4)];
  }, [cursorWord]);

  // Insert word at current cursor position
  const handleInsertWord = (wordToInsert: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Check if inserting at end of a word or space
    const charBefore = startPos > 0 ? content[startPos - 1] : '';
    const prefix = charBefore && charBefore !== ' ' && charBefore !== '\n' ? ' ' : '';

    const newContent = content.substring(0, startPos) + prefix + wordToInsert + ' ' + content.substring(endPos);
    handleContentChange(newContent);

    // Restore focus and move cursor
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

  const totalBars = linesAnalysis.filter(l => l.barNumber !== null).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-obsidian-950 overflow-hidden relative select-none">
      {/* Top Header if not in full Zen mode */}
      {!isZenMode && (
        <EditorHeader
          song={song}
          onUpdateSong={onUpdateSong}
          onInsertSection={handleInsertSection}
          isSaving={isSaving}
        />
      )}

      {/* Main Studio Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 flex overflow-y-auto px-6 sm:px-12 md:px-20 py-8 max-w-4xl mx-auto w-full">
            {/* Left Gutter: 01, 02 subtle line numbers & Syllable counts */}
            <div className="flex flex-col pr-5 select-none text-right font-mono text-xs border-r border-obsidian-700/40 mr-6 space-y-0 leading-[2.1] pt-[2px]">
              {linesAnalysis.map((item) => {
                const isCurrent = activeLineIndex === item.index;
                const formattedNum = String(item.index + 1).padStart(2, '0');

                return (
                  <div
                    key={item.index}
                    className={`h-[33.6px] flex items-center justify-end gap-2.5 transition-fast ${
                      isCurrent ? 'text-accent font-medium' : 'text-obsidian-500'
                    }`}
                    title={item.syllables ? `Line ${item.index + 1} (${item.syllables} syllables)` : `Line ${item.index + 1}`}
                  >
                    <span className="text-[11px] font-mono tracking-tighter w-5 opacity-75">
                      {formattedNum}
                    </span>
                    {item.syllables !== null ? (
                      <span
                        className={`text-[10px] px-1 rounded font-mono ${
                          isCurrent
                            ? 'bg-accent/15 text-accent'
                            : 'text-obsidian-600'
                        }`}
                      >
                        {item.syllables}
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
                className="w-full h-full min-h-[600px] text-obsidian-50 font-devanagari text-base sm:text-lg focus:outline-none resize-none leading-[2.1] tracking-wide placeholder-obsidian-600 lyrics-canvas-textarea"
                autoFocus
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Fast Rhyme Discovery Bar (Unobtrusive & Linear-like) */}
          <div className="border-t border-obsidian-700/60 bg-obsidian-925/90 backdrop-blur-md px-6 sm:px-12 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-3 overflow-x-auto min-w-0">
              <button
                onClick={() => setIsRhymeDrawerOpen(!isRhymeDrawerOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-obsidian-950 hover:bg-obsidian-900 border border-obsidian-700/60 hover:border-rhyme-perfect text-xs font-mono text-accent transition-fast whitespace-nowrap"
                title="Toggle Rhyme Rack (⌘B)"
              >
                <Flame className="w-3.5 h-3.5 text-rhyme-perfect" />
                <span className="font-bold font-devanagari text-white">{cursorWord || 'Rhymes'}</span>
                <span className="text-[10px] text-obsidian-500 font-mono">⌘B</span>
              </button>

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

            {/* Right Status & Drawer Toggles */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-mono text-obsidian-500 hidden sm:inline">
                {totalBars} {totalBars === 1 ? 'bar' : 'bars'}
              </span>

              <button
                onClick={() => {
                  setIsScratchpadOpen(!isScratchpadOpen);
                  if (isRhymeDrawerOpen) setIsRhymeDrawerOpen(false);
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

              <button
                onClick={() => {
                  setIsRhymeDrawerOpen(!isRhymeDrawerOpen);
                  if (isScratchpadOpen) setIsScratchpadOpen(false);
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
          selectedWord={cursorWord}
          onInsertWord={handleInsertWord}
          onViewWordDetails={(word) => setInspectingWord(word)}
        />

        {/* Scratchpad Drawer */}
        <Scratchpad
          isOpen={isScratchpadOpen}
          onClose={() => setIsScratchpadOpen(false)}
          song={song}
          onUpdateSong={onUpdateSong}
          onInsertWord={handleInsertWord}
        />
      </div>

      {/* Full Word Detail Modal */}
      <WordDetailModal
        word={inspectingWord}
        isOpen={!!inspectingWord}
        onClose={() => setInspectingWord(null)}
        onSelectRhyme={handleInsertWord}
        onNavigateWord={(targetWord) => {
          const w = getWordDetails(targetWord);
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
