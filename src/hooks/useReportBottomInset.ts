import { useRef, useEffect } from "react";
import useSolar from "../state/store";

export function useReportBottomInset<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const set = useSolar((s) => s.setUIBottomInset);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => set(el.offsetHeight));
    ro.observe(el); // fires on mount + every resize (wrap, expand…)
    return () => {
      ro.disconnect();
      set(0);
    }; // reset when it unmounts
  }, [set]);
  return ref;
}
