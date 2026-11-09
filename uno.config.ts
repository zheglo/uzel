import { presetWind3 } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetRemToPx(),
  ],
})
