import React from "react";
import { Grid } from "react-loader-spinner";

interface Props {}

const AveragePointShowcaseWithSpinnerComponent: React.FunctionComponent<Props> = () => {
  return (
    <div className="app__game__average-point-showcase">
      <Grid height={64} width={64} />
    </div>
  );
};

export default AveragePointShowcaseWithSpinnerComponent;
