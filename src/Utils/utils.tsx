import { RESOLUTIONS, CONFIGURATIONS } from "../state/Config";

export const getScreenConfiguration = (width: number, height: number) => {
  // Small screens
  if (width <= RESOLUTIONS.SMALL) {
    return CONFIGURATIONS["small"];
  }

  // Phone in landscape
  if (width <= RESOLUTIONS.MEDIUM && width > height) {
    return CONFIGURATIONS["landscape"];
  }

  if (width <= RESOLUTIONS.LARGE && width > height) {
    return CONFIGURATIONS["large"];
  }

  // if (width <= RESOLUTIONS.LARGE) {
  //   return CONFIGURATIONS["large"];
  // }

  // if (width <= RESOLUTIONS.X_LARGE) {
  //   return CONFIGURATIONS[CONFIG_TYPE.TABLET];
  // }

  if (width >= RESOLUTIONS.X_LARGE) {
    return CONFIGURATIONS["extraLarge"];
  }

  return CONFIGURATIONS["small"];
};
