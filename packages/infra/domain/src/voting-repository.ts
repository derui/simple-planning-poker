import { child, Database, get, ref, update } from "firebase/database";
import { serialize, Serialized } from "./user-estimation-converter.js";
import * as resolver from "./voting-ref-resolver.js";
import { deserializeFrom } from "./voting-database-deserializer.js";
import { User, Voter, Voting, VotingRepository } from "@spp/shared-domain";

/**
 * Implementation of `VotingRepository`
 */
export class VotingRepositoryImpl implements VotingRepository.T {
  constructor(private database: Database) {}

  async save(voting: Voting.T): Promise<void> {
    const updates: Record<string, unknown> = {};
    updates[resolver.revealed(voting.id)] = voting.status == Voting.VotingStatus.Revealed;
    updates[resolver.estimations(voting.id)] = Array.from(voting.estimations.userEstimations.entries()).reduce<
      Record<User.Id, Serialized>
    >((accum, [key, value]) => {
      accum[key] = serialize(value);

      return accum;
    }, {});
    updates[resolver.points(voting.id)] = voting.points;

    const voters = voting.participatedVoters;
    updates[resolver.voters(voting.id)] = voters.reduce<Record<User.Id, Voter.VoterType>>((accum, voter) => {
      accum[voter.user] = voter.type;
      return accum;
    }, {});

    if (!voting.theme || voting.theme == "") {
      updates[resolver.theme(voting.id)] = null;
    } else {
      updates[resolver.theme(voting.id)] = voting.theme;
    }

    await update(ref(this.database), updates);
  }

  async findBy(id: Voting.Id): Promise<Voting.T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "voting"), id));

    return deserializeFrom(id, snapshot);
  }
}
