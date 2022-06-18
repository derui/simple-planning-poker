import { Component } from "solid-js";

interface Props {
  width?: number;
  height?: number;
}

export const Grid: Component<Props> = (props) => {
  const width = () => `${props.width || 32}px`;
  const height = () => `${props.height || 32}px`;

  return (
    <div class="app__grid" style={{ width: width(), height: height() }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
