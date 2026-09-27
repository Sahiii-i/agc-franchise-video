import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolateColors, staticFile } from "remotion";

import { step, track, type SpringConfig } from "../kit/spring";
import { clamp01, progress, useTime } from "../kit/time";
import { Clip, Music, Sfx, type Hit } from "../shared/Media";
import { Mark } from "../shared/Mark";
import { C, FONT, SIDE } from "../shared/tokens";
import { rise, say, Words } from "../shared/Words";
import { ACT, BEAT, b } from "./cues";
import { Network } from "./Network";

const glide: SpringConfig = { stiffness: 150, damping: 20, mass: 1 };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const lerp = (a: number, z: number, u: number) => a + (z - a) * u;
const within = (t: number, [from, to]: readonly [number, number], tail = 0.3) => t >= from - 0.05 && t < to + tail;

const eyebrow = (color: string): CSSProperties => ({
  fontFamily: FONT,
  fontSize: 30,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color,
});

function Abs({ x = SIDE, y, w, children, style }: { x?: number; y: number; w?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ position: "absolute", left: x, top: y, width: w ?? 1080 - 2 * x, ...style }}>{children}</div>;
}

/** Blur the whole act away over its last 0.18 s. */
const exit = (t: number, to: number): CSSProperties => {
  const leave = clamp01((t - (to - 0.1)) / 0.18);
  return { position: "absolute", inset: 0, opacity: 1 - leave, filter: leave > 0 ? `blur(${leave * 12}px)` : undefined };
};

/** The one Apex mark: draws itself, travels to center on the drop, rests in the corner, returns for the end card. */
function BrandMark({ t }: { t: number }) {
  const x = track(t, [[0, 540], [ACT.reveal[0], 540], [ACT.network[0], SIDE + 30], [ACT.end[0], 540]], glide);
  const y = track(t, [[0, 330], [ACT.reveal[0], 610], [ACT.network[0], 232], [ACT.end[0], 420]], glide);
  const size = track(t, [[0, 120], [ACT.reveal[0], 250], [ACT.network[0], 60], [ACT.end[0], 150]], glide);
  const draw = ease(progress(t, 0.02, 1.0));
  const fill = ease(progress(t, b(1, 3), 0.3));
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2 }}>
      <Mark size={size} draw={draw} fill={fill} />
    </div>
  );
}

function Hook({ t }: { t: number }) {
  const [, to] = ACT.hook;
  if (!within(t, ACT.hook)) return null;
  const tag = rise(t, b(1, 4), ACT.trainers[1] - 0.1);
  return (
    <>
      <Abs y={430} style={{ ...eyebrow(C.mutedOnInk), textAlign: "center", ...tag }}>Apex Global Center</Abs>
      <Abs y={540}>
        <Words
          t={t}
          size={140}
          out={to - 0.12}
          lines={[
            [{ text: "Own", at: b(1, 1, 0.5) }, { text: "an", at: b(1, 2) }],
            [{ text: "education", at: b(1, 3) }],
            [{ text: "business.", at: b(1, 4) }],
          ]}
        />
      </Abs>
      <Abs y={1030}>
        <Words
          t={t}
          size={80}
          out={to - 0.12}
          tracking={-0.03}
          lines={[
            [{ text: "High", at: b(2, 3) }, { text: "quality", at: b(2, 3, 0.5) }, { text: "&", at: b(2, 4) }],
            [{ text: "extremely", at: b(2, 4, 0.5), accent: true }, { text: "affordable", at: b(3, 1), accent: true }],
            [{ text: "education.", at: b(3, 1, 0.5) }],
          ]}
        />
      </Abs>
    </>
  );
}

function Trainers({ t }: { t: number }) {
  const [from, to] = ACT.trainers;
  if (!within(t, ACT.trainers)) return null;
  const card = rise(t, from, to - 0.12, 80);
  const box: CSSProperties = { position: "absolute", left: SIDE, top: 520, width: 920, height: 690, borderRadius: 2, overflow: "hidden", background: C.ink2, ...card };
  const fill: CSSProperties = { position: "absolute", inset: 0 };
  return (
    <>
      <div style={box}>
        <Clip src="video/event-a.mp4" from={from} to={b(4, 3)} start={15.2} style={fill} />
        <Clip src="video/event-a.mp4" from={b(4, 3)} to={b(5)} start={30.4} style={fill} />
        <Clip src="video/event-a.mp4" from={b(5)} to={b(5, 3)} start={4.0} style={fill} />
        <Clip src="video/event-b.mp4" from={b(5, 3)} to={to} start={9.0} style={fill} />
      </div>
      <Abs y={1262}>
        <Words t={t} size={76} align="left" out={to - 0.12} lines={[say("Trainers come", b(4, 2), BEAT / 2), say("from Apex HQ.", b(4, 3), BEAT / 2)]} />
      </Abs>
      <Abs y={1430}>
        <Words t={t} size={76} align="left" out={to - 0.12} color={C.accent} lines={[say("You run the business.", b(5, 1), BEAT / 2)]} />
      </Abs>
    </>
  );
}

