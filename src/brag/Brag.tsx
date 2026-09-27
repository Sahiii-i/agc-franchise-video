import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";

import { at, clamp01, progress, useTime, type Grid } from "../kit/time";
import { Music, Sfx, type Hit } from "../shared/Media";
import { Mark } from "../shared/Mark";
import { C, FONT, SIDE } from "../shared/tokens";
import { say, Words } from "../shared/Words";

// /brag-slim cut. Simon Says measured at 119.995 BPM; the edit starts on song bar 15's downbeat.
const GRID: Grid = { bpm: 119.995, firstBeat: 0, pickupBeats: 0, beatsPerBar: 4 };
const BEAT = 60 / GRID.bpm;
const b = (bar: number, beat = 1, fraction = 0) => at(GRID, bar, beat, fraction);
export const BRAG_DURATION = 20;

const SCENE = {
  hook: [0, b(3)],
  reveal: [b(3), b(4)],
  give: [b(4), b(6)],
  launch: [b(6), b(8)],
  tiers: [b(8), b(9, 3)],
  outro: [b(9, 3), BRAG_DURATION],
} as const;

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Staggered scene swap: content slides in from below after `from`, slides up and out just before `to`. */
function slide(t: number, from: number, to: number, delay = 0, distance = 70): CSSProperties {
  const enter = ease(clamp01((t - from - delay) / 0.4));
  const leave = to >= BRAG_DURATION ? 0 : ease(clamp01((t - (to - 0.24)) / 0.24));
  return {
    opacity: enter * (1 - leave),
    translate: `0 ${(1 - enter) * distance - leave * distance}px`,
  };
}

const live = (t: number, [from, to]: readonly [number, number]) => t >= from - 0.02 && t < to;

function Abs({ x = SIDE, y, w, children, style }: { x?: number; y: number; w?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ position: "absolute", left: x, top: y, width: w ?? 1080 - 2 * x, ...style }}>{children}</div>;
}

const eyebrow: CSSProperties = { fontFamily: FONT, fontSize: 28, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accentInk };

function Hook({ t }: { t: number }) {
  if (!live(t, SCENE.hook)) return null;
  const out = SCENE.hook[1] - 0.2;
  return (
    <>
      <Abs y={560}>
        <Words
          t={t}
          size={140}
          color={C.ink}
          out={out}
          lines={[
            [{ text: "Run", at: 0.06 }, { text: "an", at: b(1, 1, 0.5) }],
            [{ text: "education", at: b(1, 2) }],
            [{ text: "business.", at: b(1, 3) }],
          ]}
        />
      </Abs>
      <Abs y={1070}>
        <Words
          t={t}
          size={110}
          color={C.ink}
          out={out}
          lines={[
            [{ text: "We", at: b(2, 1), accent: true }, { text: "handle", at: b(2, 1, 0.5), accent: true }],
            [{ text: "the", at: b(2, 2), accent: true }, { text: "teaching.", at: b(2, 2, 0.5), accent: true }],
          ]}
        />
      </Abs>
    </>
  );
}

function Reveal({ t }: { t: number }) {
  const [from, to] = SCENE.reveal;
  if (!live(t, SCENE.reveal)) return null;
  const photo = ease(clamp01((t - from) / 0.45));
  const leave = ease(clamp01((t - (to - 0.24)) / 0.24));
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, overflow: "hidden", translate: `0 ${(1 - photo) * 900 - leave * 120}px`, opacity: 1 - leave }}>
        <Img src={staticFile("img/grads.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }} />
      </div>
      <Abs y={990} style={{ display: "flex", alignItems: "center", gap: 28, ...slide(t, from, to, 0.18) }}>
        <Mark size={110} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 76, letterSpacing: "-0.035em", color: C.ink, lineHeight: 1 }}>
          Apex Global
          <br />
          Center
        </div>
      </Abs>
      <Abs y={1230}>
        <Words t={t} size={72} color={C.ink} align="left" out={to - 0.2} lines={[say("Open one in your *city.*", from + 0.45, BEAT / 3)]} />
      </Abs>
    </>
  );
}

const GIVES = ["Trainers from Apex HQ", "Partner institution programs", "Staff hiring and screening", "Local launch marketing"];

function Tick({ on }: { on: number }) {
  return (
    <svg width={60} height={60} viewBox="0 0 60 60" style={{ flex: "none", scale: String(0.6 + 0.4 * on), opacity: on }}>
      <circle cx={30} cy={30} r={30} fill={C.accent} />
      <path d="M17 31 L26 40 L44 21" stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - on} />
    </svg>
  );
}

function Give({ t }: { t: number }) {
  const [from, to] = SCENE.give;
  if (!live(t, SCENE.give)) return null;
  const ticks = [b(4, 2), b(4, 4), b(5, 2), b(5, 4)];
  return (
    <div style={{ position: "absolute", left: SIDE, top: 470, width: 920, background: C.white, borderRadius: 2, padding: "56px 56px 24px", ...slide(t, from, to) }}>
      <div style={eyebrow}>What Apex HQ gives you</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 72, letterSpacing: "-0.035em", color: C.ink, lineHeight: 1.05, margin: "14px 0 24px" }}>
        You run the business.
        <br />
        We back it.
      </div>
      {GIVES.map((item, index) => {
        const on = ease(clamp01((t - ticks[index]) / 0.3));
        return (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 0", borderTop: `1px solid rgba(15, 20, 22, 0.14)` }}>
            <Tick on={on} />
            <div style={{ fontFamily: FONT, fontSize: 46, fontWeight: 500, letterSpacing: "-0.015em", color: C.ink, opacity: 0.25 + 0.75 * on }}>{item}</div>
          </div>
        );
      })}
    </div>
  );
}

