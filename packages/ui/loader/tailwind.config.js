import sharedConfig from "@spp/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}", "./src/index.{ts,tsx}", "node_modules/@spp/**/src/**/*.{ts,tsx}"],
  presets: [sharedConfig],
};
