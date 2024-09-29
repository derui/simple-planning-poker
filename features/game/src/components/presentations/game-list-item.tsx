import clsx from "clsx";
import { Link } from "react-router-dom";
import * as AppUrl from "@spp/shared-app-url";
import { Game } from "@spp/shared-domain";

export interface Props {
  gameId: string;
  name: string;
  owned?: boolean;
}

const styles = {
  main: clsx(
    "list-none",
    "w-full",
    "h-16",
    "border",
    "border-purple-200",
    "bg-purple-50",
    "text-purple-700",
    "transition",
    "hover:border-purple-600",
    "hover:shadow-lg"
  ),
  link: clsx("grid", "grid-cols-[1fr_auto]", "grid-rows-1", "w-full", "h-full", "place-content-center", "px-4"),
  linkName: clsx("place-content-center", "text-lg"),
  ownerMarkContainer: clsx("inline-block", "place-content-center"),
  ownerMark: (owned: boolean) =>
    clsx("inline-block", "bg-purple-200", "text-purple-600", "rounded-full", "place-content-center", "px-3", "py-1", {
      invisible: !owned,
    }),
} as const;

export const GameListItem = function GameListItem({ gameId, owned, name }: Props) {
  return (
    <li key={gameId} className={styles.main}>
      <Link className={styles.link} to={AppUrl.votingPage(Game.createId(gameId))}>
        <span className={styles.linkName}>{name}</span>
        <span className={styles.ownerMarkContainer}>
          <span className={styles.ownerMark(owned ?? false)}>Owner</span>
        </span>
      </Link>
    </li>
  );
};
