import { GameViewModel } from "../types";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { UserRepository } from "@/domains/user-repository";
import { Game } from "@/domains/game";
import { User } from "@/domains/user";
import { GameRepository } from "@/domains/game-repository";
import { GameObserver } from "@/contexts/observer";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import { createEffect, createResource } from "solid-js";
import { currentGameIdState } from "./current-game-id-state";

let gameRepository: GameRepository | null = null;
let gamePlayerRepository: GamePlayerRepository | null = null;
let userRepository: UserRepository | null = null;
let gameObserver: GameObserver | null = null;

const gameToViewModel = async (game: Game): Promise<GameViewModel> => {
  const hands = await Promise.all(
    game.players.map(async (v) => {
      const player = await gamePlayerRepository!!.findBy(v);
      let user: User | undefined;
      if (player) {
        user = await userRepository!!.findBy(player.user);
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

const [gameQuery, { mutate: mutateGame }] = createResource(currentGameIdState, async (gameId) => {
  const game = await gameRepository!!.findBy(gameId);
  if (!game) {
    return;
  }

  return gameToViewModel(game);
});

createEffect(() => {
  const gameId = currentGameIdState();
  if (!gameId) {
    return;
  }

  gameObserver!!.unsubscribe();

  gameObserver!!.subscribe(gameId, async (game) => {
    const gameModel = await gameToViewModel(game);

    mutateGame(gameModel);
  });
});

const initializeGameQuery = (registrar: ApplicationDependencyRegistrar) => {
  gameRepository = registrar.resolve("gameRepository");
  gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  userRepository = registrar.resolve("userRepository");
  gameObserver = registrar.resolve("gameObserver");
};

export { gameQuery, initializeGameQuery };
