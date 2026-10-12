import { Box, Link } from "@mui/material";

/**
 * Always-visible map attribution overlay (MapTiler licence condition).
 * Mount it in the DOM next to your Canvas — NOT inside <Canvas> — and leave it
 * mounted in every mode (overview + explore) so it's always visible.
 *
 *   <>
 *     <Canvas> ... </Canvas>
 *     <MapAttribution />
 *   </>
 *
 * Needs the MapTiler logo at /maptiler-logo.svg (free tier requires the logo).
 */
const MapAttribution = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        right: 8,
        bottom: 8,
        zIndex: 1200, // above the canvas, below MUI dialogs (1300)
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 0.75,
        py: 0.25,
        borderRadius: 1,
        bgcolor: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(2px)",
        fontSize: 11,
        lineHeight: 1.4,
        color: "rgba(0,0,0,0.78)",
        userSelect: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
      }}
    >
      <Link
        href="https://www.maptiler.com/"
        target="_blank"
        rel="noopener"
        sx={{ display: "inline-flex" }}
      >
        <img
          src="images/maptiler-logo.png"
          alt="MapTiler"
          height={14}
          style={{ display: "block" }}
        />
      </Link>
      <span>
        ©{" "}
        <Link
          href="https://www.maptiler.com/copyright/"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="inherit"
        >
          MapTiler
        </Link>{" "}
        ©{" "}
        <Link
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="inherit"
        >
          OpenStreetMap
        </Link>{" "}
        contributors
      </span>
    </Box>
  );
};

export default MapAttribution;
