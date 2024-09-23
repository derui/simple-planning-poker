import clsx from "clsx";

interface Props {
  name: string;
  estimated?: boolean;
}

const styles = {
  root: clsx("grid", "grid-rows-[auto_1fr]", "grid-cols-1", "m-3", "text-center", "max-w-12"),
  card: (estimated: boolean) =>
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
      "transition-transform",
      {
        "bg-white": !estimated,
      },
      {
        "bg-orange-200": estimated,
        "[transform:rotateY(180deg)]": estimated,
      }
    ),

  eye: clsx("grid", "place-content-center"),
};

// eslint-disable-next-line func-style
export function PlayerEstimation(props: Props) {
  const { estimated } = props;

  return (
    <div className={styles.root}>
      <span>{props.name}</span>
      <span className={styles.card(estimated ?? false)} data-estimated={estimated ?? false}></span>
    </div>
  );
}
