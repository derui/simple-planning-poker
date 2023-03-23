import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

type Size = "s" | "m" | "l";

interface Props extends BaseProps {
  shown: boolean;
  size: Size;
}

const sizeStyle = (size: Size) =>
  classNames(
    {
      "w-5": size === "s",
      "h-5": size === "s",
    },
    {
      "w-6": size === "m",
      "h-6": size === "m",
    },
    {
      "w-8": size === "l",
      "h-8": size === "l",
    }
  );

const styles = {
  root: (size: Size, shown: boolean) =>
    classNames(
      "relative",
      {
        "inline-block": shown,
        hidden: !shown,
      },
      sizeStyle(size)
    ),
  spinLoader: (size: Size) =>
    classNames(
      "absolute",
      "top-0",
      "left-0",
      "inline-block",
      "z-10",
      '[mask-image:url("/static/svg/tabler-icons/loader-2.svg")]',
      "[mask-size:cover]",
      "bg-gray",
      "animate-spin",
      sizeStyle(size)
    ),
};

// eslint-disable-next-line func-style
export function Loader({ size, shown, testid }: Props) {
  const gen = generateTestId(testid);

  return (
    <span className={styles.root(size, shown)} data-testid={gen("root")} data-shown={shown}>
      <span className={styles.spinLoader(size)}></span>
    </span>
  );
}
