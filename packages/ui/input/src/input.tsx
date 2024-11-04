import { input } from "./style.css.js";

export const Input = function Input(props: React.HTMLProps<HTMLInputElement>): JSX.Element {
  const { className: _, ...rest } = props;
  return <input {...rest} className={input} />;
};
