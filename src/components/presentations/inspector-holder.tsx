import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";

type Props = BaseProps;

const styles = {
  root: classNames(
    "flex",
    "flex-auto",
    "justify-center",
    "px-3",
    "py-2",
    "h-36",
    "bg-lightgray/25",
    "rounded",
    "items-center"
  ),
  message: classNames("text-500", "text-gray"),
};

// eslint-disable-next-line func-style
export function InspectorHolder(props: Props) {
  const gen = generateTestId(props.testid);

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <p className={styles.message}>You are inspector. Please seeing round.</p>
    </div>
  );
}
