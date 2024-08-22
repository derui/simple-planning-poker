import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  display: string;
  selected: boolean;
  onSelect: () => void;
}

const styles = {
  root: (selected: boolean) =>
    classnames(
      "flex",
      "flex-col",
      "h-20",
      "w-14",
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
  const gen = generateTestId(props.testid);

  return (
    <div
      className={styles.root(props.selected)}
      onClick={props.onSelect}
      data-testid={gen("root")}
      data-selected={props.selected}
    >
      {props.display}
    </div>
  );
}
