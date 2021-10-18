import { useRecoilCallback, useRecoilValue } from "recoil";
import { Game, GameId } from "~/src/ts/domains/game";
import { GameRepository } from "~/src/ts/domains/game-repository";
import { HandCardUseCase } from "~/src/ts/usecases/hand-card";
import { ShowDownUseCase } from "~/src/ts/usecases/show-down";
import { NewGameUseCase } from "~/src/ts/usecases/new-game";
import { currentUserState } from "./signin-atom";
import { JoinUserUseCase } from "~/src/ts/usecases/join-user";
import { ChangeUserModeUseCase } from "~/src/ts/usecases/change-user-mode";
import { UserMode } from "~/src/ts/domains/game-player";
import { GamePlayerRepository } from "~/src/ts/domains/game-player-repository";
import { GameViewModel, setUpAtomsInGame } from "./in-game-atom";
import { UserRepository } from "~/src/ts/domains/user-repository";
import { User } from "~/src/ts/domains/user";
import { InvitationSignature } from "~/src/ts/domains/invitation";
import { gamePlayerToViewModel } from "./dxo";
import { LeaveGameUseCase } from "~/src/ts/usecases/leave-game";

export type InGameStatus = "EmptyUserHand" | "CanShowDown" | "ShowedDown";

export interface InGameAction {
  useSelectCard: () => (index: number) => void;
  useNewGame: () => () => void;
  useJoinUser: () => (signature: InvitationSignature, callback: (gameId: GameId) => void) => void;
  useShowDown: () => () => void;
  useChangeMode: () => (mode: UserMode) => void;
  useSetCurrentGame: (gameId: GameId) => (game: Game) => void;
  useOpenGame: () => (gameId: GameId, errorCallback: () => void) => void;
  useLeaveGame: () => () => void;
}

const gameToViewModel = async (
  game: Game,
  gamePlayerRepository: GamePlayerRepository,
  userRepository: UserRepository
): Promise<GameViewModel> => {
  const hands = await Promise.all(
    game.players.map(async (v) => {
      const player = await gamePlayerRepository.findBy(v);
      let user: User | undefined;
      if (player) {
        user = await userRepository.findBy(player.user);
      }

      return [player, user] as const;
    })
  );

  return {
    id: game.id,
    name: game.name,
    average: game.calculateAverage()?.value,
    hands: hands
      .filter(([p, u]) => p && u)
      .map(([player, user]) => {
        return {
          name: user!.name,
          gamePlayerId: player!.id,
          mode: player!.mode,
          card: player!.hand,
          selected: !!player!.hand,
        };
      }),
    cards: game.cards.cards,
    showedDown: game.showedDown,
    invitationSignature: game.makeInvitation().signature,
  };
};

