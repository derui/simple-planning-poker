import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { GameDto } from "../../atoms/dto.js";
import { GameListItem } from "./game-list-item.js";
import * as styles from "./game-list.css.js";

export interface Props {
  games: GameDto[];

  /**
   *  The currently selected game.
   */
  selectedGame?: string;

  /**
   *  Callback when request to create a new game is received.
   */
  onRequestCreate?: () => void;

  /**
   * Callback when a game is selected.
   */
  onSelect?: (id: string) => void;
}

export const GameList = function GameList({ games, onRequestCreate, onSelect, selectedGame }: Props): JSX.Element {
  const items = games.map((v) => (
    <GameListItem
      key={v.id}
      gameId={v.id}
      name={v.name}
      selected={v.id == selectedGame}
      onClick={() => onSelect?.(v.id)}
    />
  ));

  const handleRequestCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onRequestCreate?.();
  };

  return (
    <ul className={styles.root}>
      {items}
      <li className={styles.plusContainer} onClick={handleRequestCreate}>
        <Icon.Plus size="m" variant={Variant.indigo} />
        Add Game
      </li>
    </ul>
  );
};
