import { zodResolver } from "@hookform/resolvers/zod";
import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { Input } from "@spp/ui-input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
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

interface Form {
  readonly userName: string;
}

const schema = z.object({
  userName: z.string().min(1, { message: "required" }),
});

export const UserNameEditor = function UserNameEditor({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const { register, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const wrappedHandleSubmit: SubmitHandler<Form> = (data) => {
    onSubmit?.(data.userName);
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    onCancel?.();
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit(wrappedHandleSubmit)}>
      <span className={styles.decoration}>
        <Icon.Pencil size="m" variant={Variant.teal} />
      </span>
      <Input autoFocus defaultValue={defaultValue} {...register("userName")} />
      <button type="submit" className={styles.submit} aria-label="Submit">
        <Icon.Check size="m" variant={Variant.emerald} />
      </button>
      <button type="button" className={styles.cancel} onClick={handleCancel} aria-label="Cancel">
        <Icon.X size="m" variant={Variant.cerise} />
      </button>
    </form>
  );
};
