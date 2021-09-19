import { createGame, Game, GameId, PlayerHand } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { createStoryPoint } from "@/domains/story-point";
import { createSelectableCards } from "@/domains/selectable-cards";
import { child, Database, get, ref, update } from "firebase/database";
import { createGamePlayerId } from "@/domains/game-player";
import { deserializeCard, SerializedCard } from "./card-converter";

export class GameRepositoryImpl implements GameRepository {
  constructor(private database: Database) {}

  save(game: Game): void {
    const updates: { [key: string]: any } = {};
    updates[`/games/${game.id}/name`] = game.name;
    updates[`/games/${game.id}/showedDown`] = game.showedDown;
    updates[`/games/${game.id}/cards`] = game.cards.cards
      .filter((v) => v.kind === "storypoint")
      .map((v) => (v.kind === "storypoint" ? v.storyPoint.value : null));

    update(ref(this.database), updates);
  }

  async findBy(id: GameId): Promise<Game | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "games"), id));

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }

    const name = val["name"] as string;
    const cards = val["cards"] as number[];
    const players = val["users"] as { [key: string]: any };
    const showedDown = val["showedDown"] as boolean;
    const hands = val.userHands as { [k: string]: SerializedCard | undefined } | undefined;

    const selectableCards = createSelectableCards(cards.map(createStoryPoint));
    const game = createGame({
      id,
      name,
      players: Object.keys(players).map((v) => createGamePlayerId(v)),
      cards: selectableCards,
      hands: hands
        ? Object.entries(hands)
            .map(([k, card]): PlayerHand | null => {
              if (!card) {
                return null;
              }
              return {
                playerId: createGamePlayerId(k),
                card: deserializeCard(card),
              };
            })
            .filter((v) => !!v)
            .map((v) => v!)
        : undefined,
    });

    if (showedDown) {
      game.showDown();
    }

    return game;
  }
}
