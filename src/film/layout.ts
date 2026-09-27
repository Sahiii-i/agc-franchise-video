import { useVideoConfig } from "remotion";

/**
 * Every position in the film, for both frames. Vertical (1080x1920) stacks each scene top to bottom;
 * landscape (1920x1080) puts the words in a left column and the picture on the right.
 * Numbers were measured on review stills (scripts/stills.ts), not guessed.
 */
const VERTICAL = {
  land: false,
  W: 1080,
  H: 1920,
  S: 80,
  mark: { start: [540, 330, 120], reveal: [540, 610, 250], corner: [110, 232, 60], end: [540, 560, 170] },
  hook: { tag: 430, a: { y: 540, size: 140 }, b: { y: 1030, size: 80 } },
  trainers: { card: { x: 80, y: 520, w: 920, h: 690 }, text: { x: 80, y: 1262, size: 76 } },
  reveal: { y: 850, size: 128, split: [3, 5] },
  network: {
    eyebrow: { x: 80, y: 300 },
    head: { x: 80, y: 356, size: 92, split: 99 },
    band: { x: 0, y: 560, w: 1080, h: 700 },
    fit: 0.53,
    stat: { x: 80, y: 1300 },
  },
  students: { eyebrow: { x: 80, y: 290 }, count: { y: 340, size: 200 }, sub: { y: 570, size: 60, split: 99 }, wall: { x: 80, y: 700, w: 1080, h: 920 } },
  partners: { eyebrow: { x: 80, y: 400 }, head: { y: 462, size: 92, three: false }, tiles: { x: 80, y: 800, w: 448, h: 236, cols: 2 } },
  ninety: { eyebrow: 480, from: { x: 540, y: 880, size: 400 }, to: { x: 80, y: 292, size: 150 }, subFrom: { y: 1130, size: 64 }, subTo: { y: 460, size: 40 } },
  months: { rail: { x: 94, top: 600, bottom: 1404 }, tops: [580, 904, 1168], x: 150, w: 850, line: { x: 80, y: 1478, size: 52 } },
  tiers: { eyebrow: { x: 80, y: 330 }, head: { y: 392, size: 80 }, ladder: { x: 80, y: 700, w: 920 }, caption: { x: 80, y: 1482, split: 99 } },
  montage: { eyebrow: 470, card: { x: 80, y: 540, w: 920, h: 740 } },
  support: { y: 960, size: 160 },
  end: { name: 700, rule: 850, eyebrow: 895, whatsapp: 945, url: 1035 },
};

type Layout = typeof VERTICAL;

const LANDSCAPE: Layout = {
  land: true,
  W: 1920,
  H: 1080,
  S: 120,
  mark: { start: [960, 170, 100], reveal: [960, 300, 200], corner: [150, 110, 56], end: [960, 290, 150] },
  hook: { tag: 250, a: { y: 310, size: 120 }, b: { y: 640, size: 72 } },
  trainers: { card: { x: 120, y: 180, w: 1000, h: 720 }, text: { x: 1200, y: 360, size: 76 } },
  reveal: { y: 500, size: 116, split: [5, 8] },
  network: {
    eyebrow: { x: 120, y: 300 },
    head: { x: 120, y: 350, size: 76, split: 3 },
    band: { x: 580, y: 0, w: 1340, h: 1080 },
    fit: 0.66,
    stat: { x: 120, y: 620 },
  },
  students: { eyebrow: { x: 120, y: 330 }, count: { y: 380, size: 180 }, sub: { y: 590, size: 54, split: 3 }, wall: { x: 870, y: 0, w: 1050, h: 1080 } },
  partners: { eyebrow: { x: 120, y: 330 }, head: { y: 390, size: 76, three: true }, tiles: { x: 900, y: 190, w: 440, h: 220, cols: 2 } },
  ninety: { eyebrow: 220, from: { x: 960, y: 500, size: 380 }, to: { x: 120, y: 200, size: 140 }, subFrom: { y: 740, size: 60 }, subTo: { y: 356, size: 36 } },
  months: { rail: { x: 914, top: 190, bottom: 930 }, tops: [170, 470, 720], x: 970, w: 830, line: { x: 120, y: 520, size: 52 } },
  tiers: { eyebrow: { x: 120, y: 330 }, head: { y: 380, size: 76 }, ladder: { x: 900, y: 150, w: 900 }, caption: { x: 120, y: 620, split: 5 } },
  montage: { eyebrow: 110, card: { x: 360, y: 170, w: 1200, h: 780 } },
  support: { y: 540, size: 150 },
  end: { name: 410, rule: 560, eyebrow: 600, whatsapp: 650, url: 740 },
};

export function useLayout(): Layout {
  const { width, height } = useVideoConfig();
  return width > height ? LANDSCAPE : VERTICAL;
}
