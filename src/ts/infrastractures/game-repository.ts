import firebase from "firebase";
import { createGame, Game, GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { createStoryPoint } from "@/domains/story-point";
import { UserId } from "@/domains/user";
import { deserializeCard, serializeCard, SerializedCard } from "./card-converter";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createGameJoinedUser, GameJoinedUser, UserMode } from "@/domains/game-joined-user";

export class GameRepositoryImpl implements GameRepository {
  constructor(private database: firebase.database.Database) {}

  save(game: Game): void {
    const updates: { [key: string]: any } = {};
    updates[`/games/${game.id}/name`] = game.name;
    updates[`/games/${game.id}/showedDown`] = game.showedDown;
    updates[`/games/${game.id}/cards`] = game.selectableCards.cards
      .filter((v) => v.kind === "storypoint")
      .map((v) => (v.kind === "storypoint" ? v.storyPoint.value : null));

    game.joinedUsers.forEach((user) => {
      updates[`/games/${game.id}/users/${user}/name`] = user.name;
      updates[`/games/${game.id}/users/${user}/mode`] = user.mode;
    });

    game.userHands.forEach((hand) => {
      updates[`/games/${game.id}/userHands/${hand.userId}`] = serializeCard(hand.card);
    });
    if (!game.userHands.length) {
      updates[`/games/${game.id}/userHands`] = null;
    }

    this.database.ref().update(updates);
  }

  async findBy(id: GameId): Promise<Game | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await this.database.ref("games").child(id).once("value");

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }

    const name = val["name"] as string;
    const cards = val["cards"] as number[];
    const joinedUsers = val["users"] as { [key: string]: any };
    const showedDown = val["showedDown"] as boolean;
    const userHands = (val["userHands"] || {}) as { [key: string]: SerializedCard };

    const game = createGame(
      id,
      name,
      Object.keys(joinedUsers).reduce((accum, userId) => {
        const { name, mode } = joinedUsers[userId] as { name: string; mode: UserMode };

        accum.push(createGameJoinedUser(userId as UserId, name, mode));
        return accum;
      }, [] as GameJoinedUser[]),
      createSelectableCards(cards.map(createStoryPoint))
    );

    Object.keys(userHands).forEach((key) => {
      const card = userHands[key]!!;

      game.acceptHandBy(key as UserId, deserializeCard(card));
    });

    if (showedDown) {
      game.showDown();
    }

    return game;
  }
}
