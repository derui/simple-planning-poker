import clsx from "clsx";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@spp/ui-dialog";
import { Game } from "@spp/shared-domain";

const DEFAULT_POINTS = "1,2,3,5,8,13,21,34,55,89";

const styles = {
  root: clsx("flex-auto", "bg-white", "p-4", "flex", "flex-row"),
  description: clsx("align-center", "text-primary-400"),
  input: {
    container: clsx("w-full", "mx-auto", "flex-auto", "px-3"),
    row: clsx("flex", "items-center", "mb-4", "last:mb-0"),
    label: clsx("flex-auto", "w-24", "mr-3", "text-secondary2-500"),
  },
} as const;

// eslint-disable-next-line func-style
export function GameCreator() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const canSubmit = Game.canChangeName(name) && points.split(",").filter((v) => v.trim() !== "").length > 0;
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (status === "created") {
      navigate("/game");
    }
  }, [status]);

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
          />
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
          />
        </div>
      </form>
    </Dialog>
  );
}
