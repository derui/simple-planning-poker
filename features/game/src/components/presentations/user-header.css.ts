import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: vars.spacing[12],
  backgroundColor: vars.color.orange[100],
  gap: vars.spacing[3],
  padding: `0 ${vars.spacing[4]}`,
});

export const userName: {
  container: string;
  name: string;
  icon: string;
} = (() => {
  const container = style([
    support.transition.all,
    {
      display: "flex",
      flex: "1 1 auto",
      overflow: "hidden",
      width: "100%",
      flexDirection: "row",
      color: vars.color.orange[800],
      borderBottom: "1px solid transparent",
      padding: vars.spacing[2],

      ":hover": {
        borderBottom: `1px solid ${vars.color.teal[500]}`,
        color: vars.color.teal[800],
      },
    },
  ]);
  const name = style({
    flex: "1 1 auto",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: vars.font.size.lg,
    lineHeight: vars.font.lineHeight.lg,
  });

  const icon = style([
    support.transition.all,
    {
      cursor: "pointer",
      visibility: "hidden",
      opacity: 0,
      selectors: {
        [`${container}:hover &`]: {
          visibility: "visible",
          opacity: 1,
        },
      },
    },
  ]);

  return { container, name, icon };
})();

export const voterMode: string = style([
  buttonStyle({ variant: Variant.orange, iconButton: true }),
  support.transition.all,
  {
    flex: "0 1 auto",
    padding: vars.spacing[1],
    marginRight: vars.spacing[1],
    color: vars.color.orange[800],
    cursor: "pointer",
  },
]);
