import { UseLoginUser } from "@spp/feature-login";
import { GameRepository, User } from "@spp/shared-domain";
import { EditGameUseCase, EditGameUseCaseInput } from "@spp/shared-use-case";
import { atom, useAtom } from "jotai";
import { useSetAtom } from "jotai/ts3.8/esm/react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, selectedGameAtom } from "./game-atom.js";

const statusAtom = atom<"editing" | "completed">("completed");

/**
 * Hook definition to list game
 */
export type UseGameDetail = () => {
  loading: boolean;

  /**
   * current selected game.
   */
  game?: GameDto;

  /**
   * edit current selected game.
   *
   * @param name Name of the game to edit.
   * @param points Points of the game to edit.
   */
  edit: (name: string, points: string) => void;

  /**
   * Delete current selected game.
   */
  delete: () => void;
};

/**
 * Create hook implementation of `UseListGame`
 */
export const useGameDetail = function useGameDetail({
  gameRepository,
  useLoginUser,
  editGameUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  editGameUseCase: EditGameUseCase;
}): UseGameDetail {
  return () => {
    const [status, setStatus] = useAtom(statusAtom);
    const { userId } = useLoginUser();
    const [game, setGame] = useAtom(selectedGameAtom);
    const setGames = useSetAtom(gamesAtom);

    return {
      loading: status == "editing",
      game: game ? toGameDto(game) : undefined,

      edit: (name: string, points: string): void => {
        if (!game || !userId) {
          return;
        }

        const input: EditGameUseCaseInput = {
          gameId: game.id,
          name,
          points: points.split(",").map((v) => parseInt(v)),
          ownedBy: userId,
        };

        async function _do() {
          try {
            const ret = await editGameUseCase(input);

            switch (ret.kind) {
              case "success":
                setGame(ret.game);
                setGames(await gameRepository.listUserCreated(User.createId(userId)));
                break;
              default:
                break;
            }
          } catch (err) {
            console.error(err);
          } finally {
            setStatus("completed");
          }
        }

        setStatus("editing");
        _do();
      },

      delete: () => {
        throw new Error("Not implemented");
      },
    };
  };
};
