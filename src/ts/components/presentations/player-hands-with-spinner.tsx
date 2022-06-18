import { Component } from "solid-js";
import { Grid } from "./grid";

export const PlayerHandsWithSpinner: Component = () => {
  return (
    <div class="app__game__main__users">
      <Grid height={32} width={32} />
    </div>
  );
};
