import { GameDto } from "../../atoms/dto.js";
import { GameList } from "../presentations/game-list.js";
import * as styles from "./game-list.css.js";

export interface Props {
  readonly games: GameDto[];

  readonly selectedGame?: string;

  readonly onRequestCreate: () => void;

  /**
   *  handler for selecting game
   */
  readonly onSelect: (gameId: string) => void;
}

export const GameListLayout = function GameListLayout({
  games,
  selectedGame,
  onRequestCreate,
  onSelect,
}: Props): JSX.Element {
  return (
    <div className={styles.root}>
      <GameList games={games} selectedGame={selectedGame} onSelect={onSelect} onRequestCreate={onRequestCreate} />
    </div>
  );
};