export const createInGameAction = ({
  gameRepository,
  gamePlayerRepository,
  userRepository,
  handCardUseCase,
  showDownUseCase,
  newGameUseCase,
  changeUserModeUseCase,
  joinUserUseCase,
  leaveGameUseCase,
}: {
  gameRepository: GameRepository;
  gamePlayerRepository: GamePlayerRepository;
  userRepository: UserRepository;
  handCardUseCase: HandCardUseCase;
  showDownUseCase: ShowDownUseCase;
  newGameUseCase: NewGameUseCase;
  changeUserModeUseCase: ChangeUserModeUseCase;
  joinUserUseCase: JoinUserUseCase;
  leaveGameUseCase: LeaveGameUseCase;
}): InGameAction => {
  const { gameStateQuery, currentGameState, gamePlayerQuery, currentGamePlayer } = setUpAtomsInGame();

  return {
    useLeaveGame: () => {
      const currentPlayer = useRecoilValue(gamePlayerQuery);
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async () => {
        if (!currentPlayer || !currentGame) {
          return;
        }
        const user = await userRepository.findBy(currentPlayer.userId);
        if (!user) {
          return;
        }

        await leaveGameUseCase.execute({
          gameId: currentGame.id,
          userId: user.id,
        });

        set(currentUserState, (prev) => {
          return { ...prev, joinedGames: prev.joinedGames.filter((v) => v.id !== currentGame.id) };
        });
        set(currentGamePlayer, () => undefined);
        set(currentGameState, () => undefined);
      });
    },
    useSelectCard: () => {
      const currentPlayer = useRecoilValue(gamePlayerQuery);
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async (index: number) => {
        if (!currentPlayer || !currentGame) {
          return;
        }
        const card = currentGame.cards[index];

        await handCardUseCase.execute({
          playerId: currentPlayer.id,
          card,
        });

        const game = await gameRepository.findBy(currentGame.id);
        const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
        set(currentGameState, (prev) => {
          return state || prev;
        });
      });
    },

    useNewGame: () => {
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async () => {
        if (!currentGame) {
          return;
        }

        await newGameUseCase.execute({
          gameId: currentGame.id,
        });

        const game = await gameRepository.findBy(currentGame.id);
        const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
        set(currentGameState, (prev) => {
          return state || prev;
        });
      });
    },

    useJoinUser: () => {
      const currentUser = useRecoilValue(currentUserState);

      return useRecoilCallback(({ set }) => async (signature: InvitationSignature, callback: (id: GameId) => void) => {
        if (!currentUser.id) {
          return;
        }

        const ret = await joinUserUseCase.execute({
          userId: currentUser.id,
          signature,
        });

        if (ret.kind === "success") {
          const gamePlayer = await gamePlayerRepository.findBy(ret.gamePlayerId);
          set(currentGamePlayer, (prev) => {
            return gamePlayer ? gamePlayerToViewModel(gamePlayer) : undefined || prev;
          });

          if (!gamePlayer) {
            return;
          }

          const game = await gameRepository.findBy(gamePlayer.game);
          const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
          set(currentGameState, (prev) => {
            return state || prev;
          });

          if (game) {
            callback(game.id);
          }
        }
      });
    },

    useOpenGame: () => {
      const currentUser = useRecoilValue(currentUserState);

      return useRecoilCallback(({ set }) => async (gameId: GameId, error: () => void) => {
        if (!currentUser.id) {
          error();
          return;
        }

        const user = await userRepository.findBy(currentUser.id);
        const joinedGame = user?.joinedGames?.find((v) => v.gameId === gameId) ?? undefined;
        if (!joinedGame) {
          error();
          return;
        }

        const gamePlayer = await gamePlayerRepository.findBy(joinedGame.playerId);
        set(currentGamePlayer, (prev) => {
          return gamePlayer ? gamePlayerToViewModel(gamePlayer) : undefined || prev;
        });

        if (!gamePlayer) {
          return;
        }

        const game = await gameRepository.findBy(gamePlayer.game);
        const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
        set(currentGameState, (prev) => {
          return state || prev;
        });
      });
    },

    useChangeMode: () => {
      const currentPlayer = useRecoilValue(gamePlayerQuery);
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async (mode: UserMode) => {
        if (!currentGame || !currentPlayer) {
          return;
        }

        await changeUserModeUseCase.execute({
          gamePlayerId: currentPlayer.id,
          mode,
        });

        const game = await gameRepository.findBy(currentGame.id);
        const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
        set(currentGameState, (prev) => {
          return state || prev;
        });
      });
    },

    useShowDown: () => {
      const currentGame = useRecoilValue(gameStateQuery);

      return useRecoilCallback(({ set }) => async () => {
        if (!currentGame) {
          return;
        }

        await showDownUseCase.execute({
          gameId: currentGame.id,
        });

        const game = await gameRepository.findBy(currentGame.id);
        const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
        set(currentGameState, (prev) => {
          return state || prev;
        });
      });
    },

    useSetCurrentGame: (gameId: GameId) =>
      useRecoilCallback(
        ({ set }) =>
          async (game: Game) => {
            const state = game ? await gameToViewModel(game, gamePlayerRepository, userRepository) : undefined;
            set(currentGameState, () => {
              return state;
            });
          },
        [gameId]
      ),
  };
};
