import { zodResolver } from "@hookform/resolvers/zod";
import { Variant } from "@spp/shared-color-variant";
import { ApplicablePoints } from "@spp/shared-domain";
import { Input } from "@spp/ui-input";
import { Loader } from "@spp/ui-loader";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import * as styles from "./game-editor.css.js";

interface Props {
  defaultName?: string;

  defaultPoints?: string;

  /**
   * do submit after validate is succeeded
   */
  onSubmit?: (name: string, points: string) => void;

  onCancel?: () => void;

  loading?: boolean;
}

interface Input {
  name: string;
  points: string;
}

const schema = z.object({
  name: z.string().min(1),
  points: z
    .string()
    .min(1)
    .refine((v) => ApplicablePoints.parse(v), { message: "Invalid points" }),
});

// eslint-disable-next-line func-style
export function GameEditor(props: Props): JSX.Element {
  const { defaultName, defaultPoints, onSubmit, loading = false, onCancel } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(schema),
  });

  const handleWrappedSusbmit: SubmitHandler<Input> = (data) => {
    onSubmit?.(data.name, data.points);
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit(handleWrappedSusbmit)}>
      <div className={styles.input.row}>
        <label htmlFor="name" className={styles.input.label}>
          Name
        </label>
        <Input
          type="text"
          id="name"
          placeholder="e.g. A sprint"
          className={styles.input.input}
          defaultValue={defaultName}
          tabIndex={0}
          disabled={loading}
          {...register("name")}
        />
        {errors?.name?.message ? <p className={styles.input.error}>{errors.name.message}</p> : undefined}
      </div>
      <div className={styles.input.row}>
        <label htmlFor="points" className={styles.input.label}>
          Points
        </label>
        <Input
          type="text"
          id="points"
          className={styles.input.input}
          defaultValue={defaultPoints}
          tabIndex={0}
          disabled={loading}
          {...register("points")}
        />
        {errors?.points?.message ? <p className={styles.input.error}>{errors.points.message}</p> : undefined}
      </div>
      <div className={styles.footer.root}>
        <button type="button" className={loading ? styles.cancelDisabled : styles.cancel} onClick={onCancel}>
          Cancel
        </button>
        <button className={loading ? styles.submitLoading : styles.footer.submit} type="submit" aria-busy={loading}>
          <Loader size="s" shown={loading} variant={Variant.emerald} />
          {loading ? "" : "Submit"}
        </button>
      </div>
    </form>
  );
}
