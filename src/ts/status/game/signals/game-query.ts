import { GameViewModel } from "../types";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { UserRepository } from "@/domains/user-repository";
import { Game } from "@/domains/game";
import { User } from "@/domains/user";
import { GameObserver } from "@/contexts/observer";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import { createEffect } from "solid-js";
import { currentGameIdState } from "./current-game-id-state";
import { createStore, produce } from "solid-js/store";

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

const [gameStore, setGameStore] = createStore<{ viewModel?: GameViewModel; state: "loading" | "value" }>({
  state: "loading",
});

createEffect(() => {
  const gameId = currentGameIdState();
  if (!gameId) {
    return;
  }

  gameObserver!!.unsubscribe();

  gameObserver!!.subscribe(gameId, async (game) => {
    setGameStore(
      produce((s) => {
        s.state = "loading";
      })
    );

    const viewModel = await gameToViewModel(game);

    setGameStore({
      viewModel,
      state: "value",
    });
  });
});

const initializeGameQuery = (registrar: ApplicationDependencyRegistrar) => {
  gamePlayerRepository = registrar.resolve("gamePlayerRepository");
  userRepository = registrar.resolve("userRepository");
  gameObserver = registrar.resolve("gameObserver");
};

export { gameStore, initializeGameQuery };
