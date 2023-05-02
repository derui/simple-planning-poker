import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { PlayerEstimation } from "./player-estimation";
import { Skeleton } from "./skeleton";
import { UserEstimationInfo } from "@/status/selectors/user-estimation";

interface Props extends BaseProps {
  estimations: UserEstimationInfo[];
  loading?: boolean;
}

const styles = {
  root: classnames("flex", "justify-around"),
};

// eslint-disable-next-line func-style
export function PlayerEstimations({ estimations, testid, loading }: Props) {
  const gen = generateTestId(testid);

  if (loading) {
    return (
      <div className={styles.root} data-testid={gen("root")}>
        <Skeleton testid={gen("loading")} />
      </div>
    );
  }

  const createUserEstimation = (props: UserEstimationInfo, index: number) => {
    return <PlayerEstimation key={index} testid={gen(props.userName)} {...props} />;
  };

  return (
    <div className={styles.root} data-testid={gen("root")}>
      {estimations.map((v, index) => createUserEstimation(v, index))}
    </div>
  );
}
