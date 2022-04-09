import { atomFamily } from "recoil";
import AtomKeys from "./key";
import { GameViewModel } from "../types";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { UserRepository } from "@/domains/user-repository";
import { Game, GameId } from "@/domains/game";
import { User } from "@/domains/user";
import { GameRepository } from "@/domains/game-repository";
import { GameObserver } from "@/contexts/observer";

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

const gameState = atomFamily({
  key: AtomKeys.gameState,
  default: async (gameId: GameId) => {
    const game = await gameRepository!!.findBy(gameId);
    if (!game) {
      return;
    }

    return gameToViewModel(game);
  },

  effects: (gameId: GameId) => [
    ({ setSelf }) => {
      const unsubscribe = gameObserver!!.subscribe(gameId, async (game) => {
        const gameModel = await gameToViewModel(game);

        setSelf(gameModel);
      });

      return unsubscribe;
    },
  ],
});

export default gameState;
