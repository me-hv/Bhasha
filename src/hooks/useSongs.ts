'use client';

import { useState, useEffect, useCallback } from 'react';
import { Song } from '../types';
import {
  getStoredSongs,
  saveSong as persistSong,
  deleteSong as persistDeleteSong,
  duplicateSong as persistDuplicateSong,
  createNewSong as persistCreateNewSong,
} from '../lib/storage/songs';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '../lib/storage/storage';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate on mount
  useEffect(() => {
    const loadedSongs = getStoredSongs();
    setSongs(loadedSongs);

    const storedActiveId = getFromStorage<string | null>(STORAGE_KEYS.ACTIVE_SONG_ID, null);
    if (storedActiveId && loadedSongs.some(s => s.id === storedActiveId)) {
      setActiveSongId(storedActiveId);
    } else if (loadedSongs.length > 0) {
      setActiveSongId(loadedSongs[0].id);
    }
    setIsLoaded(true);
  }, []);

  const selectSong = useCallback((id: string) => {
    setActiveSongId(id);
    setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, id);
  }, []);

  const updateSong = useCallback((updatedSong: Song) => {
    const updatedList = persistSong(updatedSong);
    setSongs(updatedList);
  }, []);

  const createSong = useCallback((title = 'UNTITLED TRACK', bpm = 92, key = 'Am'): Song => {
    const newSong = persistCreateNewSong(title, bpm, key);
    const updatedList = getStoredSongs();
    setSongs(updatedList);
    setActiveSongId(newSong.id);
    setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, newSong.id);
    return newSong;
  }, []);

  const deleteSong = useCallback((id: string) => {
    const updatedList = persistDeleteSong(id);
    setSongs(updatedList);
    if (activeSongId === id) {
      const nextId = updatedList.length > 0 ? updatedList[0].id : null;
      setActiveSongId(nextId);
      setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, nextId);
    }
  }, [activeSongId]);

  const duplicateSong = useCallback((id: string): Song | null => {
    const duplicated = persistDuplicateSong(id);
    if (duplicated) {
      const updatedList = getStoredSongs();
      setSongs(updatedList);
      setActiveSongId(duplicated.id);
      setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, duplicated.id);
    }
    return duplicated;
  }, []);

  const activeSong = songs.find(s => s.id === activeSongId) || (songs.length > 0 ? songs[0] : null);

  return {
    songs,
    activeSong,
    activeSongId,
    isLoaded,
    selectSong,
    updateSong,
    createSong,
    deleteSong,
    duplicateSong,
  };
}
