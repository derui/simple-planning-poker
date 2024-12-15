import { User, VoterType, Voting } from "@spp/shared-domain";
import { type VotingRepository as I } from "@spp/shared-domain/voting-repository";
import { child, get, ref, update } from "firebase/database";
import { getDatabase } from "./database.js";
import { serialize, Serialized } from "./user-estimation-converter.js";
import { deserializeFrom } from "./voting-database-deserializer.js";
import * as resolver from "./voting-ref-resolver.js";

/**
 * Implementation of `VotingRepository`
 */
export const VotingRepository: I = {
  save: async ({ voting }) => {
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
    updates[resolver.voters(voting.id)] = voters.reduce<Record<User.Id, VoterType.T>>((accum, voter) => {
      accum[voter.user] = voter.type;
      return accum;
    }, {});

    if (!voting.theme || voting.theme == "") {
      updates[resolver.theme(voting.id)] = null;
    } else {
      updates[resolver.theme(voting.id)] = voting.theme;
    }

    await update(ref(getDatabase()), updates);
  },

  findBy: async ({ id }) => {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(getDatabase(), "voting"), id));

    return deserializeFrom(id, snapshot);
  },
};
