import classNames from "classnames";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectJoinedGames } from "@/status/selectors/user";

const styles = {
  root: classNames(
    "flex",
    "flex-col",
    "relative",
    "m-auto",
    "min-w-fit",
    "w-1/2",
    "h-64",
    "shadow",
    "z-0",
    "border",
    "border-primary-400",
    "rounded"
  ),
  header: classNames("flex-none", "p-2", "text-lg", "font-bold", "rounded-t", "bg-primary-400", "text-secondary1-200"),
  main: {
    root: classNames("flex", "flex-auto", "flex-col", "overflow-y-auto"),
    container: classNames(
      "flex",
      "flex-[0_0_auto]",
      "h-12",
      "items-center",
      "text-lg",
      "transition-shadow",
      "rounded",
      "p-3",
      "relative",
      "m-3",
      "text-primary-500",
      "cursor-pointer",
      "border",
      "border-primary-400",
      "hover:shadow",
      "before:w-2",
      "before:h-full",
      "before:absolute",
      "before:left-0",
      "before:top-0",
      "before:transition-colors",
      "before:rounded-l",
      "hover:before:bg-secondary2-300"
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
  empty: classNames("flex-auto", "text-center", "relative"),
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
  const games = useAppSelector(selectJoinedGames());

  const gameComponents = games.map((v) => {
    return (
      <Link key={v.gameId} className={styles.main.container} to={`/game/${v.gameId}`}>
        <span data-testid="game-name">{v.name}</span>
      </Link>
    );
  });

  return (
    <div className={styles.root}>
      <header className={styles.header}>Select game you already joined</header>
      <main className={styles.main.root}>{games.length > 0 ? gameComponents : <Empty />}</main>
      <footer className={styles.footer}>
        <Link className={styles.opener} to="/game/create" role="button">
          Create Game
        </Link>
      </footer>
    </div>
  );
}
