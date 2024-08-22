import classNames from "classnames";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useAppSelector } from "../hooks";
import { baseInput } from "../common-styles";
import { selectJoinedGames } from "@/status/selectors/user";

const styles = {
  root: classNames(
    "flex",
    "flex-col",
    "absolute",
    "w-1/2",
    "max-h-96",
    "shadow",
    "z-0",
    "border",
    "border-primary-400",
    "rounded",
    "top-1/2",
    "left-1/2",
    "[transform:translate(-50%,-50%)]"
  ),
  header: classNames("flex-none", "p-2", "text-lg", "font-bold", "rounded-t", "bg-primary-400", "text-secondary1-200"),
  main: {
    root: classNames("flex", "flex-auto", "flex-col", "overflow-y-auto"),
    list: classNames("flex", "flex-auto", "flex-col", "overflow-y-auto"),
    container: classNames(
      "flex",
      "flex-[0_0_auto]",
      "items-center",
      "text-lg",
      "transition-shadow",
      "rounded",
      "relative",
      "m-3",
      "text-primary-500",
      "border",
      "border-primary-400",
      "hover:shadow-md",
      "before:w-2",
      "before:h-full",
      "before:absolute",
      "before:left-0",
      "before:top-0",
      "before:transition-colors",
      "before:rounded-l",
      "active:before:bg-secondary2-300"
    ),
    link: classNames("flex-auto", "h-full", "px-3", "py-4"),
    invitation: classNames("flex", "flex-none", "px-3", "mt-3", "border-b", "border-b-primary-400", "pb-3"),
    invitationToken: classNames(baseInput, "rounded-r-none"),
    joinButton: (enabled: boolean) =>
      classNames(
        "rounded",
        "rounded-l-none",
        "flex-none",
        "text-sm",
        "p-2",
        "border",
        "border-l-none",
        "transition-[color,box-shadow,border-color]",
        "active:shadow",
        {
          "border-secondary1-400": enabled,
          "text-secondary1-500": enabled,
          "bg-secondary1-200": enabled,
        },
        {
          "border-gray": !enabled,
          "text-gray": !enabled,
          "bg-lightgray": !enabled,
        }
      ),
  },
  footer: classNames(
    "flex",
    "flex-col",
    "items-end",
    "p-2",
    "text-lg",
    "font-bold",
    "rounded-b",
    "border-t",
    "border-primary-400",
    "text-secondary1-200"
  ),
  opener: classNames(
    "flex-[0_0_auto]",
    "outline-none",
    "border",
    "border-secondary1-500",
    "rounded",
    "bg-secondary1-200",
    "text-secondary1-500",
    "px-3",
    "py-2",
    "transition-all",
    "active:shadow",
    "hover:text-secondary1-200",
    "hover:bg-secondary1-500"
  ),
  empty: classNames("flex-auto", "text-center", "relative", "py-10", "px-3"),
  emptyText: classNames("relative", "align-middle", "text-lg", "font-bold"),
} as const;

const Empty = () => {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyText}>You do not have games that you are invited before.</span>
    </div>
  );
};

// eslint-disable-next-line func-style
export function SelectGamePage() {
  const [token, setToken] = useState("");
  const games = useAppSelector(selectJoinedGames);
  const navigate = useNavigate();

  const gameComponents = games.map((v) => {
    return (
      <li key={v.gameId} className={styles.main.container}>
        <Link className={styles.main.link} to={`/game/${v.gameId}`}>
          <span data-testid="game-name">{v.name}</span>
        </Link>
      </li>
    );
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (token) {
      navigate(generatePath("/invitation/:token", { token: token }));
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>Select game you already joined</header>
      <main className={styles.main.root}>
        <form className={styles.main.invitation} onSubmit={handleSubmit}>
          <input
            className={styles.main.invitationToken}
            placeholder="Paste invitation token here"
            onChange={(e) => setToken(e.target.value)}
          />
          <button className={styles.main.joinButton(token !== "")} disabled={token === ""}>
            Join
          </button>
        </form>
        <ul className={styles.main.list}>{games.length > 0 ? gameComponents : <Empty />}</ul>
      </main>
      <footer className={styles.footer}>
        <Link className={styles.opener} to={"/game/create"} role="button">
          Create Game
        </Link>
      </footer>
    </div>
  );
}

export default SelectGamePage;
