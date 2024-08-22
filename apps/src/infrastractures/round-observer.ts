import { Database, ref, onValue, Unsubscribe, DataSnapshot } from "firebase/database";
import { deserializeFrom } from "./round-database-deserializer";
import { RoundObserver } from "./observer";
import { T, Id } from "@/domains/round";

export class RoundObserverImpl implements RoundObserver {
  private _unsubscriber: Unsubscribe | null = null;
  private _subscribingRoundId: Id | null = null;
  constructor(private database: Database) {}

  subscribe(roundId: Id, subscriber: (round: T) => void): void {
    this.unsubscribe();

    this._subscribingRoundId = roundId;
    const _subscriber = (snapshot: DataSnapshot) => {
      const round = deserializeFrom(roundId, snapshot);
      if (!round) {
        return;
      }

      subscriber(round);
    };

    this._unsubscriber = onValue(ref(this.database, `rounds/${roundId}`), _subscriber);
  }

  unsubscribe(): void {
    if (this._unsubscriber && this._subscribingRoundId) {
      this._unsubscriber();
      this._unsubscriber = null;
      this._subscribingRoundId = null;
    }
  }
}
