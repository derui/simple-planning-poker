import { PropsWithChildren } from "react";
import { header, main, root } from "./style.css.js";

interface Props {
  title: string;
}

// eslint-disable-next-line func-style
export function Dialog(props: PropsWithChildren<Props>) {
  return (
    <div className={root} role="dialog">
      <div className={header}>{props.title}</div>
      <div className={main} role="article">
        {props.children}
      </div>
    </div>
  );
}
