import useSolar from "../state/store";

const LoadingScreen = () => {
  const rendered = useSolar((s) => s.rendered);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a2e1a", // deep green, on-brand
        color: "#fff",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        // fade + lift out once loaded, then ignore clicks
        opacity: rendered ? 0 : 1,
        pointerEvents: rendered ? "none" : "auto",
        transition: "opacity 0.6s ease",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>
        Springwell Solar Farm
      </div>
      <div style={{ fontSize: 14, color: "#a8c99a", marginBottom: 28 }}>
        Interactive landscape visualisation
      </div>

      {/* simple CSS spinner */}
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,255,255,0.25)",
          borderTopColor: "#7dc96a",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />

      <div style={{ fontSize: 12, color: "#88aa7a", marginTop: 20 }}>
        Loading terrain and viewpoints…
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoadingScreen;
