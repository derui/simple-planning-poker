import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { GameDto } from "../../atoms/dto.js";
import { GameListItem } from "./game-list-item.js";
import * as styles from "./game-list.css.js";

export interface Props {
  games: GameDto[];

  /**
   *  Callback when request to create a new game is received.
   */
  onCreate?: () => void;

  /**
   * Callback when a game is selected.
   */
  onSelect?: (id: string) => void;
}

export const GameList = function GameList({ games, onCreate, onSelect }: Props): JSX.Element {
  const items = games.map((v) => (
    <GameListItem key={v.id} gameId={v.id} name={v.name} selected={v.owned} onClick={() => onSelect?.(v.id)} />
  ));

  return (
    <ul className={styles.root}>
      {items}
      <li className={styles.plusContainer} onClick={onCreate}>
        <Icon.Plus size="m" variant={Variant.indigo} />
        Add Game
      </li>
    </ul>
  );
};
