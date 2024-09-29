import classNames from "classnames";
import { GameInfo } from "../presentations/game-info";
import { useAppSelector } from "../hooks";
import { BaseProps, generateTestId } from "../base";
import { Skeleton } from "../presentations/skeleton";
import { isFinished } from "@/utils/loadable";
import { selectCurrentGameName } from "@/status/selectors/game";

interface Props extends BaseProps {
  onBack: () => void;
}

const styles = {
  root: classNames("flex", "flex-none", "justify-between", "items-center", "p-4", "z-30"),
  right: classNames("flex", "flex-auto", "align-center", "justify-end", "space-x-4"),
} as const;

// eslint-disable-next-line func-style
export function RoundHistoryHeaderContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const gameName = useAppSelector(selectCurrentGameName);

  if (!isFinished(gameName)) {
    return (
      <div className={styles.root} data-testid={gen("root")}>
        <Skeleton testid={gen("loading")} />
      </div>
    );
  }

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <GameInfo owner={false} gameName={gameName[0]} onBack={props.onBack} testid={gen("game-info")} />
    </div>
  );
}
