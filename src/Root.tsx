import { Composition } from "remotion";

import { DURATION as FILM_DURATION } from "./film/cues";
import { Film } from "./film/Film";
import { Brag, BRAG_DURATION } from "./brag/Brag";

type Props = { fps: number; debug?: boolean; whatsapp?: string };

// fps comes from props: 60 in Studio and for stills, 240 for the final render (motion blur).
const metadata = (duration: number) => ({ props }: { props: Record<string, unknown> }) => {
  const fps = Number((props as Props).fps ?? 60);
  return { fps, durationInFrames: Math.round(duration * fps) };
};

export function Root() {
  return (
    <>
      <Composition
        id="FranchiseFilm"
        component={Film}
        width={1080}
        height={1920}
        fps={60}
        durationInFrames={Math.round(FILM_DURATION * 60)}
        defaultProps={{ fps: 60 } as Props}
        calculateMetadata={metadata(FILM_DURATION)}
      />
      {/* The same film laid out for 16:9: words in a left column, pictures on the right (src/film/layout.ts). */}
      <Composition
        id="FranchiseFilmLandscape"
        component={Film}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={Math.round(FILM_DURATION * 60)}
        defaultProps={{ fps: 60 } as Props}
        calculateMetadata={metadata(FILM_DURATION)}
      />
      {/* /brag-slim cut: 30 fps as the skill specifies, no motion-blur master. */}
      <Composition id="BragFranchise" component={Brag} width={1080} height={1920} fps={30} durationInFrames={BRAG_DURATION * 30} />
    </>
  );
}
