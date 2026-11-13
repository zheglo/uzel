import { defineConfig, presetWind3 } from 'unocss';
import presetRemToPx from '@unocss/preset-rem-to-px';

export default defineConfig({
  presets: [
    presetWind3(),
    presetRemToPx()
  ],

  theme: {
    fontFamily: {
      sans: '"Montserrat Variable", sans-serif',
      serif: '"Playfair Display Variable", serif',
      local: '"Magical Childhood Regular", serif'
    }
  }
});