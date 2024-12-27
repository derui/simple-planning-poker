import { useCallback } from "react";
import { useCreateGame } from "../../atoms/use-create-game.js";
import { GameCreatorLayout } from "./game-creator.layout.js";

interface Props {
  /**
   * The function that is called when the user clicks on the cancel button.
   */
  onCancel: () => void;
}

/**
 * The component that allows the user to create a new game.
 */
export const GameCreator = function GameCreator({ onCancel }: Props): JSX.Element {
  const { loading, errors, create } = useCreateGame();

  const handleSubmit = useCallback((name: string, points: string) => {
    create(name, points);
  }, []);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return <GameCreatorLayout onSubmit={handleSubmit} onCancel={handleCancel} errors={errors} loading={loading} />;
};
