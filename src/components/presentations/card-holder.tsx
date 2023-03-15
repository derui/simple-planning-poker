import classNames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { SelectableCard } from "./selectable-card";

interface Props extends BaseProps {
  displays: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const styles = {
  root: classNames("flex", "flex-auto", "justify-center", "px-3", "py-2", "h-36", "items-end"),
};

const createCard = (
  display: string,
  index: number,
  selectedIndex: number | null,
  onClickCard: (index: number) => void,
  testid: string
) => {
  return (
    <SelectableCard
      testid={testid}
      key={index}
      display={display}
      selected={index === selectedIndex}
      onSelect={() => onClickCard(index)}
    />
  );
};

// eslint-disable-next-line func-style
export function CardHolder(props: Props) {
  const gen = generateTestId(props.testid);

  return (
    <div className={styles.root} data-testid={gen("root")}>
      {props.displays.map((display, index) =>
        createCard(display, index, props.selectedIndex, props.onSelect, gen("card"))
      )}
    </div>
  );
}
