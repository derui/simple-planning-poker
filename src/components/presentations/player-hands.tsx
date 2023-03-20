import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { PlayerHand } from "./player-hand";
import { UserHandInfo } from "@/status/selectors/user-hand";

interface Props extends BaseProps {
  hands: UserHandInfo[];
}

const styles = {
  root: classnames("flex", "justify-around"),
};

// eslint-disable-next-line func-style
export function PlayerHands({ hands, testid }: Props) {
  const gen = generateTestId(testid);

  const createUserHand = (props: UserHandInfo, index: number) => {
    return <PlayerHand key={index} testid={gen(props.userName)} {...props} />;
  };

  return (
    <div className={styles.root} data-testid={gen("root")}>
      {hands.map((v, index) => createUserHand(v, index))}
    </div>
  );
}
