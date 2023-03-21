import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { PlayerEstimation } from "./player-estimation";
import { UserEstimationInfo } from "@/status/selectors/user-hand";

interface Props extends BaseProps {
  hands: UserEstimationInfo[];
}

const styles = {
  root: classnames("flex", "justify-around"),
};

// eslint-disable-next-line func-style
export function PlayerEstimations({ hands, testid }: Props) {
  const gen = generateTestId(testid);

  const createUserHand = (props: UserEstimationInfo, index: number) => {
    return <PlayerEstimation key={index} testid={gen(props.userName)} {...props} />;
  };

  return (
    <div className={styles.root} data-testid={gen("root")}>
      {hands.map((v, index) => createUserHand(v, index))}
    </div>
  );
}