function Reveal({ t }: { t: number }) {
  const [, to] = ACT.reveal;
  if (!within(t, ACT.reveal)) return null;
  const all = say("Open an Apex Global Center in your *city.*", b(6, 1, 0.5), BEAT / 2);
  return (
    <Abs y={850}>
      <Words t={t} size={128} out={to - 0.12} lines={[all.slice(0, 3), all.slice(3, 5), all.slice(5)]} />
    </Abs>
  );
}

const WALL = [
  "apex_trainee_cert_woman_imtc_attendance", "apex_trainee_cert_man_kingston_attendance", "apex_trainee_cert_woman_laptop_leaders",
  "apex_trainee_cert_woman_holding_sheet", "apex_grad_woman_diplomas_open", "apex_trainee_cert_man_certificate",
  "apex_trainee_cert_woman_hijab_tablet", "apex_trainee_cert_woman_glasses_imtc", "apex_grad_man_esta_kingston_certs",
  "apex_trainee_cert_woman_timor_flag", "apex_trainee_cert_man_glasses_sheet", "apex_trainee_cert_woman_kingston_navy",
  "apex_trainee_cert_woman_blue_wall", "apex_trainee_cert_woman_long_hair", "apex_trainee_cert_nurse_phone_kingston",
  "apex_grad_woman_keele_kingston_certs", "apex_trainee_cert_woman_grey_imtc", "apex_trainee_cert_man_laptop_bistalk",
  "apex_trainee_cert_woman_tablet_orange", "apex_trainee_cert_woman_imtc_selfie", "apex_trainee_cert_man_red_shirt_phone",
  "apex_trainee_cert_woman_leaders_commerce", "apex_grad_woman_red_dress_kingston", "apex_trainee_cert_woman_hijab_phone",
  "apex_trainee_cert_woman_dark_hair_imtc", "apex_trainee_cert_woman_laptop_kingston", "apex_trainee_cert_man_desktop_imtc",
  "apex_trainee_cert_woman_jersey_phone", "apex_trainee_cert_woman_flower_phone", "apex_trainee_cert_man_blue_shirt_phone",
];

