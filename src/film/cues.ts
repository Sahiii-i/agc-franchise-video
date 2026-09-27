import { at, type Grid } from "../kit/time";

// Measured with scripts/beats.py on midnight-funk.mp3: 118.004 BPM, grid spread 4.2 ms.
// The edit (edit.json) starts on song bar 3's downbeat, so the film's grid starts at 0.
export const GRID: Grid = { bpm: 118.004, firstBeat: 0, pickupBeats: 0, beatsPerBar: 4 };
export const BEAT = 60 / GRID.bpm;
export const BARS = 29;
export const DURATION = 58.981;

/** Seconds at a film bar (1-based) and beat. Scene code never holds a literal time. */
export const b = (bar: number, beat = 1, fraction = 0) => at(GRID, bar, beat, fraction);

export const ACT = {
  hook: [b(1), b(4)],
  trainers: [b(4), b(6)],
  reveal: [b(6), b(8)],
  network: [b(8), b(11)],
  students: [b(11), b(13)],
  partners: [b(13), b(15)],
  ninety: [b(15), b(16)],
  months: [b(16), b(21)],
  tiers: [b(21), b(24)],
  montage: [b(24), b(26)],
  support: [b(26), b(27)],
  end: [b(27), DURATION],
} as const;
