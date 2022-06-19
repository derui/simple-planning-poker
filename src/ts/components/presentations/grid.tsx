import { Component } from "solid-js";

interface Props {
  width?: number;
  height?: number;
  classes?: string[];
}

export const Grid: Component<Props> = (props) => {
  const width = () => `${props.width || 80}px`;
  const height = () => `${props.height || 80}px`;

  const classes = () => props.classes ?? [];

  const otherClasses = () => {
    return classes().reduce((accum: { [k: string]: true }, name: string) => {
      accum[name] = true;
      return accum;
    }, {});
  };
  const className = () => Object.assign(otherClasses(), { app__grid: true });

  return (
    <div classList={className()} style={{ width: width(), height: height() }}>
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
