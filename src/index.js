import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import fs from "fs";

function createTheme({ sourceColor, customColors }) {
  const theme = themeFromSourceColor(sourceColor, customColors);
  const schemeLight = theme.schemes.light.toJSON();
  const schemeDark = theme.schemes.dark.toJSON();
  const palettes = theme.palettes;
  theme.customColors.forEach((c) => {
    schemeLight[c.color.name] = c.light.color;
    schemeLight[`on-${c.color.name}`] = c.light.onColor;
    schemeLight[`${c.color.name}-container`] = c.light.colorContainer;
    schemeLight[`on-${c.color.name}-container`] = c.light.onColorContainer;
    schemeDark[c.color.name] = c.dark.color;
    schemeDark[`on-${c.color.name}`] = c.dark.onColor;
    schemeDark[`${c.color.name}-container`] = c.dark.colorContainer;
    schemeDark[`on-${c.color.name}-container`] = c.dark.onColorContainer;
    palettes[c.color.name] = CorePalette.of(c.value).a1;
  });
  return {
    schemes: {
      light: schemeLight,
      dark: schemeDark,
    },
    palettes,
  };
}
const m3Theme = createTheme({
  sourceColor: argbFromHex("#00898F"),
  customColors: [],
});

const kebab = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};
const schemeColors = (scheme, mode) => {
  const result = {};
  for (const key in scheme) {
    result[`${kebab(key)}-${mode}`] = hexFromArgb(scheme[key]);
  }
  return result;
};
const tones = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
const paletteColors = (palette) => {
  const result = {};
  for (const key in palette) {
    result[key] = {};
    tones.forEach((tone) => {
      result[key][tone] = hexFromArgb(palette[key].tone(tone));
    });
  }
  return result;
};
export const colors = (withOutSchemas = false) => {
  if (withOutSchemas) {
    return { ...paletteColors(m3Theme.palettes) };
  } else {
    return {
      ...schemeColors(m3Theme.schemes.light, "light"),
      ...schemeColors(m3Theme.schemes.dark, "dark"),
      ...paletteColors(m3Theme.palettes),
    };
  }
};

fs.writeFile(
  "./src/m3-colors-tailwind.js",
  `const m3ColorsTailwind = ${JSON.stringify(colors(true))}
export {m3ColorsTailwind}
  `,
  function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  }
);
