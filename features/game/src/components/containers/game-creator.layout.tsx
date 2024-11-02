import { Variant } from "@spp/shared-color-variant";
import { Dialog } from "@spp/ui-dialog";
import { Loader } from "@spp/ui-loader";
import { FormEvent, useState } from "react";
import * as styles from "./game-creator.css.js";

interface Props {
  onCreateGame?: (name: string, points: string) => void;

  onValidate?: (name: string, points: string) => void;

  errors?: { name?: string; points?: string };

  loading?: boolean;
}

const DEFAULT_POINTS = "1,2,3,5,8,13,21,34,55,89";

// eslint-disable-next-line func-style
export function GameCreatorLayout(props: Props): JSX.Element {
  const { onValidate, onCreateGame, errors, loading = false } = props;

  const [name, setName] = useState("");
  const [points, setPoints] = useState(DEFAULT_POINTS);

  const handleBlur = () => {
    onValidate?.(name, points);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onCreateGame?.(name, points);
  };

  return (
    <div className={styles.root}>
      <Dialog title="Create game">
        <form className={styles.input.container} onSubmit={handleSubmit}>
          <div className={styles.input.row}>
            <label htmlFor="name" className={styles.input.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. A sprint"
              className={styles.input.input}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              tabIndex={0}
              disabled={loading}
            />
            {errors?.name ? <p className={styles.input.error}>{errors.name}</p> : undefined}
          </div>
          <div className={styles.input.row}>
            <label htmlFor="points" className={styles.input.label}>
              Points
            </label>
            <input
              type="text"
              id="points"
              name="points"
              className={styles.input.input}
              defaultValue={points}
              onChange={(e) => setPoints(e.target.value)}
              onBlur={handleBlur}
              tabIndex={0}
              disabled={loading}
            />
            {errors?.points ? <p className={styles.input.error}>{errors.points}</p> : undefined}
          </div>
          <div className={styles.footer.root}>
            <button type="button" className={loading ? styles.cancelDisabled : styles.cancel}>
              Cancel
            </button>
            <button className={loading ? styles.submitLoading : styles.footer.submit} type="submit" aria-busy={loading}>
              <Loader size="s" shown={loading} variant={Variant.emerald} />
              {loading ? "" : "Submit"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
