import { useMemo } from "react";
import { CreateGameStatus } from "../../atoms/type.js";
import { hooks } from "../../hooks/facade.js";
import { GameCreatorLayout } from "./game-creator.layout.js";

interface Props {
  /**
   * Callback invoked when the game is created
   */
  onGameCreated?: (gameId: string) => void;
}

// eslint-disable-next-line func-style
export function GameCreator({ onGameCreated }: Props): JSX.Element {
  const createGame = hooks.useCreateGame();
  const errors = useMemo(() => {
    const errors: Record<string, string> = {};

    createGame.errors.forEach((v) => {
      if (v == "InvalidName") {
        errors.name = "Invalid name";
      } else if (v == "NameConflicted") {
        errors.name = "This name already exists in your games";
      } else if (v == "InvalidPoints") {
        errors.points = "Invalid points";
      }
    });

    return errors;
  }, [createGame.errors]);
  const loading = CreateGameStatus.Waiting == createGame.status;

  const handleCreateGame = (name: string, points: string) => {
    createGame.create(name, points, onGameCreated);
  };

  return (
    <GameCreatorLayout
      loading={loading}
      onValidate={createGame.validate}
      onCreateGame={handleCreateGame}
      errors={errors}
    />
  );
}
