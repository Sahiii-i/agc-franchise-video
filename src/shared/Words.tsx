import type { CSSProperties } from "react";
import { Easing } from "remotion";

import { clamp01 } from "../kit/time";
import { C, FONT } from "./tokens";

/**
 * Word-by-word lines, after the kit's punchlines: every word holds its slot from
 * the start (opacity, never unmount), so a line never re-centers while it builds.
 * A word blurs in from 16 px, rises 36 px and lands in 0.3 s. `out` blurs the
 * whole block away in 0.18 s.
 */
export type Word = { text: string; at: number; accent?: boolean };

const land = Easing.bezier(0.22, 1, 0.36, 1);

export function Words({
  t,
  lines,
  out = Infinity,
  size,
  color = C.paper,
  accent = C.accent,
  weight = 700,
  align = "center",
  lineHeight = 1.04,
  tracking = -0.035,
  style,
}: {
  t: number;
  lines: Word[][];
  out?: number;
  size: number;
  color?: string;
  accent?: string;
  weight?: number;
  align?: "center" | "left";
  lineHeight?: number;
  tracking?: number;
  style?: CSSProperties;
}) {
  const first = lines[0][0].at;
  if (t < first - 0.05 || t > out + 0.25) return null;
  const leave = clamp01((t - out) / 0.18);
  return (
    <div
      style={{
        display: "grid",
        justifyItems: align === "center" ? "center" : "start",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: `${tracking}em`,
        color,
        opacity: 1 - leave,
        filter: leave > 0 ? `blur(${leave * 12}px)` : undefined,
        ...style,
      }}
    >
      {lines.map((line, row) => (
        <div key={row} style={{ display: "flex", gap: "0.24em", whiteSpace: "nowrap" }}>
          {line.map((word, index) => {
            const u = land(clamp01((t - word.at) / 0.3));
            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  color: word.accent ? accent : undefined,
                  opacity: u,
                  filter: u < 1 ? `blur(${(1 - u) * 16}px)` : undefined,
                  translate: `0 ${(1 - u) * 36 - leave * 16}px`,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Split "Open an *Apex* Global" into words at successive times. `*word*` marks an accent word. */
export function say(text: string, start: number, gap: number): Word[] {
  return text.split(" ").map((raw, index) => {
    const accent = raw.startsWith("*");
    return { text: raw.replace(/\*/g, ""), at: start + index * gap, accent };
  });
}

/** A fade-and-rise for a block that arrives at `from` and leaves at `to`. */
export function rise(t: number, from: number, to = Infinity, distance = 40) {
  const u = land(clamp01((t - from) / 0.35));
  const leave = to === Infinity ? 0 : clamp01((t - to) / 0.2);
  const value = u * (1 - leave);
  return {
    opacity: value,
    translate: `0 ${(1 - u) * distance - leave * 20}px`,
    filter: value < 1 ? `blur(${(1 - value) * 10}px)` : undefined,
  } as const;
}
