import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { Icon, Icons } from "@spp/ui-icon";
import { clsx } from "clsx";
import { FormEvent, useEffect, useRef, useState } from "react";

export interface Props {
  /**
   * submit theme after editing finished
   */
  onSubmit?: (theme: string) => void;

  /**
   * Initial value of theme
   */
  theme: string;
}

const styles = {
  root: clsx("flex", "px-8", "py-2", "rounded-full", "border", "border-teal-600", "h-12"),
  contentContainer: clsx("flex-auto", "flex", "flex-row", "items-center"),
  theme: clsx("flex-auto", "text-teal-700", "font-bold", "text-lg"),
  edit: clsx(
    "border",
    "border-transparent",
    "hover:border-orange-600",
    "hover:bg-orange-100",
    "transition",
    "p-1",
    "rounded-full"
  ),
  editor: {
    root: clsx("flex", "flex-row", "flex-auto", "items-center", "gap-2"),
    input: clsx("flex-auto", "w-full", "p-2", "outline-none", "rounded", "transition-colors"),
    submit: clsx(
      "flex-none",
      "border",
      "border-transparent",
      "hover:border-emerald-600",
      "hover:bg-emerald-100",
      "transition",
      "p-1",
      "rounded-full"
    ),
    cancel: clsx(
      "flex-none",
      "border",
      "border-transparent",
      "hover:border-gray-600",
      "hover:bg-gray-100",
      "transition",
      "p-1",
      "rounded-full"
    ),
  },
} as const;

const ThemeEditorInternal = function ThemeEditorInternal({
  theme,
  onSubmit,
  onCancel,
}: Props & { onCancel: () => void }) {
  const [state, setState] = useState(theme);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const handleChange = (input: FormEvent<HTMLInputElement>) => {
    setState(input.currentTarget.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit?.(state);
  };

  return (
    <form className={styles.editor.root} onSubmit={handleSubmit}>
      <input
        ref={ref}
        type="text"
        tabIndex={1}
        className={styles.editor.input}
        onInput={handleChange}
        defaultValue={state}
        placeholder="theme of this voting"
      />
      <button type="submit" className={styles.editor.submit}>
        <Icon type={Icons.check} variant={Variant.emerald} />
      </button>
      <button type="button" aria-label="cancel" className={styles.editor.cancel} onClick={onCancel}>
        <Icon type={Icons.x} variant={Variant.gray} />
      </button>
    </form>
  );
};

export const ThemeEditor = function ThemeEditor({ theme, onSubmit }: Props) {
  const [editing, setEditing] = useState(false);

  const handleEditing = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const content = editing ? (
    <ThemeEditorInternal theme={theme} onSubmit={onSubmit} onCancel={handleCancel} />
  ) : (
    <div className={styles.contentContainer}>
      <span className={styles.theme}>{theme}</span>
      <button type="button" onClick={handleEditing} className={styles.edit}>
        <Icon type={Icons.pencil} variant={Variant.orange} />
      </button>
    </div>
  );

  return <div className={styles.root}>{content}</div>;
};
