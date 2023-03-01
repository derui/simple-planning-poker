import React from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import PlayerHand from "./player-hand";
import { UserHandInfo } from "@/status/selectors/user-hand";

interface Props extends BaseProps {
  hands: UserHandInfo[];
  opened: boolean;
}

const styles = {
  root: classnames("flex", "justify-around"),
};

export const PlayerHandsComponent: React.FunctionComponent<Props> = ({ opened, hands, testid }) => {
  const gen = generateTestId(testid);

  const createUserHand = (props: UserHandInfo, index: number) => {
    return <PlayerHand key={index} opened={opened} testid={gen("hand")} {...props} />;
  };

  return (
    <div className={styles.root} data-testid={gen("root")}>
      {hands.map((v, index) => createUserHand(v, index))}
    </div>
  );
};
