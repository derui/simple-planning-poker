import { Variant } from "@spp/shared-color-variant";
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
  root: clsx("flex", "px-4", "py-1", "rounded-full", "border", "border-teal-600", "h-12"),
  contentContainer: clsx("flex-auto", "flex", "flex-row", "items-center", "gap-4"),
  theme: clsx("flex-auto", "text-teal-700", "font-bold", "text-lg"),
  themePlaceholder: clsx("flex-auto", "text-gray-700", "font-bold", "text-lg"),
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
    submit: (editing: boolean) =>
      clsx(
        "flex-none",
        "border",
        "border-transparent",
        "hover:border-emerald-600",
        "hover:bg-emerald-100",
        "transition",
        "p-1",
        "rounded-full",
        {
          hidden: !editing,
        }
      ),
    cancel: (editing: boolean) =>
      clsx(
        "flex-none",
        "border",
        "border-transparent",
        "hover:border-gray-600",
        "hover:bg-gray-100",
        "transition",
        "p-1",
        "rounded-full",
        {
          hidden: !editing,
        }
      ),
  },
} as const;

const ThemeEditorInternal = function ThemeEditorInternal({
  editing,
  theme,
  onSubmit,
  onCancel,
}: Props & { editing: boolean; onCancel: () => void }) {
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

    if (editing) {
      onSubmit?.(state);
    }
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
        placeholder="No theme"
        readOnly={!editing}
      />
      <button type="submit" className={styles.editor.submit(editing)} disabled={!editing} aria-label="submit">
        <Icon type={Icons.check} variant={Variant.emerald} />
      </button>
      <button
        type="button"
        aria-label="cancel"
        className={styles.editor.cancel(editing)}
        onClick={onCancel}
        disabled={!editing}
      >
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

  const handleSubmit = (value: string) => {
    setEditing(false);
    onSubmit?.(value);
  };

  const editButton = !editing ? (
    <button type="button" onClick={handleEditing} className={styles.edit} aria-label="edit">
      <Icon type={Icons.pencil} variant={Variant.orange} />
    </button>
  ) : null;

  return (
    <div className={styles.root}>
      <ThemeEditorInternal editing={editing} theme={theme} onSubmit={handleSubmit} onCancel={handleCancel} />
      {editButton}
    </div>
  );
};
