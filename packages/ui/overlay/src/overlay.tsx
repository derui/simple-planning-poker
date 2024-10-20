import { PropsWithChildren } from "react";
import { hidden, root } from "./style.css.js";

export interface Props {
  show: boolean;
}

// eslint-disable-next-line func-style
export function Overlay(props: PropsWithChildren<Props>) {
  const style = props.show ? root : hidden;

  return (
    <div className={style} role="dialog" data-show={props.show}>
      {props.children}
    </div>
  );
}
