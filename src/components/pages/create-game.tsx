import classNames from "classnames";
import { FormEvent, useState } from "react";
import { useAppDispatch } from "../hooks";
import { createGame } from "@/status/actions/game";
import * as Game from "@/domains/game";

const DEFAULT_POINTS = "1,2,3,5,8,13,21,34,55,89";

const styles = {
  root: classNames(
    "flex",
    "flex-col",
    "relative",
    "m-auto",
    "min-w-fit",
    "max-w-md",
    "shadow",
    "z-10",
    "border",
    "border-primary-400",
    "rounded"
  ),

  header: classNames(
    "flex-[0_0_auto]",
    "p-2",
    "text-lg",
    "font-bold",
    "rounded-t",
    "bg-primary-400",
    "text-secondary1-200"
  ),
  headerText: classNames("align-middle"),
  main: {
    root: classNames("flex-auto", "bg-white", "p-4", "flex", "flex-row"),
    description: classNames("align-center", "text-primary-400"),
    input: {
      container: classNames("w-full", "mx-auto", "flex-auto", "px-3"),
      row: classNames("flex", "items-center", "mb-4", "last:mb-0"),
      label: classNames("flex-auto", "w-24", "mr-3", "text-secondary2-500"),
      input: classNames(
        "flex-auto",
        "w-full",
        "p-2",
        "outline-none",
        "rounded",
        "border",
        "border-lightgray/40",
        "bg-lightgray/20",
        "transition-colors",
        "focus:border-secondary2-500",
        "focus:bg-white"
      ),
    },
  },

  footer: classNames(
    "flex-[0_0_auto]",
    "p-2",
    "text-lg",
    "font-bold",
    "rounded-b",
    "text-right",
    "border-t",
    "border-primary-400",
    "text-secondary1-200"
  ),
  submit: (canSubmit: boolean) =>
    classNames(
      "flex-auto",
      "outline-none",
      "border",
      "rounded",
      "px-3",
      "py-2",
      "transition-all",
      {
        "active:shadow": canSubmit,
        "hover:text-secondary1-200": canSubmit,
        "hover:bg-secondary1-500": canSubmit,
        "border-secondary1-500": canSubmit,
        "bg-secondary1-200": canSubmit,
        "text-secondary1-500": canSubmit,
      },
      {
        "border-gray": !canSubmit,
        "bg-lightgray": !canSubmit,
        "text-gray": !canSubmit,
      }
    ),
} as const;

// eslint-disable-next-line func-style
export function CreateGamePage() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const canSubmit = Game.canChangeName(name) && points.split(",").filter((v) => v.trim() !== "").length > 0;
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(
      createGame({
        name,
        points: points.split(",").map((v) => Number(v.trim())),
      })
    );
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit} data-testid="root">
      <header className={styles.header} data-testid="header">
        <span className={styles.headerText}> Create game</span>
      </header>
      <main className={styles.main.root} data-testid="main">
        <div className={styles.main.input.container}>
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
        </div>
      </main>
      <footer className={styles.footer}>
        <button className={styles.submit(canSubmit)} type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </footer>
    </form>
  );
}

export default CreateGamePage;
