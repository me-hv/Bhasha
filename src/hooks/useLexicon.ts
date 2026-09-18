'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedWord } from '../types';
import {
  getStoredLexicon,
  saveWordToLexicon,
  removeWordFromLexicon,
  isWordSavedInLexicon,
  getStoredCollections,
  createCollection as persistCreateCollection,
  deleteCollection as persistDeleteCollection,
  toggleWordCollection as persistToggleWordCollection,
  addWordToSongVocabulary as persistAddSongVocab,
  removeWordFromSongVocabulary as persistRemoveSongVocab,
  getRecentWords,
  recordWordInteraction as persistRecordWord,
} from '../lib/storage/lexicon';

export function useLexicon() {
  const [lexicon, setLexicon] = useState<SavedWord[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [recentWords, setRecentWords] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLexicon(getStoredLexicon());
    setCollections(getStoredCollections());
    setRecentWords(getRecentWords());
    setIsLoaded(true);
  }, []);

  const addWord = useCallback((word: Partial<SavedWord> & { devanagari: string }) => {
    const updated = saveWordToLexicon(word);
    setLexicon(updated);
    setRecentWords(getRecentWords());
    return updated;
  }, []);

  const removeWord = useCallback((devanagari: string) => {
    const updated = removeWordFromLexicon(devanagari);
    setLexicon(updated);
    return updated;
  }, []);

  const isSaved = useCallback((devanagari: string) => {
    return isWordSavedInLexicon(devanagari);
  }, [lexicon]);

  // Collections
  const createCollection = useCallback((name: string) => {
    const updated = persistCreateCollection(name);
    setCollections(updated);
    return updated;
  }, []);

  const deleteCollection = useCallback((name: string) => {
    const updated = persistDeleteCollection(name);
    setCollections(updated);
    setLexicon(getStoredLexicon());
    return updated;
  }, []);

  const toggleCollection = useCallback((devanagari: string, collection: string) => {
    const updated = persistToggleWordCollection(devanagari, collection);
    setLexicon(updated);
    return updated;
  }, []);

  // Song Vocabulary
  const saveWordToSongVocabulary = useCallback((songId: string, word: string) => {
    const updated = persistAddSongVocab(songId, word);
    setRecentWords(getRecentWords());
    return updated;
  }, []);

  const removeWordFromSongVocabulary = useCallback((songId: string, word: string) => {
    return persistRemoveSongVocab(songId, word);
  }, []);

  // Interaction
  const recordInteraction = useCallback((devanagari: string) => {
    const updated = persistRecordWord(devanagari);
    setRecentWords(updated);
    return updated;
  }, []);

  return {
    lexicon,
    collections,
    recentWords,
    isLoaded,
    addWord,
    removeWord,
    isSaved,
    createCollection,
    deleteCollection,
    toggleCollection,
    saveWordToSongVocabulary,
    removeWordFromSongVocabulary,
    recordInteraction,
  };
}
