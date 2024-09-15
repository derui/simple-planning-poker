import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { Loader } from "@spp/ui-loader";

type ButtonState = "disabled" | "enabled" | "loading";

interface Props {
  title: string;
  onSubmitClick: () => void;
  buttonLabel?: string;
  buttonState: ButtonState;
}

const styles = {
  root: clsx(
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

  header: clsx(
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

  main: clsx("flex-auto", "bg-white", "relative", "p-4"),

  inputContainer: clsx("flex", "flex-col", "w-full", "mx-auto", "list-none", "py-0", "px-3"),

  inputTerm: clsx("flex", "flex-auto", "items-center", "mb-4", "last:mb-0"),

  inputLabel: clsx("flex-[0_0_auto]", "w-24"),

  input: clsx(
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

  footer: clsx(
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
    clsx(
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
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    props.onSubmitClick();
  };

  const disabled = props.buttonState !== "enabled";

  return (
    <div className={styles.root} role="dialog">
      <header className={styles.header}>{props.title}</header>
      <main className={styles.main}>{props.children}</main>
      <footer className={styles.footer}>
        <button type="button" className={styles.submit(props.buttonState)} disabled={disabled} onClick={handleClick}>
          <Loader size="s" shown={props.buttonState === "loading"} />
          {props.buttonLabel ?? "Submit"}
        </button>
      </footer>
    </div>
  );
}
