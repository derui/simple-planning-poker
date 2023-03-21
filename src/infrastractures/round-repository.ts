import { child, Database, get, ref, update } from "firebase/database";
import { serialize, Serialized } from "./user-estimation-converter";
import * as resolver from "./round-ref-resolver";
import { deserializeFrom } from "./round-database-deserializer";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import { RoundRepository } from "@/domains/round-repository";
import { PlayerType, UserMode } from "@/domains/game-player";

/**
 * Implementation of `RoundRepository`
 */
export class RoundRepositoryImpl implements RoundRepository {
  constructor(private database: Database) {}

  async save(round: Round.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.count(round.id)] = round.count;
    updates[resolver.finished(round.id)] = Round.isFinishedRound(round);
    updates[resolver.userHands(round.id)] = Object.entries(round.hands).reduce<Record<User.Id, Serialized>>(
      (accum, [key, value]) => {
        accum[key as User.Id] = serialize(value);

        return accum;
      },
      {}
    );
    updates[resolver.joinedPlayers(round.id)] = round.joinedPlayers.reduce<
      Record<User.Id, { mode: UserMode; type: PlayerType }>
    >((accum, obj) => {
      accum[obj.user] = { mode: obj.mode, type: obj.type };

      return accum;
    }, {});

    if (Round.isRound(round)) {
      updates[resolver.cards(round.id)] = round.cards;
    }

    if (Round.isFinishedRound(round)) {
      updates[resolver.finishedAt(round.id)] = round.finishedAt;
    }

    await update(ref(this.database), updates);
  }

  async findBy(id: Round.Id): Promise<Round.T | null> {
    if (id === "") {
      return null;
    }
    const snapshot = await get(child(ref(this.database, "rounds"), id));

    return deserializeFrom(id, snapshot);
  }
}
