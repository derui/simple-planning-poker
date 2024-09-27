import { PropsWithChildren, useEffect, useState } from "react";
import clsx from "clsx";

interface Props {
  name: string;
}

const styles = {
  root: clsx("flex", "flex-col", "m-3", "items-center"),
  card: (opened: boolean) =>
    clsx(
      "grid",
      "place-content-center",
      "h-20",
      "w-14",
      "rounded",
      "text-center",
      "items-center",
      "justify-center",
      "border",
      "border-orange-400",
      "text-orange-700",

      {
        "bg-orange-200": !opened,
        "[transform:rotateY(180deg)]": !opened,
      },
      {
        "bg-white": opened,
        "[transform:rotateY(0deg)]": opened,
        "transition-transform": opened,
      }
    ),
};

// eslint-disable-next-line func-style
export function RevealedEstimation(props: PropsWithChildren<Props>) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpened(true), 200);
  }, []);

  return (
    <div className={styles.root}>
      <span>{props.name}</span>
      <span className={styles.card(opened)} data-opened={opened}>
        {opened ? props.children : null}
      </span>
    </div>
  );
}
