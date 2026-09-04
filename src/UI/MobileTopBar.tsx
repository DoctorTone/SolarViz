import useSolar from "../state/store";
/**
 * Mobile top bar — a slim, gradient-faded strip across the top.
 *
 *   Overview mode:   [ Springwell Solar Farm ] ............... [ ⓘ ]
 *   Viewpoint mode:  [ ← Overview ]  [ VP7 / name ] ......... [ ⓘ ]
 *
 * The gradient container ignores pointer events so taps fall through to the
 * 3D scene / markers behind it; the buttons re-enable pointer events so they
 * stay tappable.
 */
function MobileTopBar() {
  const mode = useSolar((s) => s.viewMode);
  const vpId = useSolar((s) => s.activeViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);
  const exit = useSolar((s) => s.exitToOverview);

  const vp =
    mode === "viewpoint" ? viewpoints.find((v) => v.no === vpId) : null;

  return (
    <div style={topBar}>
      {/* LEFT: back button (viewpoint mode) + identity */}
      <div style={leftGroup}>
        {mode === "viewpoint" && (
          <button onClick={exit} aria-label="Back to overview" style={backBtn}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>←</span>
            <span style={{ fontSize: 20 }}>Overview</span>
          </button>
        )}

        <div style={identity}>
          {mode === "overview" ? (
            <div className="titleText">Springwell Solar Farm</div>
          ) : (
            <>
              <div style={vpNumber}>
                VP{vp?.no} - {vp?.name}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- styles ---- */

const topBar = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 15,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  padding: "calc(10px + env(safe-area-inset-top)) 14px 16px",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  pointerEvents: "none", // gradient lets taps through …
};

const leftGroup = {
  display: "flex",
  flexDirection: "column", // was implicitly row — now stacks vertically
  alignItems: "flex-start", // left-align the back button and text
  gap: 6,
  minWidth: 0,
  flex: 1,
};

const backBtn = {
  pointerEvents: "auto", // … buttons stay tappable
  display: "flex",
  alignItems: "center",
  gap: 6,
  minHeight: 40,
  padding: "0 4px",
  border: "none",
  background: "none",
  color: "#2a7d2a",
  fontWeight: 600,
  cursor: "pointer",
  flexShrink: 0,
};

const identity = { minWidth: 0 }; // truncation context for the name

const vpNumber = {
  fontSize: 14,
  fontWeight: 600,
  color: "#1a1a1a",
  lineHeight: 1.15,
};

const vpName = {
  fontSize: 11,
  color: "#555",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const infoIcon = {
  pointerEvents: "auto",
  flexShrink: 0,
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  fontSize: 20,
  color: "#2a7d2a",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default MobileTopBar;
