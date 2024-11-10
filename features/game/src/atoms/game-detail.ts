import { UseLoginUser } from "@spp/feature-login";
import { Game, GameRepository, User } from "@spp/shared-domain";
import { DeleteGameUseCase, EditGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useSetAtom } from "jotai";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, selectedGameAtom } from "./game-atom.js";

const statusAtom = atom<"deleting" | "editing" | "completed">("completed");

/**
 * Hook definition to list game
 */
export type UseGameDetail = () => {
  status: "deleting" | "editing" | "completed";

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
export const createUseGameDetail = function createUseGameDetail({
  gameRepository,
  useLoginUser,
  editGameUseCase,
  deleteGameUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  editGameUseCase: EditGameUseCase;
  deleteGameUseCase: DeleteGameUseCase;
}): UseGameDetail {
  return () => {
    const [status, setStatus] = useAtom(statusAtom);
    const { userId } = useLoginUser();
    const [game, setGame] = useAtom(selectedGameAtom);
    const setGames = useSetAtom(gamesAtom);

    return {
      status,
      game: game ? toGameDto(game) : undefined,

      edit: (name: string, points: string): void => {
        if (!game || !userId || status != "completed") {
          return;
        }

        const _do = async () => {
          try {
            const ret = await editGameUseCase({
              gameId: game.id,
              name,
              points: points.split(",").map((v) => parseInt(v)),
              ownedBy: userId,
            });

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
        };

        setStatus("editing");
        _do();
      },

      delete: () => {
        if (!game || !userId || status != "completed") {
          return;
        }

        const _do = async () => {
          try {
            const ret = await deleteGameUseCase({ gameId: Game.createId(game.id), ownedBy: User.createId(userId) });

            if (ret.kind == "success") {
              setGame(undefined);
              setGames(await gameRepository.listUserCreated(User.createId(userId)));
            }
          } catch (err) {
            console.error(err);
          } finally {
            setStatus("completed");
          }
        };

        setStatus("deleting");
        _do();
      },
    };
  };
};
