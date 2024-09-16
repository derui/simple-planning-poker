import { Database, ref, onValue, Unsubscribe, DataSnapshot } from "firebase/database";
import { deserializeFrom } from "./voting-database-deserializer.js";
import { VotingObserver } from "./observer.js";
import { Voting } from "@spp/shared-domain";

/**
 * Implementation of `VotingObserver`
 */
export class VotingObserverImpl implements VotingObserver {
  private _unsubscriber: Unsubscribe | null = null;
  private _subscribingVotingId: Voting.Id | null = null;

  constructor(private database: Database) {}

  subscribe(votingId: Voting.Id, subscriber: (voting: Voting.T) => void): void {
    this.unsubscribe();

    this._subscribingVotingId = votingId;
    const _subscriber = (snapshot: DataSnapshot) => {
      const voting = deserializeFrom(votingId, snapshot);
      if (!voting) {
        return;
      }

      subscriber(voting);
    };

    this._unsubscriber = onValue(ref(this.database, `voting/${votingId}`), _subscriber);
  }

  unsubscribe(): void {
    if (this._unsubscriber && this._subscribingVotingId) {
      this._unsubscriber();
      this._unsubscriber = null;
      this._subscribingVotingId = null;
    }
  }
}
