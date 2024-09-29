import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import { BaseProps, generateTestId } from "../base";
import { Loader } from "./loader";

type ButtonState = "disabled" | "enabled" | "loading";

interface Props extends BaseProps {
  title: string;
  onSubmitClick: () => void;
  buttonLabel?: string;
  buttonState: ButtonState;
}

const styles = {
  root: classNames(
    "flex",
    "absolute",
    "flex-col",
    "w-96",
    "max-w-md",
    "m-auto",
    "border",
    "border-primary-400",
    "rounded",
    "shadow-md",
    "z-0",
    "top-1/2",
    "left-1/2",
    "[transform:translate(-50%,-50%)]"
  ),

  header: classNames(
    "flex-auto",
    "p-2",
    "text-lg",
    "font-bold",
    "rounded",
    "rounded-r-none",
    "rounded-b-none",
    "bg-primary-400",
    "text-secondary1-200"
  ),

  main: classNames("flex-auto", "bg-white", "relative", "p-4"),

  inputContainer: classNames("flex", "flex-col", "w-full", "mx-auto", "list-none", "py-0", "px-3"),

  inputTerm: classNames("flex", "flex-auto", "items-center", "mb-4", "last:mb-0"),

  inputLabel: classNames("flex-[0_0_auto]", "w-24"),

  input: classNames(
    "flex-auto",
    "w-full",
    "p-2",
    "outline-none",
    "rounded",
    "border",
    "border-lightgray/40",
    "bg-lightgray/20",
    "transition-colors",
    "focus:border-secondary2-500",
    "focus:bg-white"
  ),

  footer: classNames(
    "flex",
    "flex-col",
    "items-end",
    "flex-auto",
    "p-2",
    "bg-white",
    "text-lg",
    "font-bold",
    "rounded-b",
    "text-right",
    "border",
    "border-t-primary-400",
    "text-secondary1-200"
  ),

  submit: (state: ButtonState) =>
    classNames(
      "flex",
      "flex-none",
      "outline-none",
      "border",
      "px-3",
      "py-2",
      "rounded",
      "cursor-pointer",
      "items-center",
      "justify-center",
      "transition-all",
      {
        "text-gray": state !== "enabled",
        "bg-lightgray/20": state !== "enabled",
      },
      {
        "text-secondary1-500": state === "enabled",
        "active:shadow-md": state === "enabled",
        "hover:text-secondary1-200": state === "enabled",
        "hover:bg-secondary1-500": state === "enabled",
        "bg-secondary1-200": state === "enabled",
        "border-secondary1-500": state === "enabled",
      }
    ),
};

// eslint-disable-next-line func-style
export function Dialog(props: PropsWithChildren<Props>) {
  const gen = generateTestId(props.testid);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    props.onSubmitClick();
  };

  const disabled = props.buttonState !== "enabled";

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <header className={styles.header} data-testid={gen("header")}>
        {props.title}
      </header>
      <main className={styles.main}>{props.children}</main>
      <footer className={styles.footer}>
        <button type="button" className={styles.submit(props.buttonState)} disabled={disabled} onClick={handleClick}>
          <Loader size="s" shown={props.buttonState === "loading"} testid={gen("loader")} />
          {props.buttonLabel ?? "Submit"}
        </button>
      </footer>
    </div>
  );
}
