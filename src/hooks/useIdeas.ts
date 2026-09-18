'use client';

import { useState, useEffect, useCallback } from 'react';
import { CreativeIdea, IdeaType, IdeaStatus } from '../types';
import {
  getStoredIdeas,
  saveIdea as persistSaveIdea,
  deleteIdea as persistDeleteIdea,
  attachIdeaToSong as persistAttachSong,
  detachIdeaFromSong as persistDetachSong,
  attachWordToIdea as persistAttachWord,
  detachWordFromIdea as persistDetachWord,
} from '../lib/storage/ideas';

export function useIdeas() {
  const [ideas, setIdeas] = useState<CreativeIdea[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIdeas(getStoredIdeas());
    setIsLoaded(true);
  }, []);

  const saveIdea = useCallback((idea: Partial<CreativeIdea> & { title: string }) => {
    const updated = persistSaveIdea(idea);
    setIdeas(updated);
    return updated;
  }, []);

  const deleteIdea = useCallback((ideaId: string) => {
    const updated = persistDeleteIdea(ideaId);
    setIdeas(updated);
    return updated;
  }, []);

  const attachToSong = useCallback((ideaId: string, songId: string) => {
    const updated = persistAttachSong(ideaId, songId);
    setIdeas(updated);
    return updated;
  }, []);

  const detachFromSong = useCallback((ideaId: string, songId: string) => {
    const updated = persistDetachSong(ideaId, songId);
    setIdeas(updated);
    return updated;
  }, []);

  const attachWord = useCallback((ideaId: string, word: string) => {
    const updated = persistAttachWord(ideaId, word);
    setIdeas(updated);
    return updated;
  }, []);

  const detachWord = useCallback((ideaId: string, word: string) => {
    const updated = persistDetachWord(ideaId, word);
    setIdeas(updated);
    return updated;
  }, []);

  return {
    ideas,
    isLoaded,
    saveIdea,
    deleteIdea,
    attachToSong,
    detachFromSong,
    attachWord,
    detachWord,
  };
}
