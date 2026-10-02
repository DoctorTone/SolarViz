import { type CSSProperties } from "react";

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
