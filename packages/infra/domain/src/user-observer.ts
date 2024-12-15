import { Game, User } from "@spp/shared-domain";
import { onValue, ref, type Unsubscribe } from "firebase/database";
import { getDatabase } from "./database.js";
import { GameRepository } from "./game-repository.js";
import { UserObserver } from "./observer.js";
import { UserRepository } from "./user-repository.js";

export class UserObserverImpl implements UserObserver {
  private _subscriptions = new Map<User.Id, Unsubscribe>();

  constructor() {}
  unsubscribe(): void {
    this._subscriptions.forEach((f) => f());
    this._subscriptions = new Map();
  }

  subscribe(userId: User.Id, subscriber: (user: User.T, joinedGames: Game.T[]) => void): void {
    const oldSubscription = this._subscriptions.get(userId);
    if (oldSubscription) {
      oldSubscription();
    }

    const callback = async () => {
      const user = await UserRepository.findBy({ id: userId });
      if (!user) {
        return;
      }

      subscriber(user, await GameRepository.listUserCreated({ user: user.id }));
    };

    const key = `users/${userId}`;
    const unsubscribe = onValue(ref(getDatabase(), key), callback);

    this._subscriptions.set(userId, unsubscribe);
  }
}
