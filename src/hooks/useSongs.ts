'use client';

import { useState, useEffect, useCallback } from 'react';
import { Song, SongVersion } from '../types';
import {
  getStoredSongs,
  saveSong as persistSong,
  deleteSong as persistDeleteSong,
  duplicateSong as persistDuplicateSong,
  createNewSong as persistCreateNewSong,
  archiveSong as persistArchiveSong,
  restoreSong as persistRestoreSong,
  getStoredVersions,
  saveVersionSnapshot as persistSaveVersion,
  deleteVersionSnapshot as persistDeleteVersion,
  restoreVersionSnapshot as persistRestoreVersion,
} from '../lib/storage/songs';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '../lib/storage/storage';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [versions, setVersions] = useState<SongVersion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate on mount
  useEffect(() => {
    const loadedSongs = getStoredSongs();
    setSongs(loadedSongs);

    const storedActiveId = getFromStorage<string | null>(STORAGE_KEYS.ACTIVE_SONG_ID, null);
    let selectedId = null;
    if (storedActiveId && loadedSongs.some(s => s.id === storedActiveId)) {
      selectedId = storedActiveId;
    } else if (loadedSongs.length > 0) {
      selectedId = loadedSongs[0].id;
    }
    setActiveSongId(selectedId);

    if (selectedId) {
      setVersions(getStoredVersions(selectedId));
    }

    setIsLoaded(true);
  }, []);

  const selectSong = useCallback((id: string) => {
    setActiveSongId(id);
    setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, id);
    setVersions(getStoredVersions(id));
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
    setVersions([]);
    return newSong;
  }, []);

  const deleteSong = useCallback((id: string) => {
    const updatedList = persistDeleteSong(id);
    setSongs(updatedList);
    if (activeSongId === id) {
      const nextId = updatedList.length > 0 ? updatedList[0].id : null;
      setActiveSongId(nextId);
      setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, nextId);
      if (nextId) setVersions(getStoredVersions(nextId));
      else setVersions([]);
    }
  }, [activeSongId]);

  const duplicateSong = useCallback((id: string, customTitle?: string): Song | null => {
    const duplicated = persistDuplicateSong(id, customTitle);
    if (duplicated) {
      const updatedList = getStoredSongs();
      setSongs(updatedList);
      setActiveSongId(duplicated.id);
      setToStorage(STORAGE_KEYS.ACTIVE_SONG_ID, duplicated.id);
      setVersions([]);
    }
    return duplicated;
  }, []);

  const archiveSong = useCallback((id: string) => {
    const updatedList = persistArchiveSong(id);
    setSongs(updatedList);
  }, []);

  const restoreSong = useCallback((id: string) => {
    const updatedList = persistRestoreSong(id);
    setSongs(updatedList);
  }, []);

  // Versions / Snapshots
  const createVersion = useCallback((song: Song, label: string): SongVersion => {
    const snapshot = persistSaveVersion(song, label);
    if (activeSongId === song.id) {
      setVersions(getStoredVersions(song.id));
    }
    return snapshot;
  }, [activeSongId]);

  const deleteVersion = useCallback((versionId: string) => {
    persistDeleteVersion(versionId);
    if (activeSongId) {
      setVersions(getStoredVersions(activeSongId));
    }
  }, [activeSongId]);

  const restoreVersion = useCallback((snapshotId: string): Song | null => {
    const result = persistRestoreVersion(snapshotId);
    if (result) {
      const updatedList = getStoredSongs();
      setSongs(updatedList);
      if (activeSongId === result.restoredSong.id) {
        setVersions(getStoredVersions(result.restoredSong.id));
      }
      return result.restoredSong;
    }
    return null;
  }, [activeSongId]);

  const getVersionsForSong = useCallback((songId: string): SongVersion[] => {
    return getStoredVersions(songId);
  }, []);

  const activeSong = songs.find(s => s.id === activeSongId) || (songs.length > 0 ? songs[0] : null);

  return {
    songs,
    activeSong,
    activeSongId,
    versions,
    isLoaded,
    selectSong,
    updateSong,
    createSong,
    deleteSong,
    duplicateSong,
    archiveSong,
    restoreSong,
    createVersion,
    deleteVersion,
    restoreVersion,
    getVersionsForSong,
  };
}
