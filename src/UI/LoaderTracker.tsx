import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { trackOnce } from "../analytics/track";
import useSolar from "../state/store";

// Intro sweep: once loading completes, hold on the overview for a beat, then
// glide into the most-visited viewpoint.
const INTRO_VIEWPOINT = 7;
const LOADING_FADE_MS = 600; // matches LoadingScreen opacity transition
const OVERVIEW_DWELL_MS = 800; // how long the overview reads before the sweep

const LoaderTracker = () => {
  const { active, progress } = useProgress();
  const loaderComplete = !active && progress >= 100;
  const rendered = useSolar((s) => s.rendered);
  const dataLoaded = useSolar((s) => s.loaded);
  const introSweepPlayed = useSolar((s) => s.introSweepPlayed);
  const playIntroSweep = useSolar((s) => s.playIntroSweep);

  useEffect(() => {
    if (loaderComplete) trackOnce("loader-complete");
  }, [loaderComplete]);

  useEffect(() => {
    if (!loaderComplete || !rendered || !dataLoaded || introSweepPlayed) return;
    const t = window.setTimeout(
      () => playIntroSweep(INTRO_VIEWPOINT),
      LOADING_FADE_MS + OVERVIEW_DWELL_MS,
    );
    return () => window.clearTimeout(t);
  }, [loaderComplete, rendered, dataLoaded, introSweepPlayed, playIntroSweep]);

  return null;
};

export default LoaderTracker;
