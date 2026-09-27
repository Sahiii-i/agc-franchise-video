import type { CSSProperties } from "react";
import { Audio, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";

import peaks from "../../public/sfx/sfx-peaks.json";

/**
 * A clip of real footage that plays from `start` seconds of the source while the
 * film is between `from` and `to`. Frame-driven: Remotion seeks the source per frame.
 */
export function Clip({
  src,
  from,
  to,
  start,
  style,
  position = "50% 50%",
  scale = 1,
}: {
  src: string;
  from: number;
  to: number;
  start: number;
  style?: CSSProperties;
  position?: string;
  scale?: number;
}) {
  const { fps } = useVideoConfig();
  const begin = Math.round(from * fps);
  return (
    <Sequence from={begin} durationInFrames={Math.max(1, Math.round(to * fps) - begin)} layout="none">
      <div style={{ overflow: "hidden", ...style }}>
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={Math.round(start * fps)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, scale: String(scale) }}
        />
      </div>
    </Sequence>
  );
}

export type Hit = { at: number; file: keyof typeof peaks; volume?: number };

/** Sound effects placed so each file's measured peak lands on its cue. */
export function Sfx({ hits }: { hits: readonly Hit[] }) {
  const { fps } = useVideoConfig();
  return (
    <>
      {hits.map((hit, index) => (
        <Sequence key={index} from={Math.max(0, Math.round((hit.at - peaks[hit.file]) * fps))} layout="none">
          <Audio src={staticFile(`sfx/${hit.file}`)} volume={hit.volume ?? 0.35} />
        </Sequence>
      ))}
    </>
  );
}

export function Music({ file, volume = 0.9 }: { file: string; volume?: number }) {
  return <Audio src={staticFile(`audio/${file}`)} volume={volume} />;
}