const MONTHS = [
  { n: 1, name: "Set up" },
  { n: 2, name: "Train" },
  { n: 3, name: "Open" },
];

function Launch({ t }: { t: number }) {
  const [from, to] = SCENE.launch;
  if (!live(t, SCENE.launch)) return null;
  const fills = [b(6, 2, 0.5), b(6, 4, 0.5), b(7, 2, 0.5)];
  const words = say("From contract to grand opening in *90* *days.*", b(6, 1, 0.4), BEAT / 3);
  return (
    <>
      <Abs y={430}>
        <Words t={t} size={100} color={C.ink} align="left" out={to - 0.2} lines={[words.slice(0, 3), words.slice(3, 5), words.slice(5)]} />
      </Abs>
      <div style={{ position: "absolute", left: SIDE, top: 930, width: 920, display: "flex", gap: 16, ...slide(t, from, to, 0.3) }}>
        {MONTHS.map((month, index) => {
          const fill = ease(progress(t, fills[index], 0.7));
          return (
            <div key={month.n} style={{ flex: 1 }}>
              <div style={{ height: 22, background: C.paper2, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", background: C.accent }} />
              </div>
              <div style={{ ...eyebrow, marginTop: 26, fontSize: 24, color: fill > 0.02 ? C.accentInk : C.muted }}>Month {month.n}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 60, letterSpacing: "-0.03em", color: C.ink, opacity: 0.3 + 0.7 * fill, marginTop: 6 }}>{month.name}</div>
            </div>
          );
        })}
      </div>
      <Abs y={1200}>
        <Words t={t} size={60} weight={500} color={C.muted} align="left" tracking={-0.02} out={to - 0.2} lines={[say("Then it's yours to run.", b(7, 1), BEAT / 3)]} />
      </Abs>
    </>
  );
}

const STEPS = [
  { tier: 4, name: "District", note: "Sub franchise" },
  { tier: 3, name: "City", note: "or province" },
  { tier: 2, name: "Country", note: "Master franchise" },
  { tier: 1, name: "HQ", note: "By invitation" },
];

function Tiers({ t }: { t: number }) {
  const [from, to] = SCENE.tiers;
  if (!live(t, SCENE.tiers)) return null;
  const lands = [b(8, 1, 0.3), b(8, 2, 0.3), b(8, 3, 0.3), b(8, 4, 0.3)];
  return (
    <>
      <Abs y={380}>
        <Words t={t} size={92} color={C.ink} align="left" out={to - 0.2} lines={[say("Start with a district.", from + 0.04, BEAT / 4), say("*Grow* from there.", from + 0.6, BEAT / 4)]} />
      </Abs>
      {STEPS.map((step, index) => {
        const start = index === 0;
        return (
          <div
            key={step.tier}
            style={{
              position: "absolute",
              left: SIDE + index * 153,
              top: 1320 - index * 220,
              width: 460,
              height: 200,
              padding: "28px 34px",
              boxSizing: "border-box",
              borderRadius: 2,
              background: start ? C.accent : C.white,
              ...slide(t, lands[index] - 0.02, to, 0, 50),
            }}
          >
            <div style={{ ...eyebrow, fontSize: 24, color: start ? C.ink : C.muted }}>Tier {step.tier}</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 62, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08 }}>{step.name}</div>
            <div style={{ fontFamily: FONT, fontSize: 32, color: start ? C.ink : C.muted }}>{step.note}</div>
          </div>
        );
      })}
    </>
  );
}

function Outro({ t }: { t: number }) {
  const [from] = SCENE.outro;
  if (t < from - 0.02) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 540 - 105, top: 520, ...slide(t, from, BRAG_DURATION, 0, 40) }}>
        <Mark size={210} />
      </div>
      <Abs y={800}>
        <Words t={t} size={90} color={C.ink} lines={[say("Apex Global Center", from + 0.2, BEAT / 3)]} />
      </Abs>
      <Abs y={960} style={{ ...eyebrow, textAlign: "center", ...slide(t, from, BRAG_DURATION, 0.7, 30) }}>Franchise enquiries</Abs>
      <Abs y={1016} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 62, letterSpacing: "-0.02em", color: C.ink, textAlign: "center", ...slide(t, from, BRAG_DURATION, 0.85, 30) }}>
        WhatsApp +65 9225 9877
      </Abs>
      <Abs y={1108} style={{ fontFamily: FONT, fontSize: 44, color: C.muted, textAlign: "center", ...slide(t, from, BRAG_DURATION, 1.0, 30) }}>
        apexglobalcenter.com
      </Abs>
    </>
  );
}

const HITS: Hit[] = [
  { at: b(3), file: "impactSoft_medium_001.wav", volume: 0.4 },
  ...[b(4, 2), b(4, 4), b(5, 2), b(5, 4)].map((at) => ({ at, file: "click_003.wav" as const, volume: 0.3 })),
  ...[b(6, 2, 0.5), b(6, 4, 0.5), b(7, 2, 0.5)].map((at) => ({ at, file: "drop_001.wav" as const, volume: 0.25 })),
  ...[b(8, 1, 0.3), b(8, 2, 0.3), b(8, 3, 0.3), b(8, 4, 0.3)].map((at) => ({ at, file: "card-slide-1.wav" as const, volume: 0.18 })),
  { at: b(9, 3), file: "impactBell_heavy_000.wav", volume: 0.2 },
];

export function Brag() {
  const t = useTime();
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <Hook t={t} />
      <Reveal t={t} />
      <Give t={t} />
      <Launch t={t} />
      <Tiers t={t} />
      <Outro t={t} />
      <Music file="brag-edit.wav" volume={0.85} />
      <Sfx hits={HITS} />
    </AbsoluteFill>
  );
}
