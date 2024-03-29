import { child, Database, get, ref, update } from "firebase/database";
import { serialize, Serialized } from "./user-estimation-converter";
import * as resolver from "./round-ref-resolver";
import { deserializeFrom } from "./round-database-deserializer";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import { RoundRepository } from "@/domains/round-repository";

/**
 * Implementation of `RoundRepository`
 */
export class RoundRepositoryImpl implements RoundRepository {
  constructor(private database: Database) {}

  async save(round: Round.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.finished(round.id)] = Round.isFinishedRound(round);
    updates[resolver.userEstimations(round.id)] = Object.entries(round.estimations).reduce<Record<User.Id, Serialized>>(
      (accum, [key, value]) => {
        accum[key as User.Id] = serialize(value);

        return accum;
      },
      {}
    );
    updates[resolver.cards(round.id)] = round.cards;

    if (round.theme !== undefined) {
      updates[resolver.theme(round.id)] = round.theme;
    } else {
      updates[resolver.theme(round.id)] = null;
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

  async findFinishedRoundBy(id: Round.Id): Promise<Round.FinishedRound | null> {
    if (id === "") {
      return null;
    }
    const snapshot = await get(child(ref(this.database, "rounds"), id));

    const ret = deserializeFrom(id, snapshot);

    if (!ret || !Round.isFinishedRound(ret)) {
      return null;
    }

    return ret;
  }
}
