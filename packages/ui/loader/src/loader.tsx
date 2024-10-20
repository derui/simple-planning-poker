import { VariantName } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { hidden, loader, spinLoader } from "./style.css.js";

type Size = "s" | "m" | "l";

interface Props {
  shown: boolean;
  size: Size;
  variant?: VariantName;
}

// eslint-disable-next-line func-style
export function Loader({ size, shown, variant }: Props) {
  const root = shown ? loader[size] : hidden;
  const spinner = spinLoader[size];

  return (
    <span className={root} data-shown={shown} role="alert">
      <span className={spinner}>
        <Icon.Loader2 size={size} variant={variant} />
      </span>
    </span>
  );
}
