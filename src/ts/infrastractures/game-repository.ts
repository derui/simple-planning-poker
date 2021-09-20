import { createGame, Game, GameId, PlayerHand } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { createStoryPoint } from "@/domains/story-point";
import { createSelectableCards } from "@/domains/selectable-cards";
import { child, Database, get, ref, update } from "firebase/database";
import { createGamePlayerId } from "@/domains/game-player";
import { deserializeCard, SerializedCard } from "./card-converter";
import { InvitationSignature } from "@/domains/invitation";
import { createGameRefResolver } from "./game-ref-resolver";

export class GameRepositoryImpl implements GameRepository {
  private resolver = createGameRefResolver();
  constructor(private database: Database) {}

  async save(game: Game): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[this.resolver.name(game.id)] = game.name;
    updates[this.resolver.showedDown(game.id)] = game.showedDown;
    updates[this.resolver.cards(game.id)] = game.cards.cards
      .filter((v) => v.kind === "storypoint")
      .map((v) => (v.kind === "storypoint" ? v.storyPoint.value : null));

    const invitation = game.makeInvitation();
    updates[`/invitations/${invitation.signature}`] = game.id;

    await update(ref(this.database), updates);
  }

  async findByInvitationSignature(signature: InvitationSignature): Promise<Game | undefined> {
    if (signature === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "invitations"), signature));

    const gameId = snapshot.val() as GameId | undefined;
    if (!gameId) {
      return undefined;
    }

    return this.findBy(gameId);
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

    const name = val.name as string;
    const cards = val.cards as number[];
    const players = val.users as { [key: string]: any } | undefined;
    const showedDown = val.showedDown as boolean;
    const hands = val.userHands as { [k: string]: SerializedCard | undefined } | undefined;

    const selectableCards = createSelectableCards(cards.map(createStoryPoint));
    const game = createGame({
      id,
      name,
      players: Object.keys(players || {}).map((v) => createGamePlayerId(v)),
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
