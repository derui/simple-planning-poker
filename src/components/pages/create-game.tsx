import classNames from "classnames";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Dialog } from "../presentations/dialog";
import { baseInput } from "../common-styles";
import { createGame } from "@/status/actions/game";
import * as Game from "@/domains/game";
import { selectGameCreatingStatus } from "@/status/selectors/game";

const DEFAULT_POINTS = "1,2,3,5,8,13,21,34,55,89";

const styles = {
  main: {
    root: classNames("flex-auto", "bg-white", "p-4", "flex", "flex-row"),
    description: classNames("align-center", "text-primary-400"),
    input: {
      container: classNames("w-full", "mx-auto", "flex-auto", "px-3"),
      row: classNames("flex", "items-center", "mb-4", "last:mb-0"),
      label: classNames("flex-auto", "w-24", "mr-3", "text-secondary2-500"),
      input: classNames(baseInput),
    },
  },
} as const;

// eslint-disable-next-line func-style
export function CreateGamePage() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const status = useAppSelector(selectGameCreatingStatus);
  const canSubmit = Game.canChangeName(name) && points.split(",").filter((v) => v.trim() !== "").length > 0;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const dispatchEvent = () => {
    dispatch(
      createGame({
        name,
        points: points.split(",").map((v) => Number(v.trim())),
      })
    );
  };

  const buttonState = status === "creating" ? "loading" : canSubmit ? "enabled" : "disabled";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatchEvent();
  };

  useEffect(() => {
    if (status === "created") {
      navigate("/game");
    }
  }, [status]);

  return (
    <Dialog title="Create game" buttonState={buttonState} onSubmitClick={dispatchEvent}>
      <form className={styles.main.input.container} onSubmit={handleSubmit}>
        <span className={styles.main.input.row}>
          <label htmlFor="name" className={styles.main.input.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. A sprint"
            className={styles.main.input.input}
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </span>
        <span className={styles.main.input.row}>
          <label htmlFor="points" className={styles.main.input.label}>
            Points
          </label>
          <input
            type="text"
            id="points"
            name="points"
            className={styles.main.input.input}
            defaultValue={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </span>
      </form>
    </Dialog>
  );
}

export default CreateGamePage;
