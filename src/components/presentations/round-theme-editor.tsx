import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent, FormEvent, KeyboardEvent } from "react";
import { BaseProps, generateTestId } from "../base";
import { iconize } from "../iconize";
import { baseInput } from "../common-styles";

export interface Props extends BaseProps {
  editable?: boolean;
  initialTheme?: string | null;
  onThemeChange?: (theme: string) => void;
}

const Styles = {
  root: classNames("flex", "items-center", "max-w-fit"),
  theme: (hasTheme: boolean, isEditorShown: boolean, editable: boolean) =>
    classNames(
      "flex",
      "items-center",
      "px-3",
      "py-2",
      "border",
      "border-transparent",
      "transition-colors",
      {
        "text-gray": !hasTheme,
        "text-darkgray": hasTheme,
        underline: hasTheme,
        "decoration-solid": hasTheme,
      },
      {
        visible: !isEditorShown,
        hidden: isEditorShown,
      },
      iconize("pencil", { position: "after", size: "s" }),
      "after:ml-3",
      editable
        ? ["rounded", "hover:border-secondary2-400", "cursor-pointer", "after:bg-primary-400"]
        : ["after:bg-lightgray"]
    ),
  editor: {
    container: (shown: boolean) =>
      classNames("flex", "items-center", "relative", {
        visible: shown,
        hidden: !shown,
      }),
    input: classNames(baseInput, "pr-9"),
    submit: (canSubmit: boolean) =>
      classNames(
        "z-1",
        "absolute",
        "right-2",
        "inline-flex",
        "flex-none",
        "w-7",
        "h-7",
        "ml-2",
        "items-center",
        "justify-center",
        "transition-colors",
        "border",
        "border-transparent",
        "rounded",
        "hover:border-primary-400",
        iconize("check", { size: "s" }),
        {
          "before:bg-primary-400": canSubmit,
          "before:bg-lightgray": !canSubmit,
        }
      ),
  },
} as const;

interface EditorProps extends BaseProps {
  shown: boolean;
  initialTheme?: string | null;
  onSubmit: (theme: string) => void;
  onCancel: () => void;
}

const Editor = function Editor(props: EditorProps) {
  const gen = generateTestId(props.testid);
  const [theme, setTheme] = useState(props.initialTheme ?? "");
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTheme(props.initialTheme ?? "");
  }, [props.initialTheme]);

  useEffect(() => {
    if (props.shown) {
      ref.current?.focus();
    }
  }, [ref.current, props.shown]);

  const handleChange = (value: string) => {
    setTheme(value);
  };

  const handleCancelAfterEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onCancel();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    props.onSubmit(theme);
  };

  return (
    <form
      className={Styles.editor.container(props.shown)}
      data-testid={gen("root")}
      data-shown={props.shown}
      onSubmit={handleSubmit}
    >
      <input
        ref={ref}
        className={Styles.editor.input}
        onKeyUp={handleCancelAfterEscape}
        placeholder="Theme of round"
        type="text"
        value={theme}
        onChange={(e) => handleChange(e.target.value)}
        data-testid={gen("input")}
      ></input>
      <button type="submit" className={Styles.editor.submit(true)} data-testid={gen("submit")}></button>
    </form>
  );
};

// eslint-disable-next-line func-style
export function RoundThemeEditor(props: Props) {
  const gen = generateTestId(props.testid);
  const [showEditor, setShowEditor] = useState(false);
  const editable = props.editable ?? true;

  const handleSwitcherClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (editable) {
      setShowEditor(true);
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
  };

  const handleEditorSubmit = (theme: string) => {
    setShowEditor(false);
    if (!props.onThemeChange) {
      return;
    }
    props.onThemeChange(theme);
  };

  return (
    <div className={Styles.root} data-testid={gen("root")}>
      <span
        className={Styles.theme(!!props.initialTheme, showEditor, editable)}
        onClick={handleSwitcherClick}
        aria-disabled={!editable}
        data-testid={gen("theme")}
      >
        {props.initialTheme ?? "No theme"}
      </span>
      <Editor
        initialTheme={props.initialTheme}
        testid={gen("editor")}
        shown={showEditor}
        onCancel={handleEditorCancel}
        onSubmit={handleEditorSubmit}
      />
    </div>
  );
}
