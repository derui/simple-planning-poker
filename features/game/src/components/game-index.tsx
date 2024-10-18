import clsx from "clsx";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { hooks } from "../hooks/facade.js";
import { GameListItem } from "./presentations/game-list-item.js";
import * as AppUrl from "@spp/shared-app-url";
import { PrepareGameStatus } from "../atoms/game.js";
import { Loader } from "@spp/ui-loader";
import { buttonStyle } from "@spp/ui-button-style";

const styles = {
  root: clsx("grid", "w-full", "h-full", "place-content-center", "relative"),
  container: clsx(
    "grid",
    "grid-rows-[auto_1fr_auto]",
    "grid-cols-1",
    "w-96",
    "rounded",
    "border",
    "border-purple-600",
    "overflow-hidden"
  ),
  header: clsx("p-4", "text-lg", "font-bold", "bg-purple-200", "text-purple-700"),
  main: {
    root: clsx(),
    list: clsx("max-h-96", "overflow-y-auto"),
  },
  footer: clsx(
    "flex",
    "flex-col",
    "items-end",
    "p-4",
    "text-lg",
    "font-bold",
    "border-t",
    "border-primary-400",
    "text-secondary1-200"
  ),
  creator: clsx(buttonStyle({ variant: "emerald" })),
  empty: clsx("flex-auto", "text-center", "relative", "py-10", "px-3"),
  emptyText: clsx("relative", "align-middle", "text-lg", "font-bold"),
  loading: {
    root: clsx("grid", "w-full", "h-full", "place-content-center", "bg-gray-100"),
    container: clsx(
      "grid",
      "grid-rows-2",
      "grid-cols-1",
      "place-items-center",
      "gap-4",

      "rounded",
      "bg-white",
      "w-64",
      "h-36",
      "p-8"
    ),
    text: clsx("text-lg", "text-emerald-700"),
  },
} as const;

const Empty = () => {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyText}>You do not have games.</span>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.loading.root}>
      <div className={styles.loading.container}>
        <span className={styles.loading.text}>Loading...</span>
        <Loader size="l" shown />
      </div>
    </div>
  );
};

// eslint-disable-next-line func-style
export function GameIndex() {
  const [token, setToken] = useState("");
  const { games } = hooks.useListGame();
  const { status } = hooks.usePrepareGame();
  const navigate = useNavigate();

  if (status != PrepareGameStatus.Prepared) {
    return <Loading />;
  }

  const gameComponents = games.map((v) => {
    return <GameListItem gameId={v.id} name={v.name} owned={v.owned} />;
  });

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <header className={styles.header}>Select game you created</header>
        <main className={styles.main.root}>
          <ul className={styles.main.list}>{games.length > 0 ? gameComponents : <Empty />}</ul>
        </main>
        <footer className={styles.footer}>
          <Link className={styles.creator} to={AppUrl.gameCreatePage()} role="button">
            New Game
          </Link>
        </footer>
      </div>
    </div>
  );
}
