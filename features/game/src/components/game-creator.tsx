import * as AppUrl from "@spp/shared-app-url";
import { Dialog } from "@spp/ui-dialog";
import { Loader } from "@spp/ui-loader";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateGameStatus } from "../atoms/game.js";
import { hooks } from "../hooks/facade.js";
import * as styles from "./game-creator.css.js";

const DEFAULT_POINTS = "1,2,3,5,8,13,21,34,55,89";

// eslint-disable-next-line func-style
export function GameCreator() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [nameError, setNameError] = useState<string | undefined>();
  const [pointsError, setPointsError] = useState<string | undefined>();
  const createGame = hooks.useCreateGame();
  const navigate = useNavigate();

  const handleBlur = () => {
    createGame.validate(name, points);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createGame.create(name, points);
  };

  useEffect(() => {
    if (createGame.status == CreateGameStatus.Completed) {
      navigate(AppUrl.gameIndexPage());
    }
  }, [createGame.status]);

  useEffect(() => {
    setNameError(undefined);
    setPointsError(undefined);

    createGame.errors.forEach((v) => {
      if (v == "InvalidName") {
        setNameError("Invalid name");
      } else if (v == "NameConflicted") {
        setNameError("This name already exists in your games");
      } else if (v == "InvalidPoints") {
        setPointsError("Invalid points");
      }
    });
  }, [createGame.errors]);

  const loading = createGame.status == CreateGameStatus.Waiting;

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
            onBlur={handleBlur}
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
            onBlur={handleBlur}
            tabIndex={0}
            disabled={loading}
          />
          {pointsError ? <p className={styles.input.error}>{pointsError}</p> : undefined}
        </div>
        <div className={styles.footer.root}>
          <button type="button" className={loading ? styles.cancelDisabled : styles.cancel}>
            Cancel
          </button>
          <button className={loading ? styles.submitLoading : styles.footer.submit} type="submit" aria-busy={loading}>
            <Loader size="s" shown={loading} variant="emerald" />
            {loading ? "" : "Submit"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
