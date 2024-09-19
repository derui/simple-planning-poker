import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { Loader } from "@spp/ui-loader";
import { buttonStyle } from "@spp/ui-button-style";
import { Variant } from "@spp/shared-color-variant";

type ButtonState = "disabled" | "loading";

interface Props {
  title: string;
  onCancel?: () => void;
  onSubmit: () => void;
  buttonLabel?: string;
  buttonState?: ButtonState;
}

const styles = {
  root: clsx(
    "grid",
    "grid-rows-3",
    "grid-cols-1",
    "absolute",
    "w-96",
    "max-w-md",
    "m-auto",
    "border",
    "border-emerald-400",
    "rounded",
    "shadow-md",
    "z-0",
    "top-1/2",
    "left-1/2",
    "overflow-hidden",
    "[transform:translate(-50%,-50%)]"
  ),

  header: clsx(
    "row-start-1",
    "row-end-2",
    "flex",
    "flex-auto",
    "p-4",
    "text-lg",
    "font-bold",
    "bg-emerald-100",
    "text-emerald-800"
  ),

  main: clsx("row-start-2", "row-end-3", "bg-white", "relative", "w-full", "h-full"),

  footer: clsx(
    "row-start-3",
    "row-end-4",
    "grid",
    "grid-rows-1",
    "grid-cols-3",
    "p-2",
    "bg-white",
    "text-lg",
    "font-bold",
    "text-right",
    "border-t",
    "border-t-emerald-400",
    "text-emerald-800"
  ),

  action: (disabled: boolean) =>
    clsx(
      buttonStyle({ variant: "emerald", disabled }),
      "col-start-3",
      "col-end-4",
      "flex",
      "items-center",
      "flex-row",
      "gap-2",
      "justify-center"
    ),

  cancel: clsx(buttonStyle({ variant: "gray" }), "col-start-1", "col-end-2"),
};

// eslint-disable-next-line func-style
export function Dialog(props: PropsWithChildren<Props>) {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    props.onSubmit();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    props?.onCancel?.();
  };

  const disabled = !!props.buttonState;

  return (
    <div className={styles.root} role="dialog">
      <header className={styles.header}>{props.title}</header>
      <main className={styles.main}>{props.children}</main>
      <footer className={styles.footer}>
        <button type="button" className={styles.cancel} onClick={handleCancelClick}>
          Cancel
        </button>
        <button type="button" className={styles.action(disabled)} disabled={disabled} onClick={handleActionClick}>
          <Loader size="s" shown={props.buttonState === "loading"} variant={Variant.emerald} />
          {props.buttonLabel ?? "Submit"}
        </button>
      </footer>
    </div>
  );
}
