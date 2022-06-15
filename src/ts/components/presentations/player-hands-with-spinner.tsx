import { Component } from "solid-js";
import Grid from "./grid";

interface Props {}

const PlayerHandsWithSpinner: Component<Props> = () => {
  return (
    <div class="app__game__main__users">
      <Grid height={32} width={32} />
    </div>
  );
};

export default PlayerHandsWithSpinner;
