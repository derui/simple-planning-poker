import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import * as styles from "./theme-editor.css.js";

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

  useEffect(() => {
    setState(theme);
  }, [theme]);

  const handleChange = (input: FormEvent<HTMLInputElement>) => {
    setState(input.currentTarget.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (editing) {
      onSubmit?.(state);
    }
  };

  const handleCancel = (e: MouseEvent) => {
    e.stopPropagation();

    if (editing) {
      onCancel?.();
    }
    setState(theme);
  };

  return (
    <div>
      <span className={styles.header}>Theme Editor</span>
      {editing ? (
        <form className={styles.editorRoot} onSubmit={handleSubmit}>
          <input
            ref={ref}
            type="text"
            tabIndex={1}
            className={styles.editorInput}
            onInput={handleChange}
            value={state}
            placeholder="No theme"
            readOnly={!editing}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!editing}
            aria-label="submit"
          >
            <Icon.Check variant={Variant.emerald} />
          </button>
          <button
            type="button"
            aria-label="cancel"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={!editing}
          >
            <Icon.X variant={Variant.gray} />
          </button>
        </form>
      ) : (
        <span className={styles.editorRoot}>{state ? state : "No theme"}</span>
      )}
    </div>
  );
};

export const ThemeEditor = function ThemeEditor({ theme, onSubmit }: Props): JSX.Element {
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
      <Icon.Pencil variant={Variant.orange} />
    </button>
  ) : null;

  return (
    <div className={styles.root}>
      <ThemeEditorInternal editing={editing} theme={theme } onSubmit={handleSubmit} onCancel={handleCancel} />
      {editButton}
    </div>
  );
};
