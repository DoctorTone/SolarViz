import { type CSSProperties } from "react";

export const panelWrap: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 10,
  fontFamily: "system-ui, sans-serif",
};
export const panel: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 10,
  padding: 16,
  width: 300,
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
};
export const label: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  margin: "14px 0 6px",
};

export const slider: CSSProperties = { width: "100%" };

export const scaleRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 11,
  color: "#777",
  marginTop: 2,
};

export const dirRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};
export const backBtn: CSSProperties = {
  border: "none",
  background: "none",
  color: "#2a6",
  cursor: "pointer",
  fontSize: 13,
  padding: 0,
  marginBottom: 8,
};
export const backBtnMobile: CSSProperties = {
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
export const identity = { minWidth: 0 }; // truncation context for the name
export const tagLine: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 12,
  color: "#8a6d1f",
  fontWeight: 600,
};
export const sub: CSSProperties = {
  margin: "8px 0 12px 0",
  fontSize: 13,
  color: "#0e0d0d",
};
export const h3: CSSProperties = { margin: "0 0 2px", fontSize: 18 };
export const dirBtn: CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};
export const dirBtnActive: CSSProperties = {
  ...dirBtn,
  background: "#2a6",
  color: "#fff",
  borderColor: "#2a6",
};
export const hint: CSSProperties = {
  fontSize: 12,
  color: "#666",
  fontStyle: "italic",
  textAlign: "center",
  padding: "8px 4px",
  lineHeight: 1.4,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};
export const exploreBar: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  display: "flex",
  alignItems: "center",
  gap: 16,
  background: "rgba(255,255,255,0.85)",
  padding: "8px 14px",
  borderRadius: 8,
  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  fontFamily: "system-ui, sans-serif",
  zIndex: 10,
};
export const exitBtn: CSSProperties = {
  border: "none",
  background: "none",
  color: "#2a7d2a",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};
export const topBar: CSSProperties = {
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
export const leftGroup: CSSProperties = {
  display: "flex",
  flexDirection: "column", // was implicitly row — now stacks vertically
  alignItems: "flex-start", // left-align the back button and text
  gap: 6,
  minWidth: 0,
  flex: 1,
};
export const bar: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(255,255,255,0.95)",
  padding: "12px 12px calc(12px + env(safe-area-inset-bottom))",
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  boxShadow: "0 -2px 14px rgba(0,0,0,0.14)",
  fontFamily: "system-ui, sans-serif",
  zIndex: 10,
};
export const vpBtn: CSSProperties = {
  flex: 1,
  minHeight: 60,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  padding: "8px 6px",
  border: "1px solid #2a7d2a",
  borderRadius: 10,
  background: "#fff",
  color: "#2a7d2a",
  cursor: "pointer",
};
