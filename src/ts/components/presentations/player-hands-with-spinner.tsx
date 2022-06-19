import { Component } from "solid-js";
import { Grid } from "./grid";

interface Props {
  position: "upper" | "lower";
}

export const PlayerHandsWithSpinner: Component<Props> = (props) => {
  const isUpper = () => props.position === "upper";
  const isLower = () => props.position === "lower";
  const className = () => ({
    app__game__main__users: true,
    "app__game__main__users-in-upper": isUpper(),
    "app__game__main__users-in-lower": isLower(),
  });

  return (
    <div classList={className()}>
      <Grid />
    </div>
  );
};
