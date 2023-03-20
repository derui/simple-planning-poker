import { Database, onValue, ref, type Unsubscribe } from "firebase/database";
import { UserObserver } from "./observer";
import { T, Id } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";

export class UserObserverImpl implements UserObserver {
  private _subscriptions = new Map<Id, Unsubscribe>();

  constructor(private database: Database, private userRepository: UserRepository) {}
  unsubscribe(): void {
    this._subscriptions.forEach((f) => f());
  }

  subscribe(userId: Id, subscriber: (user: T) => void) {
    const oldSubscription = this._subscriptions.get(userId);
    if (oldSubscription) {
      oldSubscription();
    }

    const callback = async () => {
      const user = await this.userRepository.findBy(userId);
      if (!user) {
        return;
      }

      subscriber(user);
    };

    const key = `users/${userId}`;
    const unsubscribe = onValue(ref(this.database, key), callback);

    this._subscriptions.set(userId, unsubscribe);
  }
}
