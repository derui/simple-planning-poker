import { Component } from "solid-js";
import { Grid } from "./grid";

interface Props {}

export const AveragePointShowcaseWithSpinner: Component<Props> = () => {
  return (
    <div class="app__game__average-point-showcase">
      <Grid height={64} width={64} />
    </div>
  );
};
