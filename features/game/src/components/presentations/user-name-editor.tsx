import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { Input } from "@spp/ui-input";
import * as styles from "./user-name-editor.css.js";

export interface Props {
  /**
   * the default value of this component
   */
  readonly defaultValue: string;

  /**
   * The callback on submit
   */
  readonly onSubmit?: (value: string) => void;

  /**
   * The callback on cancel
   */
  readonly onCancel?: () => void;
}

export const UserNameEditor = function UserNameEditor({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("userName") ?? "";

    onSubmit?.(userName.toString());
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    onCancel?.();
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <span className={styles.decoration}>
        <Icon.Pencil size="m" variant={Variant.teal} />
      </span>
      <Input autoFocus name="userName" defaultValue={defaultValue} />
      <button type="submit" className={styles.submit} aria-label="Submit">
        <Icon.Check size="m" variant={Variant.emerald} />
      </button>
      <button type="button" className={styles.cancel} onClick={handleCancel} aria-label="Cancel">
        <Icon.X size="m" variant={Variant.cerise} />
      </button>
    </form>
  );
};
