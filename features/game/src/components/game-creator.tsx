import clsx from "clsx";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@spp/ui-dialog";
import { buttonStyle } from "@spp/ui-button-style";
import { Loader } from "@spp/ui-loader";
import { hooks } from "../hooks/facade.js";
import { CreateGameStatus } from "../atoms/game.js";
import * as AppUrl from "@spp/shared-app-url";

const DEFAULT_POINTS = "1,2,3,5,8,13,21,34,55,89";

const styles = {
  root: clsx("flex-auto", "bg-white", "p-4", "flex", "flex-row"),
  input: {
    container: clsx("w-full", "mx-auto", "grid", "grid-cols-1", "grid-rows-[auto_auto_auto]", "p-3", "gap-2"),
    row: clsx("grid", "grid-cols-1", "grid-rows-[auto_auto_auto]", "mb-4", "last:mb-0", "gap-2"),
    label: clsx("text-emerald-700"),
    input: clsx(
      "w-full",
      "p-2",
      "outline-none",
      "rounded",
      "border",
      "border-emerald-800",
      "bg-gray-100",
      "transition-colors",
      "focus:border-emerald-600",
      "focus:bg-white"
    ),
    error: clsx("text-cerise-700", "bg-cerise-200", "px-3", "py-1", "rounded"),
  },
  footer: {
    root: clsx("grid", "grid-cols-3", "grid-rows-1", "mt-2"),
    cancel(loading: boolean) {
      return clsx(buttonStyle({ variant: "gray", disabled: loading }));
    },
    submit(loading: boolean) {
      return clsx(
        "col-start-3",
        "col-end-4",
        "grid",
        "grid-cols-[auto_auto]",
        "place-items-center",
        "gap-1",
        "place-content-center",
        buttonStyle({ variant: "emerald", disabled: loading })
      );
    },
  },
} as const;

// eslint-disable-next-line func-style
export function GameCreator() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [nameError, setNameError] = useState<string | undefined>();
  const [pointsError, setPointsError] = useState<string | undefined>();
  const createGame = hooks.useCreateGame();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNameError(undefined);
    setPointsError(undefined);

    const errors = createGame.canCreate(name, points);
    if (errors.length > 0) {
      errors.forEach((v) => {
        if (v == "InvalidName") {
          setNameError("Invalid name");
        } else if (v == "NameConflicted") {
          setNameError("This name already exists in your games");
        } else if (v == "InvalidPoints") {
          setPointsError("Invalid points");
        }
      });
      return;
    }

    createGame.create(name, points);
  };

  useEffect(() => {
    if (createGame.status == CreateGameStatus.Completed) {
      navigate(AppUrl.gameIndexPage());
    }
  }, [createGame.status]);

  const loading = createGame.status == CreateGameStatus.Waiting || createGame.status == CreateGameStatus.Preparing;

  return (
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
            tabIndex={0}
            disabled={loading}
          />
          {nameError ? <p className={styles.input.error}>{nameError}</p> : undefined}
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
            tabIndex={0}
            disabled={loading}
          />
          {pointsError ? <p className={styles.input.error}>{pointsError}</p> : undefined}
        </div>
        <div className={styles.footer.root}>
          <button type="button" className={styles.footer.cancel(loading)}>
            Cancel
          </button>
          <button className={styles.footer.submit(loading)} type="submit" aria-busy={loading}>
            <Loader size="s" shown={loading} variant="emerald" />
            {loading ? "" : "Submit"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
