import {defineConfig} from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';

export default defineConfig({
  theme: {
    colors: {
      transparent: 'transparent',
      primary: {
        100:"#6d8e94",
        200:"#D0DBDD",
        300:"#9BB2B7",
        400:"#4A757D",
        500:"#2E5F68",
      },
      secondary1: {
        100:"#F1DDAF",
        200:"#FFFBF0",
        300:"#FFF3D8",
        400:"#CCB377",
        500:"#A98C48",
      },
      secondary2: {
        100:"#F1B2AF",
        200:"#FFF1F0",
        300:"#FFDAD8",
        400:"#CC7B77",
        500:"#A94D48",
      },
      darkgray: "#404040",
      gray: "#808080",
      lightgray: "#D0D0D0",
      'darkgray-alpha': "rgb(0 0 0 / 60%)",
      'gray-alpha': "rgb(0 0 0 / 40%)",
      'lightgray-alpha': "rgb(0 0 0 / 10%)",
      white: '#FFF'
    },
    overflow: {
      'overlay': 'overlay'
    },
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {opacity: 0, visibility: 'hidden'},
          '50%': {opacity: 0.5, visibility: 'visible'},
          '100%': {opacity: 1, visibility: 'visible'},
        },
        'fade-out': {
          '0%': {opacity: 1, visibility: 'visible'},
          '50%': {opacity: 0.5, visibility: 'visible'},
          '100%': {opacity: 0, visibility: 'hidden'},
        }
      },
      animation: {
        'fade-in': 'fade-in 0.1s ease-in-out 1',
        'fade-out': 'fade-out 0.1s ease-in-out 1',
      },
      transitionProperty: {
        'outline': 'outline',
        'width': 'width',
        'height': 'height',
        'stroke': 'stroke, stroke-width',
        'fill': 'fill',
      },
      gridTemplateColumns: {
        'top-toolbar': 'min-content 1fr min-content min-content',
        'project-toolbar': '20rem 1px 10rem 3rem',
      },
    },
  },

  presets: [presetAutoprefix(), presetTailwind()]
});
