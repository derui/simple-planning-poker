import { child, Database, get, ref, update } from "firebase/database";
import { serialize, Serialized } from "./user-estimation-converter.js";
import * as resolver from "./voting-ref-resolver.js";
import { deserializeFrom } from "./voting-database-deserializer.js";
import { User, Voting, VotingRepository } from "@spp/shared-domain";

/**
 * Implementation of `RoundRepository`
 */
export class VotingRepositoryImpl implements VotingRepository.T {
  constructor(private database: Database) {}

  async save(voting: Voting.T): Promise<void> {
    const updates: Record<string, unknown> = {};
    updates[resolver.revealed(voting.id)] = voting.status == Voting.VotingStatus.Revealed;
    updates[resolver.userEstimations(voting.id)] = Array.from(voting.estimations.userEstimations.entries()).reduce<
      Record<User.Id, Serialized>
    >((accum, [key, value]) => {
      accum[key] = serialize(value);

      return accum;
    }, {});
    updates[resolver.points(voting.id)] = voting.points;

    if (voting.theme !== undefined) {
      updates[resolver.theme(voting.id)] = voting.theme;
    } else {
      updates[resolver.theme(voting.id)] = null;
    }

    await update(ref(this.database), updates);
  }

  async findBy(id: Voting.Id): Promise<Voting.T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "rounds"), id));

    return deserializeFrom(id, snapshot);
  }
}
