import classnames from "classnames";

interface Props {
  storyPoint: string;
  selected: boolean;
  onSelect: () => void;
}

const styles = {
  root: (selected: boolean) =>
    classnames(
      "flex",
      "flex-col",
      "h-12",
      "w-6",
      "rounded",
      "border",
      "border-primary-400",
      "bg-white",
      "text-primary-400",
      "text-center",
      "justify-center",
      "m-3",
      "transition-transform",
      "first-of-type:ml-0",
      "last-of-type:mr-0",

      "hover:[transform:transformY(calc(-1 * 0.5rem))]",
      {
        "bg-primary-400": selected,
        "text-secondary1-200": selected,
        "[transform:transformY(calc(-1 * 0.5rem))]": selected,
      }
    ),
};

// eslint-disable-next-line func-style
export function SelectableCard(props: Props) {
  return (
    <div className={styles.root(props.selected)} onClick={props.onSelect} data-selected={props.selected}>
      {props.storyPoint}
    </div>
  );
}
