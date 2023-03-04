import classnames from "classnames";

interface Props {
  display: string;
  selected: boolean;
  onSelect: () => void;
}

const styles = {
  root: (selected: boolean) =>
    classnames(
      "flex",
      "flex-col",
      "h-16",
      "w-12",
      "rounded",
      "border",
      "border-primary-400",
      "text-center",
      "justify-center",
      "m-3",
      "transition-transform",
      "first-of-type:ml-0",
      "last-of-type:mr-0",

      "hover:-translate-y-2",
      {
        "bg-white": !selected,
        "text-primary-400": !selected,
      },
      {
        "bg-primary-400": selected,
        "text-secondary1-200": selected,
        "-translate-y-2": selected,
      }
    ),
};

// eslint-disable-next-line func-style
export function SelectableCard(props: Props) {
  return (
    <div className={styles.root(props.selected)} onClick={props.onSelect} data-selected={props.selected}>
      {props.display}
    </div>
  );
}
