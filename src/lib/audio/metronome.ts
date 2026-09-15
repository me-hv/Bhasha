/**
 * Web Audio API Metronome Engine with precision scheduling and tap tempo
 */

class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 90;
  private timeSignature: number = 4; // 4/4
  private currentBeat: number = 0;
  private nextNoteTime: number = 0.0;
  private timerId: number | null = null;
  private volume: number = 0.6;
  private onBeatCallback: ((beat: number, isDownbeat: boolean) => void) | null = null;

  constructor() {
    // Lazy initialize AudioContext on user interaction
  }

  private initAudio() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(40, Math.min(240, newBpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setOnBeat(cb: (beat: number, isDownbeat: boolean) => void) {
    this.onBeatCallback = cb;
  }

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.audioContext) return;

    const isDownbeat = beatNumber === 0;
    
    // Trigger visual callback at the exact scheduled time
    const timeUntilNote = Math.max(0, (time - this.audioContext.currentTime) * 1000);
    setTimeout(() => {
      if (this.isPlaying && this.onBeatCallback) {
        this.onBeatCallback(beatNumber, isDownbeat);
      }
    }, timeUntilNote);

    // Audio click synthesis
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Frequency: High crisp punch on downbeat (1200Hz), mid-woodclick on offbeats (800Hz)
    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, time);
    
    // Envelope: Sharp 25ms click
    gainNode.gain.setValueAtTime(this.volume * (isDownbeat ? 1.0 : 0.7), time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

    osc.start(time);
    osc.stop(time + 0.035);
  }

  private scheduler() {
    if (!this.audioContext || !this.isPlaying) return;

    // Lookahead: 100ms
    const lookahead = 0.1;
    const scheduleInterval = 0.025; // 25ms

    while (this.nextNoteTime < this.audioContext.currentTime + lookahead) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      
      // Advance beat
      const secondsPerBeat = 60.0 / this.bpm;
      this.nextNoteTime += secondsPerBeat;
      this.currentBeat = (this.currentBeat + 1) % this.timeSignature;
    }

    this.timerId = window.setTimeout(() => this.scheduler(), scheduleInterval * 1000);
  }

  public start(bpm?: number) {
    if (this.isPlaying) return;
    this.initAudio();
    if (bpm) this.bpm = bpm;

    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext ? this.audioContext.currentTime + 0.05 : 0;

    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Singleton metronome instance
export const metronome = new MetronomeEngine();
