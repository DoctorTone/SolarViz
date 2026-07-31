import { Vector3 } from "three";

export const RESOLUTIONS = {
  SMALL: 600,
  MEDIUM: 900,
  LARGE: 1200,
  X_LARGE: 1536,
};

export const INTERACTIONS = {
  PAN: true,
  ROTATE: true,
};

export const TARGET_POSITION = {
  X: 0,
  Y: 0,
  Z: 0,
};

export const CONFIGURATIONS = {
  small: new Vector3(0, 0.5, 3),
  landscape: new Vector3(0, 0.5, 3),
  large: new Vector3(0, 0.5, 3),
  extraLarge: new Vector3(0, 0.5, 3),
};

export type ScreenSize = {
  width: number;
  height: number;
};
