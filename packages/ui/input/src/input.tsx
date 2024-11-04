import React from "react";
import { input } from "./style.css.js";

const _Input = function Input(props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement> | undefined) {
  const { className: _, ...rest } = props;
  return <input ref={ref} {...rest} className={input} />;
};

export const Input: React.ForwardRefExoticComponent<
  Omit<React.HTMLProps<HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>
> = React.forwardRef(_Input);
