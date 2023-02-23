import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import * as StoryPoint from "@/domains/story-point";
import * as SelectableCards from "@/domains/selectable-cards";
import { child, Database, get, ref, update } from "firebase/database";
import { createId } from "@/domains/game-player";
import { deserialize, Serialized } from "./user-hand-converter";
import { InvitationSignature } from "@/domains/invitation";
import { createGameRefResolver } from "./game-ref-resolver";

export class GameRepositoryImpl implements GameRepository {
  private resolver = createGameRefResolver();

  constructor(private database: Database) {}

  async save(game: Game.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[this.resolver.name(game.id)] = game.name;
    updates[this.resolver.showedDown(game.id)] = game.showedDown;
    updates[this.resolver.cards(game.id)] = game.cards;

    const invitation = Game.makeInvitation(game);
    updates[`/invitations/${invitation.signature}`] = game.id;

    await update(ref(this.database), updates);
  }

  async findByInvitationSignature(signature: InvitationSignature): Promise<Game.T | undefined> {
    if (signature === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "invitations"), signature));

    const gameId = snapshot.val() as Game.Id | undefined;
    if (!gameId) {
      return undefined;
    }

    return this.findBy(gameId);
  }

  async findBy(id: Game.Id): Promise<Game.T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "games"), id));

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }

    const name = val.name as string;
    const cards = val.cards as number[];
    const players = val.users as { [key: string]: any } | undefined;
    const showedDown = val.showedDown as boolean;
    const hands = val.userHands as { [k: string]: Serialized | undefined } | undefined;

    const selectableCards = SelectableCards.create(cards.map(StoryPoint.create));
    let game = Game.create({
      id,
      name,
      players: Object.keys(players || {}).map((v) => createId(v)),
      cards: selectableCards,
      hands: hands
        ? Object.entries(hands)
            .map(([k, hand]): Game.PlayerHand | null => {
              if (!hand) {
                return null;
              }
              return {
                playerId: createId(k),
                hand: deserialize(hand),
              };
            })
            .filter((v) => !!v)
            .map((v) => v!)
        : undefined,
    });

    if (showedDown) {
      [game] = Game.showDown(game);
    }

    return game;
  }
}
