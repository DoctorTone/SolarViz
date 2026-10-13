import { topBar, leftGroup, backBtnMobile, identity } from "../css/UIStyles";
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
          <button
            onClick={exit}
            aria-label="Back to overview"
            style={backBtnMobile}
          >
            <span className="overViewText">←</span>
            <span className="overViewText">Overview</span>
          </button>
        )}

        <div style={identity}>
          {mode === "overview" ? (
            <div className="titleText">Springwell Solar Farm</div>
          ) : (
            <>
              <div className="vpNumber">
                VP{vp?.no} - {vp?.name}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileTopBar;