/** 50,000+ students: the counter runs up while a wall of real certificate photos scrolls past in three columns. */
function Students({ t }: { t: number }) {
  const [from, to] = ACT.students;
  if (!within(t, ACT.students)) return null;
  const n = Math.round(50000 * ease(progress(t, from + 0.1, 2.2 * BEAT)));
  const done = t >= from + 0.1 + 2.2 * BEAT;
  const tileW = 296;
  const tileH = 360;
  const gap = 16;
  const bandTop = 700;
  const bandH = 920;
  const lift = ease(clamp01((t - from) / 0.55));
  const speeds = [95, 140, 115];
  return (
    <div style={exit(t, to)}>
      <Abs y={290} style={{ ...eyebrow(C.accent), ...rise(t, from) }}>Our online platform</Abs>
      <Abs y={340} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 200, letterSpacing: "-0.05em", color: C.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums", ...rise(t, from, Infinity, 30) }}>
        {n.toLocaleString("en-US")}
        <span style={{ opacity: done ? 1 : 0 }}>+</span>
      </Abs>
      <Abs y={570}>
        <Words t={t} size={60} align="left" tracking={-0.02} lines={[say("students on our online platform.", b(11, 3), BEAT / 3)]} />
      </Abs>
      <div style={{ position: "absolute", left: 0, top: bandTop, width: 1080, height: bandH, overflow: "hidden" }}>
        {[0, 1, 2].map((col) => {
          const offset = (1 - lift) * bandH - speeds[col] * (t - from) - col * 120;
          return (
            <div key={col} style={{ position: "absolute", left: SIDE + col * (tileW + gap), top: offset, display: "grid", gap }}>
              {WALL.filter((_, i) => i % 3 === col).map((file) => (
                <Img key={file} src={staticFile(`img/wall/${file}.jpg`)} style={{ width: tileW, height: tileH, objectFit: "cover", borderRadius: 2, display: "block" }} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PARTNERS = [
  "kic.png",
  "european-city-of-university-ecu.png",
  "international-american-university-iau.png",
  "orange-county-university-logo-design.png",
  "kangwon-national-university-logo-design.png",
  "city-of-manchester.png",
];

function Partners({ t }: { t: number }) {
  const [from] = ACT.partners;
  if (!within(t, ACT.partners, 0)) return null;
  const lands = [b(13, 3), b(13, 4), b(14, 1), b(14, 2), b(14, 3), b(14, 4)];
  return (
    <>
      <Abs y={400} style={{ ...eyebrow(C.accentInk), ...rise(t, from) }}>Programs from partner institutions</Abs>
      <Abs y={462}>
        <Words
          t={t}
          size={92}
          align="left"
          color={C.ink}
          accent={C.accentInk}
          lines={[say("Diplomas, degrees", b(13, 1, 0.5), BEAT / 2), say("and master's programs.", b(13, 2, 0.5), BEAT / 2)]}
        />
      </Abs>
      {PARTNERS.map((file, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const u = ease(clamp01((t - lands[index]) / 0.3));
        return (
          <div
            key={file}
            style={{
              position: "absolute",
              left: SIDE + col * (448 + 24),
              top: 800 + row * (236 + 24),
              width: 448,
              height: 236,
              background: C.white,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              opacity: u,
              scale: String(0.94 + 0.06 * u),
              translate: `0 ${(1 - u) * 24}px`,
            }}
          >
            <Img src={staticFile(`img/partners/${file}`)} style={{ maxWidth: 360, maxHeight: 172, width: "auto", height: "auto", objectFit: "contain" }} />
          </div>
        );
      })}
    </>
  );
}

/** The 90 counts up center stage, then travels into the timeline's header and stays there. */
function Ninety({ t }: { t: number }) {
  const [from] = ACT.ninety;
  if (!within(t, [from, ACT.months[1]])) return null;
  const leave = clamp01((t - (ACT.months[1] - 0.1)) / 0.18);
  const count = Math.round(90 * ease(progress(t, from, 2 * BEAT)));
  const u = step(t - ACT.months[0], glide);
  const size = lerp(400, 150, u);
  const block: CSSProperties = {
    position: "absolute",
    left: lerp(540, SIDE, u),
    top: lerp(880, 292, u),
    translate: `${lerp(-50, 0, u)}% ${lerp(-50, 0, u)}%`,
    display: "flex",
    alignItems: "baseline",
    gap: "0.12em",
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: size,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    color: C.accent,
    fontVariantNumeric: "tabular-nums",
    opacity: (t < from + 0.02 ? 0 : 1) * (1 - leave),
    filter: leave > 0 ? `blur(${leave * 12}px)` : undefined,
  };
  const days = ease(clamp01((t - b(15, 3)) / 0.3));
  return (
    <>
      <Abs y={480} style={{ ...eyebrow(C.accent), textAlign: "center", ...rise(t, from, ACT.months[0] - 0.1) }}>
        The 3-month launch programme
      </Abs>
      <div style={block}>
        <span style={{ minWidth: "1.12em", textAlign: "right" }}>{count}</span>
        <span style={{ fontSize: "0.3em", color: C.paper, letterSpacing: "-0.02em", opacity: days }}>days</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: lerp(540, SIDE, u),
          top: lerp(1130, 460, u),
          translate: `${lerp(-50, 0, u)}% 0`,
          width: 920,
          textAlign: u < 0.5 ? "center" : "left",
          opacity: 1 - leave,
        }}
      >
        <Words
          t={t}
          size={lerp(64, 40, u)}
          weight={u < 0.5 ? 700 : 500}
          color={u < 0.5 ? C.paper : C.mutedOnInk}
          tracking={-0.02}
          align={u < 0.5 ? "center" : "left"}
          lines={[say("of launch support from Apex HQ.", b(15, 3, 0.5), BEAT / 3)]}
        />
      </div>
    </>
  );
}

const MONTHS = [
  { n: 1, title: "Set up", items: ["Centre fit-out to Apex standards", "HQ recruits and screens your team", "Local advertising starts"] },
  { n: 2, title: "Train", items: ["Staff trained by Apex master trainers", "Soft launch events"] },
  { n: 3, title: "Open", items: ["Grand opening", "Handover to you"] },
];

function Months({ t }: { t: number }) {
  const [from, to] = ACT.months;
  if (!within(t, ACT.months)) return null;
  const railTop = 600;
  const railBottom = 1404;
  const fill = progress(t, from, 3 * 4 * BEAT);
  const tops = [580, 904, 1168];
  return (
    <div style={exit(t, to)}>
      <div style={{ position: "absolute", left: SIDE + 14, top: railTop, width: 4, height: railBottom - railTop, background: C.ruleOnInk }} />
      <div style={{ position: "absolute", left: SIDE + 14, top: railTop, width: 4, height: (railBottom - railTop) * fill, background: C.accent }} />
      {MONTHS.map((month, index) => {
        // Month 1 waits half a bar so it never crosses the 90 while it travels into the header.
        const land = index === 0 ? b(16, 2) : b(16 + index);
        const itemAt = (i: number) => (index === 0 ? [b(16, 3), b(16, 3, 0.5), b(16, 4)][i] : b(16 + index, 2 + i));
        const lit = ease(clamp01((t - land) / 0.25));
        return (
          <div key={month.n}>
            <div
              style={{
                position: "absolute",
                left: SIDE + 4,
                top: tops[index] + 10,
                width: 24,
                height: 24,
                borderRadius: 12,
                background: interpolateColors(lit, [0, 1], [C.ink2, C.accent]),
                border: `3px solid ${interpolateColors(lit, [0, 1], ["#3A4447", C.accent])}`,
              }}
            />
            <Abs x={SIDE + 70} y={tops[index]} w={850}>
              <div style={{ ...eyebrow(C.accent), fontSize: 28, ...rise(t, land) }}>Month {month.n}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 76, letterSpacing: "-0.03em", color: C.paper, lineHeight: 1.1, ...rise(t, land + 0.06) }}>{month.title}</div>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {month.items.map((item, i) => (
                  <div
                    key={item}
                    style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontSize: 38, color: C.paper2, letterSpacing: "-0.01em", ...rise(t, itemAt(i), Infinity, 24) }}
                  >
                    <span style={{ width: 12, height: 12, background: C.accent, flex: "none" }} />
                    {item}
                  </div>
                ))}
              </div>
            </Abs>
          </div>
        );
      })}
      <Abs y={1478}>
        <Words
          t={t}
          size={52}
          align="left"
          tracking={-0.025}
          lines={[say("From signed contract", b(19, 1), BEAT / 2), say("to independent operation,", b(19, 2, 0.5), BEAT / 2), say("in *90* *days.*", b(19, 4), BEAT / 2)]}
        />
      </Abs>
    </div>
  );
}

const TIERS = [
  { tier: 1, name: "HQ", note: ["By invitation"] },
  { tier: 2, name: "Country", note: ["Master franchise"] },
  { tier: 3, name: "City or province", note: [] as string[] },
  { tier: 4, name: "District", note: ["Sub franchise", "Exclusive territory"] },
];

function Tiers({ t }: { t: number }) {
  const [from] = ACT.tiers;
  if (!within(t, ACT.tiers, 0)) return null;
  const top0 = 700;
  const tileH = 170;
  const gap = 18;
  const tileTop = (i: number) => top0 + i * (tileH + gap);
  const lands = [b(22, 2, 0.5), b(22, 2), b(22, 1, 0.5), b(22, 1)];
  // One orange tile travels up the ladder: on District once it lands, then one tier per beat in bar 23.
  const hiY = track(t, [[0, tileTop(3)], [b(23, 1), tileTop(2)], [b(23, 2), tileTop(1)], [b(23, 3), tileTop(0)]], glide);
  const hiOn = ease(clamp01((t - (b(22, 1) + 0.25)) / 0.25));
  const labels = (main: string, sub: string) =>
    TIERS.map((tier, i) => {
      const u = ease(clamp01((t - lands[i]) / 0.3));
      return (
        <div
          key={tier.tier}
          style={{ position: "absolute", left: SIDE + 40, top: tileTop(i), width: 840, height: tileH, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: u, translate: `0 ${(1 - u) * 40}px` }}
        >
          <div>
            <div style={{ ...eyebrow(sub), fontSize: 24 }}>Tier {tier.tier}</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 60, letterSpacing: "-0.03em", color: main, lineHeight: 1.1 }}>{tier.name}</div>
          </div>
          <div style={{ textAlign: "right", fontFamily: FONT, fontSize: 32, color: sub, lineHeight: 1.3 }}>
            {tier.note.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      );
    });
  return (
    <>
      <Abs y={330} style={{ ...eyebrow(C.accent), ...rise(t, from) }}>Four franchise tiers</Abs>
      <Abs y={392}>
        <Words t={t} size={80} align="left" lines={[say("Start with a district.", b(21, 1, 0.5), BEAT / 2), say("*Grow* from there.", b(21, 3, 0.5), BEAT / 2)]} />
      </Abs>
      {TIERS.map((tier, i) => {
        const u = ease(clamp01((t - lands[i]) / 0.3));
        return (
          <div key={tier.tier} style={{ position: "absolute", left: SIDE, top: tileTop(i), width: 920, height: tileH, background: C.ink2, borderRadius: 2, opacity: u, translate: `0 ${(1 - u) * 40}px` }} />
        );
      })}
      {labels(C.paper, C.mutedOnInk)}
      {/* The orange tile masks an ink copy of the labels, so text turns ink exactly where the tile covers it. */}
      <div style={{ position: "absolute", left: SIDE, top: hiY, width: 920, height: tileH, background: C.accent, borderRadius: 2, opacity: hiOn, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -SIDE, top: -hiY, width: 1080, height: 1920 }}>{labels(C.ink, C.ink)}</div>
      </div>
      <Abs y={1482}>
        <Words t={t} size={40} weight={500} align="left" color={C.mutedOnInk} tracking={-0.01} lines={[say("Strong performers can apply to move up a tier.", b(22, 3), BEAT / 3)]} />
      </Abs>
    </>
  );
}

type Shot = { img?: string; clip?: { src: string; start: number } };
const SHOTS: Shot[] = [
  { img: "apex_students_grad_cohort_balloons" },
  { clip: { src: "video/event-b.mp4", start: 1.0 } },
  { img: "apex_ecu_grads_paris_garden_large" },
  { img: "apex_students_grad_trio_women_diplomas" },
  { clip: { src: "video/event-b.mp4", start: 47.5 } },
  { img: "apex_ecu_grads_green_gold_robes" },
  { img: "apex_students_grad_woman_hijab_diploma" },
  { img: "apex_ecu_grads_red_robes_women" },
];

/** Eight real graduation moments, one per beat, each with a slow push-in. */
function Montage({ t }: { t: number }) {
  const [from, to] = ACT.montage;
  if (!within(t, ACT.montage, 0)) return null;
  const cut = (i: number) => from + i * BEAT;
  const fill: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  return (
    <>
      <Abs y={470} style={{ ...eyebrow(C.accent), textAlign: "center", ...rise(t, from) }}>Our students</Abs>
      <div style={{ position: "absolute", left: SIDE, top: 540, width: 920, height: 740, borderRadius: 2, overflow: "hidden", background: C.ink2, ...rise(t, from, Infinity, 60) }}>
        {SHOTS.map((shot, i) => {
          const a = cut(i);
          const z = i === SHOTS.length - 1 ? to : cut(i + 1);
          if (shot.clip) return <Clip key={i} src={shot.clip.src} from={a} to={z} start={shot.clip.start} style={fill} />;
          if (t < a || t >= z) return null;
          const push = 1 + 0.07 * clamp01((t - a) / BEAT);
          return <Img key={i} src={staticFile(`img/montage/${shot.img}.jpg`)} style={{ ...fill, objectFit: "cover", scale: String(push) }} />;
        })}
      </div>
    </>
  );
}

function Support({ t }: { t: number }) {
  const [, to] = ACT.support;
  if (!within(t, ACT.support)) return null;
  return (
    <Abs y={960} style={{ translate: "0 -50%" }}>
      <Words
        t={t}
        size={160}
        out={to - 0.1}
        lines={[[{ text: "Support", at: b(26, 1) }], [{ text: "from", at: b(26, 2) }, { text: "day", at: b(26, 2, 0.5) }], [{ text: "one.", at: b(26, 3), accent: true }]]}
      />
    </Abs>
  );
}

function Rule({ t, y, at }: { t: number; y: number; at: number }) {
  const u = ease(clamp01((t - at) / 0.4));
  return <div style={{ position: "absolute", left: SIDE, top: y, width: 920 * u, height: 2, background: C.ruleOnInk }} />;
}

function End({ t }: { t: number }) {
  const [from] = ACT.end;
  if (t < from - 0.05) return null;
  const line: CSSProperties = { fontFamily: FONT, textAlign: "center", letterSpacing: "-0.02em" };
  return (
    <>
      <Abs y={520}>
        <Words t={t} size={76} lines={[say("Apex Global Center", b(27, 1, 0.5), BEAT / 2)]} />
      </Abs>
      <Rule t={t} y={670} at={b(27, 3)} />
      <Abs y={712} style={{ ...eyebrow(C.accent), textAlign: "center", ...rise(t, b(27, 3)) }}>Meet us at</Abs>
      <Abs y={760}>
        <Words t={t} size={180} tracking={-0.05} lines={[[{ text: "VIFS", at: b(27, 3, 0.5) }, { text: "2026", at: b(27, 4), accent: true }]]} />
      </Abs>
      <Abs y={962} style={{ ...line, fontSize: 40, color: C.mutedOnInk, ...rise(t, b(27, 4, 0.5)) }}>Vietnam International Franchise Show</Abs>
      <Abs y={1016} style={{ ...line, fontSize: 52, fontWeight: 700, color: C.paper, lineHeight: 1.2, ...rise(t, b(28, 1)) }}>
        29 to 31 October
        <br />
        SECC, Ho Chi Minh City
      </Abs>
      <Rule t={t} y={1168} at={b(28, 2)} />
      <Abs y={1206} style={{ ...eyebrow(C.accent), textAlign: "center", ...rise(t, b(28, 2)) }}>Franchise enquiries</Abs>
      <Abs y={1254} style={{ ...line, fontSize: 60, fontWeight: 700, color: C.paper, ...rise(t, b(28, 2, 0.5)) }}>WhatsApp +65 9225 9877</Abs>
      <Abs y={1342} style={{ ...line, fontSize: 44, color: C.mutedOnInk, ...rise(t, b(28, 3)) }}>apexglobalcenter.com</Abs>
    </>
  );
}

const HITS: Hit[] = [
  { at: b(1, 3), file: "rollover2.wav", volume: 0.25 },
  { at: b(4), file: "card-slide-1.wav", volume: 0.3 },
  ...[b(4, 3), b(5), b(5, 3)].map((at) => ({ at, file: "click_003.wav" as const, volume: 0.3 })),
  { at: b(6), file: "impactSoft_medium_001.wav", volume: 0.5 },
  { at: b(6), file: "impactBell_heavy_000.wav", volume: 0.22 },
  { at: b(8), file: "impactSoft_medium_004.wav", volume: 0.35 },
  { at: b(11), file: "card-slide-1.wav", volume: 0.3 },
  ...[b(13, 3), b(13, 4), b(14, 1), b(14, 2), b(14, 3), b(14, 4)].map((at) => ({ at, file: "drop_001.wav" as const, volume: 0.22 })),
  { at: b(15), file: "impactSoft_medium_004.wav", volume: 0.45 },
  ...[b(16, 2), b(17), b(18)].map((at) => ({ at, file: "click_003.wav" as const, volume: 0.3 })),
  ...[b(22, 1), b(22, 1, 0.5), b(22, 2), b(22, 2, 0.5)].map((at) => ({ at, file: "card-slide-1.wav" as const, volume: 0.2 })),
  ...[b(23, 1), b(23, 2), b(23, 3)].map((at) => ({ at, file: "rollover2.wav" as const, volume: 0.25 })),
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => ({ at: ACT.montage[0] + i * BEAT, file: "click_003.wav" as const, volume: 0.22 })),
  { at: b(26, 3), file: "impactSoft_medium_004.wav", volume: 0.4 },
  { at: b(27), file: "impactBell_heavy_000.wav", volume: 0.22 },
];

export function Film() {
  const t = useTime();
  const light = t >= ACT.partners[0] && t < ACT.partners[1];
  return (
    <AbsoluteFill style={{ background: light ? C.paper : C.ink, fontFamily: FONT }}>
      <Hook t={t} />
      <Trainers t={t} />
      <Reveal t={t} />
      <Network t={t} />
      <Students t={t} />
      <Partners t={t} />
      <Ninety t={t} />
      <Months t={t} />
      <Tiers t={t} />
      <Montage t={t} />
      <Support t={t} />
      <End t={t} />
      <BrandMark t={t} />
      <Music file="film-edit.wav" volume={0.85} />
      <Sfx hits={HITS} />
    </AbsoluteFill>
  );
}
