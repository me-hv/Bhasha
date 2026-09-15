'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { metronome } from '../lib/audio/metronome';

export function useMetronome(initialBpm: number = 92) {
  const [bpm, setBpm] = useState<number>(initialBpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [isDownbeat, setIsDownbeat] = useState<boolean>(false);
  
  // Tap tempo state
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    metronome.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    metronome.setOnBeat((beat, downbeat) => {
      setCurrentBeat(beat);
      setIsDownbeat(downbeat);
    });

    return () => {
      metronome.stop();
    };
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      metronome.stop();
      setIsPlaying(false);
    } else {
      metronome.start(bpm);
      setIsPlaying(true);
    }
  }, [isPlaying, bpm]);

  const changeBpm = useCallback((newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    setBpm(clamped);
    metronome.setBpm(clamped);
  }, []);

  const tapTempo = useCallback(() => {
    const now = Date.now();
    const times = tapTimesRef.current;

    // Reset if last tap was more than 2.5 seconds ago
    if (times.length > 0 && now - times[times.length - 1] > 2500) {
      tapTimesRef.current = [now];
      return;
    }

    times.push(now);
    if (times.length > 5) {
      times.shift();
    }

    if (times.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < times.length; i++) {
        intervals.push(times[i] - times[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const detectedBpm = Math.round(60000 / avgInterval);
      if (detectedBpm >= 40 && detectedBpm <= 240) {
        changeBpm(detectedBpm);
      }
    }
  }, [changeBpm]);

  return {
    bpm,
    isPlaying,
    currentBeat,
    isDownbeat,
    toggle,
    changeBpm,
    tapTempo,
  };
}
