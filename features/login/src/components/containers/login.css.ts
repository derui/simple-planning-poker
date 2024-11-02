import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  width: "100%",
  height: "100%",
  display: "grid",
  placeContent: "center",
});

export const link: string = style({
  color: vars.color.orange[700],
  fontSize: vars.font.size.lg,
  display: "grid",
  placeContent: "center",
  ":hover": {
    textDecoration: "underline",
  },
});

export const children: string = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridTemplateRows: "repeat(2, 1fr)",
  padding: vars.spacing[4],
});

export const info: string = style({
  color: vars.color.chestnut[700],
  backgroundColor: vars.color.chestnut[200],
  border: `1px solid ${vars.color.chestnut[500]}`,
  padding: vars.spacing[4],
  borderRadius: "4px",
  gridColumn: "span 2",
  marginBottom: vars.spacing[4],
  display: "grid",
  placeContent: "center",
  fontWeight: "bold",
});

export const authenticatingLoader: {
  root: string;
  loader: string;
  text: string;
} = {
  root: style({
    display: "grid",
    gridTemplateRows: "repeat(2, 1fr)",
    placeContent: "center",
    padding: vars.spacing[4],
    fontSize: vars.font.size.sm,
  }),

  loader: style({
    display: "grid",
    placeContent: "center",
    margin: vars.spacing[4],
  }),

  text: style({
    display: "grid",
    placeContent: "center",
    padding: vars.spacing[4],
    backgroundColor: vars.color.teal[200],
    color: vars.color.teal[700],
    border: `1px solid ${vars.color.teal[500]}`,
    borderRadius: vars.spacing[4],
    fontWeight: "bold",
  }),
};
