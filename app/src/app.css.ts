import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body, #root, #theme", {
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
  fontFamily: "Noto Sans JP",
});

globalStyle("#root", {
  overflow: "hidden",
  zIndex: 10,
});
