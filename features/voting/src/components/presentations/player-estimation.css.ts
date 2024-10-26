import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  margin: vars.spacing[3],
  alignItems: "center",
  gap: vars.spacing[2],
});

const card = style({
  height: vars.spacing[20],
  width: vars.spacing[14],
  borderRadius: "4px",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${vars.color.orange[400]}`,
  color: vars.color.orange[700],
  transition: "transform 0.2s ease-in-out",
});

export const cardNotEstimated = style([
  card,
  {
    backgroundColor: vars.color.white,
  },
]);

export const cardEstimated = style([
  card,
  {
    backgroundColor: vars.color.orange[200],
    transform: "rotateY(180deg)",
  },
]);
