import { Easing } from "remotion";

import { camera, type CameraKey } from "../kit/camera";
import { clamp01 } from "../kit/time";
import { C, FONT } from "../shared/tokens";
import { rise, say, splitLines, Words } from "../shared/Words";
import { ACT, BEAT, b } from "./cues";
import { useLayout } from "./layout";
import map from "./map.json";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Every land dot as one path of zero-length round-capped strokes: one element instead of 4,000 circles.
const DOTS = map.dots.map(([x, y]) => `M${x} ${y}h0`).join("");

/**
 * The network: the camera starts close on Singapore HQ, arcs fly out to every office city nearest first,
 * and the camera pulls back to the whole world as the far ones land. The counter tracks the arcs.
 */
export function Network({ t }: { t: number }) {
  const L = useLayout();
  const N = L.network;
  const BAND = N.band;
  const [from, to] = ACT.network;
  if (t < from - 0.05 || t > to + 0.3) return null;
  const leave = clamp01((t - (to - 0.1)) / 0.18);
  const [hx, hy] = map.hq;

  const keys: CameraKey[] = [
    [0, hx, hy, 2.6],
    [b(8, 3), hx + 60, hy - 60, 1.35],
    [b(9, 2), map.width / 2, map.height / 2 + 40, N.fit],
  ];
  const view = camera(t, keys);
  const z = view.zoom;

  // Arcs launch nearest first, spread from beat 2 of bar 8 to the end of bar 9.
  const start = b(8, 2);
  const span = b(10) - start - 0.5;
  const launch = (i: number) => start + (i / map.cities.length) * span;
  const DRAW = 0.45;
  const landed = map.cities.filter((_, i) => t >= launch(i) + DRAW).length;
  const complete = landed === map.cities.length;
  const count = complete ? 40 : Math.floor((40 * landed) / map.cities.length);

  const dotsIn = ease(clamp01((t - from) / 0.5));
  const toScreen = (x: number, y: number) => ({ x: BAND.w / 2 + (x - view.x) * z, y: BAND.h / 2 + (y - view.y) * z });
  const hqScreen = toScreen(hx, hy);
  const beatPhase = ((t - from) / BEAT) % 1;
  const pulse = ease(beatPhase);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 12}px)` : undefined }}>
      <div style={{ position: "absolute", left: N.eyebrow.x, top: N.eyebrow.y, fontFamily: FONT, fontSize: 30, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, ...rise(t, from) }}>
        The network you join
      </div>
      <div style={{ position: "absolute", left: N.head.x, top: N.head.y }}>
        <Words t={t} size={N.head.size} align="left" lines={splitLines(say("Join the Apex network.", b(8, 1, 0.5), BEAT / 2), N.head.split)} />
      </div>

      <div style={{ position: "absolute", left: BAND.x, top: BAND.y, width: BAND.w, height: BAND.h, overflow: "hidden" }}>
        <svg
          width={map.width}
          height={map.height}
          viewBox={`0 0 ${map.width} ${map.height}`}
          style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${BAND.w / 2}px, ${BAND.h / 2}px) scale(${z}) translate(${-view.x}px, ${-view.y}px)`, overflow: "visible" }}
        >
          <path d={DOTS} stroke="#465257" strokeWidth={map.spacing * 0.46} strokeLinecap="round" opacity={dotsIn} />
          {map.cities.map((city, i) => {
            const u = clamp01((t - launch(i)) / DRAW);
            if (u <= 0) return null;
            return (
              <path
                key={city.name}
                d={city.arc}
                fill="none"
                stroke={C.accent}
                strokeWidth={2.4 / z}
                strokeOpacity={0.75}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ease(u)}
              />
            );
          })}
          {map.cities.map((city, i) => {
            const pop = ease(clamp01((t - launch(i) - DRAW) / 0.25));
            if (pop <= 0) return null;
            return <circle key={city.name} cx={city.xy[0]} cy={city.xy[1]} r={(6.5 * pop) / z} fill={C.accent} />;
          })}
          <circle cx={hx} cy={hy} r={(12 + 30 * pulse) / z} fill="none" stroke={C.accent} strokeWidth={2.5 / z} opacity={(1 - pulse) * dotsIn} />
          <circle cx={hx} cy={hy} r={11 / z} fill={C.accent} opacity={dotsIn} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: hqScreen.x + 26,
            top: hqScreen.y - 22,
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 700,
            color: C.paper,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            ...rise(t, from + 0.2, b(9, 1), 16),
          }}
        >
          Singapore HQ
        </div>
      </div>

      <div style={{ position: "absolute", left: N.stat.x, top: N.stat.y, display: "flex", alignItems: "baseline", gap: 26, ...rise(t, b(8, 2)) }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 190, letterSpacing: "-0.05em", color: C.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums", minWidth: "1.72em", textAlign: "right" }}>
          {count}
          <span style={{ opacity: complete ? 1 : 0 }}>+</span>
        </span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 56, letterSpacing: "-0.02em", color: C.paper, lineHeight: 1.05 }}>
          offices
          <br />
          worldwide
        </span>
      </div>
    </div>
  );
}
