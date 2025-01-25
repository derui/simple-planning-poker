import { createTheme, keyframes, style } from "@vanilla-extract/css";

const theme = createTheme({
  spacing: {
    0: "0px",
    "1": "0.25em",
    "2": "0.5em",
    "3": "0.75em",
    "4": "1em",
    "5": "1.25em",
    "6": "1.5em",
    "7": "1.75em",
    "8": "2.0em",
    "9": "2.25em",
    "10": "2.5em",
    "11": "2.75em",
    "12": "3.0em",
    "14": "3.5em",
    "16": "4em",
    "20": "5em",
    "24": "6em",
    "28": "7em",
    "32": "8em",
    "36": "9em",
    "40": "10em",
    "44": "11em",
    "48": "12em",
    "52": "13em",
    "56": "14em",
    "60": "15em",
    "64": "16em",
    "68": "17em",
    "72": "18em",
    "76": "19em",
    "80": "20em",
    "84": "21em",
    "88": "22em",
    "92": "23em",
    "96": "24em",
  },
  zIndex: {
    "0": "0",
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
  },
  color: {
    gray: {
      50: "#FAFCFC",
      100: "#E4E8EE",
      200: "#C1C9D0",
      300: "#A2ABB7",
      400: "#8892A2",
      500: "#6B7385",
      600: "#505669",
      700: "#3C4055",
      800: "#2B2E44",
      900: "#2B2E44",
    },
    blue: {
      50: "#F5FCFF",
      100: "#D9EDFF",
      200: "#ACCFFC",
      300: "#85ACF4",
      400: "#758CEC",
      500: "#5C66D2",
      600: "#414AA6",
      700: "#313B84",
      800: "#262C62",
      900: "#152041",
    },
    teal: {
      50: "#EEFDFE",
      100: "#CFF3FB",
      200: "#8ED8E9",
      300: "#62BDE4",
      400: "#4D9DCE",
      500: "#277FB5",
      600: "#1C5B92",
      700: "#154876",
      800: "#0F3451",
      900: "#082530",
    },
    emerald: {
      50: "#F2FEEE",
      100: "#CFF7C9",
      200: "#91E396",
      300: "#52D080",
      400: "#3EB574",
      500: "#288D60",
      600: "#216B44",
      700: "#18533A",
      800: "#113B34",
      900: "#0A2627",
    },
    orange: {
      50: "#FBF9EA",
      100: "#F6E4BA",
      200: "#E7C07B",
      300: "#DC9742",
      400: "#CB7519",
      500: "#AD5102",
      600: "#893301",
      700: "#6C2706",
      800: "#501A0F",
      900: "#361206",
    },
    chestnut: {
      50: "#FEFAEE",
      100: "#FCE2C0",
      200: "#EFB586",
      300: "#E78B5F",
      400: "#D7664B",
      500: "#B34434",
      600: "#912728",
      700: "#731620",
      800: "#550F1C",
      900: "#3B0B14",
    },
    cerise: {
      50: "#FEF7F4",
      100: "#FBE0DD",
      200: "#F2AFB3",
      300: "#EC798B",
      400: "#DC5472",
      500: "#BC3263",
      600: "#98184D",
      700: "#73123F",
      800: "#560E39",
      900: "#3B0427",
    },
    purple: {
      50: "#FEF7FF",
      100: "#F8DDF4",
      200: "#E8ADE1",
      300: "#D882D9",
      400: "#BF62CF",
      500: "#9B47B2",
      600: "#743095",
      700: "#57237E",
      800: "#3D1867",
      900: "#2A0D53",
    },
    indigo: {
      50: "#F8F9FE",
      100: "#E7E5FC",
      200: "#C6C0E9",
      300: "#AE9DDE",
      400: "#9B7AD8",
      500: "#7F58BE",
      600: "#5F4199",
      700: "#4A2D7F",
      800: "#362164",
      900: "#20144C",
    },

    darkgray: "#404040",
    lightgray: "#D0D0D0",
    white: "#FFF",
  },

  shadow: {
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  font: {
    size: {
      lg: "1.125rem",
      sm: "0.875rem",
      "2xl": "1.5rem",
    },
    lineHeight: {
      lg: "1.75rem",
      "2xl": "2rem",
    },
  },
});

export const themeClass: string = theme[0];
export const vars: {
  spacing: {
    0: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "1": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "2": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "3": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "4": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "5": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "6": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "7": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "8": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "9": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "10": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "11": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "12": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "14": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "16": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "20": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "24": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "28": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "32": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "36": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "40": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "44": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "48": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "52": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "56": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "60": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "64": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "68": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "72": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "76": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "80": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "84": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "88": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "92": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "96": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
  };
  zIndex: {
    "0": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "10": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "20": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "30": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    "40": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
  };
  color: {
    gray: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    blue: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    teal: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    emerald: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    orange: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    chestnut: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    cerise: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    purple: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    indigo: {
      50: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      100: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      200: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      300: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      400: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      500: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      600: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      700: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      800: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      900: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    darkgray: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    lightgray: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    white: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
  };
  shadow: {
    md: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    xl: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
  };
  font: {
    size: {
      lg: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      sm: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      "2xl": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    lineHeight: {
      lg: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
      "2xl": `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
  };
} = theme[1];

// animation definitions
const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const pulseKeyframe = keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.5 },
  "100%": { opacity: 1 },
});

export const animation: {
  spin: string;
  pulse: string;
} = {
  spin: style({
    animationName: rotate,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  }),
  pulse: style({
    animationName: pulseKeyframe,
    animationDuration: "2s",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
    animationIterationCount: "infinite",
  }),
};

export const transition: {
  all: string;
  allAfter: string;
  allBefore: string;
  border: string;
} = {
  all: style({
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "150ms",
  }),

  border: style({
    transitionProperty: "border",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "150ms",
  }),

  allAfter: style({
    "::after": {
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms",
    },
  }),
  allBefore: style({
    "::before": {
      transitionProperty: "all",
      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      transitionDuration: "150ms",
    },
  }),
};
