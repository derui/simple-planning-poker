import React from "react";
import classnames from "classnames";
import { Grid } from "react-loader-spinner";

interface Props {}

const PlayerHandsWithSpinnerComponent: React.FunctionComponent<Props> = () => {
  const className = classnames({
    app__game__main__users: true,
    "app__game__main__users--spinner": true,
  });

  return (
    <div className={className}>
      <Grid height={32} width={32} />
    </div>
  );
};

export default PlayerHandsWithSpinnerComponent;
