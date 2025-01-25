import { animation, themeClass, transition, vars } from "./style.css.js";
import { alpha } from "./support.js";

const support: {
  alpha: (color: string, opacity: number) => string;
  animation: {
    spin: string;
    pulse: string;
  };
  transition: {
    all: string;
    allAfter: string;
    allBefore: string;
    border: string;
  };
} = {
  alpha,
  animation,
  transition,
};

export { support, themeClass, vars };
