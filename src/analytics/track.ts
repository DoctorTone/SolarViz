const fired = new Set<string>();

export function track(name: string) {
  if (!import.meta.env.PROD) return; // ← never fires in dev
  if (typeof window === "undefined") return;
  const gc = (window as any).goatcounter;
  if (!gc || typeof gc.count !== "function") return; // not loaded / blocked
  gc.count({ path: name, title: name, event: true });
}

// fire-once-per-load, for things that would otherwise spam (slider, loader)
export function trackOnce(name: string) {
  if (!import.meta.env.PROD) return; // ← never fires in dev
  if (fired.has(name)) return;
  fired.add(name);
  track(name);
}
