import { hooks } from "../../hooks/facade.js";
import { GameListLayout } from "./game-list.layout.js";

export const GameList = function GameList(): JSX.Element {
  const { games, selectedGame, select, requestCreate } = hooks.useListGames();

  const handleSelect = (gameId: string) => {
    select(gameId);
  };

  const handleRequestCreate = () => {
    requestCreate();
  };

  return (
    <GameListLayout
      games={games}
      selectedGame={selectedGame?.id}
      onRequestCreate={handleRequestCreate}
      onSelect={handleSelect}
    />
  );
};
