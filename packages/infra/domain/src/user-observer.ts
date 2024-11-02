import { Game, GameRepository, User, UserRepository } from "@spp/shared-domain";
import { Database, onValue, ref, type Unsubscribe } from "firebase/database";
import { UserObserver } from "./observer.js";

export class UserObserverImpl implements UserObserver {
  private _subscriptions = new Map<User.Id, Unsubscribe>();

  constructor(
    private database: Database,
    private userRepository: UserRepository.T,
    private gameRepository: GameRepository.T
  ) {}
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
      const user = await this.userRepository.findBy(userId);
      if (!user) {
        return;
      }

      subscriber(user, await this.gameRepository.listUserCreated(user.id));
    };

    const key = `users/${userId}`;
    const unsubscribe = onValue(ref(this.database, key), callback);

    this._subscriptions.set(userId, unsubscribe);
  }
}
