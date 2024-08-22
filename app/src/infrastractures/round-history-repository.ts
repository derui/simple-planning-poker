import { Database, endBefore, get, limitToLast, orderByChild, query, ref, update } from "firebase/database";
import * as resolver from "./round-history-ref-resolver";
import { deserializeFrom } from "./round-history-database-deserializer";
import * as Round from "@/domains/round";
import * as Game from "@/domains/game";
import * as RoundHistory from "@/status/query-models/round-history";

export interface RoundHistoryRepository extends RoundHistory.Query {
  save(gameId: Game.Id, round: Round.FinishedRound): Promise<void>;
}

/**
 * Repository implementation for round history. This class can not use outside of infrastructure package.
 */
export class RoundHistoryRepositoryImpl implements RoundHistoryRepository {
  constructor(private database: Database) {}

  async save(gameId: Game.Id, round: Round.FinishedRound): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.theme(gameId, round.id)] = round.theme ?? null;
    updates[resolver.averagePoint(gameId, round.id)] = Round.calculateAverage(round);
    updates[resolver.finishedAt(gameId, round.id)] = round.finishedAt;

    await update(ref(this.database), updates);
  }

  async listBy(
    gameId: string,
    options: { count: number; lastKey?: string } = { count: 10 }
  ): Promise<{ result: RoundHistory.T[]; key: string }> {
    if (gameId === "") {
      return { result: [], key: "" };
    }

    let q = query(
      ref(this.database, `roundHistories/${gameId}/`),
      orderByChild("finishedAt"),
      limitToLast(options.count)
    );
    if (options.lastKey && options.lastKey !== "") {
      q = query(
        ref(this.database, `roundHistories/${gameId}/`),
        orderByChild("finishedAt"),
        endBefore(options.lastKey),
        limitToLast(options.count)
      );
    }
    const snapshots = await get(q);

    const accum: RoundHistory.T[] = [];
    snapshots.forEach((snapshot) => {
      const ret = deserializeFrom(snapshot);

      if (!ret) {
        return;
      }
      accum.push(ret);
    });

    let key = "";
    if (accum.length > 0) {
      key = accum[0].finishedAt;
    }
    accum.sort((v1, v2) => v2.finishedAt.localeCompare(v1.finishedAt));

    return { result: accum, key };
  }
}
