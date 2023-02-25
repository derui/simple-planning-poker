import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import * as StoryPoint from "@/domains/story-point";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import * as SelectableCards from "@/domains/selectable-cards";
import * as Invitation from "@/domains/invitation";
import { child, Database, get, ref, update } from "firebase/database";
import * as resolver from "./game-ref-resolver";
import { RoundRepository } from "@/domains/round-repository";

export class GameRepositoryImpl implements GameRepository {
  constructor(private database: Database, private roundRepository: RoundRepository) {}

  async save(game: Game.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.name(game.id)] = game.name;
    updates[resolver.cards(game.id)] = game.cards;
    updates[resolver.round(game.id)] = game.round.id;
    updates[resolver.finishedRounds(game.id)] = game.finishedRounds;
    updates[resolver.users(game.id)] = Object.fromEntries(
      game.joinedPlayers.map((v) => [v.user, { mode: v.mode, gameOwner: v.user === game.owner }])
    );

    const invitation = Game.makeInvitation(game);
    updates[`/invitations/${invitation}`] = game.id;

    await update(ref(this.database), updates);

    await this.roundRepository.save(game.round);
  }

  async findByInvitation(signature: Invitation.T): Promise<Game.T | undefined> {
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
    const users = val.users as { [key: string]: any } | undefined;
    const roundId = val.round as Round.Id;
    const finishedRounds = (val.finishedRounds ?? []) as Round.Id[];
    const serializeJoinedPlayers = Object.entries(users || {}).map(([key, v]) => ({
      user: User.createId(key),
      mode: v.mode,
    }));
    const owner = Object.entries(users || {}).find(([, v]) => v.gameOwner);

    if (!owner) {
      return undefined;
    }

    const round = await this.roundRepository.findBy(roundId);
    if (!round) {
      return undefined;
    }

    const selectableCards = SelectableCards.create(cards.map(StoryPoint.create));
    const [game] = Game.create({
      id,
      name,
      joinedPlayers: serializeJoinedPlayers,
      owner: User.createId(owner[0]),
      cards: selectableCards,
      round,
      finishedRounds,
    });

    return game;
  }
}
