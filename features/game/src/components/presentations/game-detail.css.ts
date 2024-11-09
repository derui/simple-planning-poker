import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "auto auto 1fr",
  gap: vars.spacing[4],
  position: "relative",
  margin: vars.spacing[4],
  height: "100%",
});

export const editButton: string = style([
  buttonStyle({ variant: Variant.emerald, iconButton: true }),
  {
    position: "absolute",
    right: 0,
    top: 0,
  },
]);

export const defList: string = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing[4],
  marginTop: vars.spacing[3],
});

export const defListLabel: string = style({
  flex: "1 1 auto",
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  fontWeight: "bold",
  color: vars.color.orange[800],
});

export const defListContent: string = style({
  flex: "1 1 auto",
  borderBottom: `1px solid ${vars.color.orange[500]}`,
});

export const footer: string = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

export const deleteButton: string = style([
  buttonStyle({ variant: Variant.cerise }),
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyItems: "center",
  },
]);

export const startVotingButton: string = style([
  buttonStyle({ variant: Variant.emerald }),
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyItems: "center",
  },
]);
