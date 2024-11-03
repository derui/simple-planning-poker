import * as AppUrl from "@spp/shared-app-url";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateGameStatus } from "../../atoms/type.js";
import { hooks } from "../../hooks/facade.js";
import { GameCreatorLayout } from "./game-creator.layout.js";

// eslint-disable-next-line func-style
export function GameCreator(): JSX.Element {
  const createGame = hooks.useCreateGame();
  const navigate = useNavigate();
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

  if (createGame.status == CreateGameStatus.Completed) {
    navigate(AppUrl.gameIndexPage());
  }

  const handleCreateGame = (name: string, points: string) => {
    createGame.create(name, points);
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
