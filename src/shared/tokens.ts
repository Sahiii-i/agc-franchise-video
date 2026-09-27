// Apex Editorial tokens, copied from agc-website/src/styles/global.css (measured, not invented).
// Hex only: anything that animates goes through interpolateColors, which cannot read color-mix().
export const C = {
  ink: "#0F1416",
  ink2: "#1A2225",
  paper: "#F1F0EC",
  paper2: "#E7E5DF",
  white: "#FFFFFF",
  accent: "#FF6702",
  accentInk: "#C24A00",
  accentSoft: "#FFEADB",
  muted: "#6B7578",
  mutedOnInk: "#9AA3A6",
  ruleOnInk: "rgba(241, 240, 236, 0.18)",
} as const;

export const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export const W = 1080;
export const H = 1920;
export const SIDE = 80; // side margin; platform UI covers the bottom ~280 px and top ~180 px
