import { ColorCode } from "@/types/map-interfaces";

const colorMap = {
  red: { light: "orangered", dark: "firebrick" },
  blue: { light: "dodgerblue", dark: "royalblue" },
  green: { light: "limegreen", dark: "forestgreen" },
  yellow: { light: "gold", dark: "goldenrod" },
};

// ピンに色を付けるための関数。濃淡の2色を使う
export const customPinsColor = (color?: ColorCode) => {
  const defaultLightColor = colorMap.red.light;
  const defaultDarkColor = colorMap.red.dark;
  if (!color) {
    return {
      background: defaultLightColor,
      glyphColor: defaultDarkColor,
      borderColor: defaultDarkColor,
    };
  } else {
    return {
      background: colorMap[color].light,
      glyphColor: colorMap[color].dark,
      borderColor: colorMap[color].dark,
    };
  }
};
