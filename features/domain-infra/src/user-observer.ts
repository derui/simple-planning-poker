import { Database, onValue, ref, type Unsubscribe } from "firebase/database";
import { UserObserver } from "./observer";
import { T, Id } from "@/domains/user";
import * as Game from "@/domains/game";
import { UserRepository } from "@/domains/user-repository";
import { GameRepository, JoinedGameState } from "@/domains/game-repository";

export class UserObserverImpl implements UserObserver {
  private _subscriptions = new Map<Id, Unsubscribe>();

  constructor(
    private database: Database,
    private userRepository: UserRepository,
    private gameRepository: GameRepository
  ) {}
  unsubscribe(): void {
    this._subscriptions.forEach((f) => f());
    this._subscriptions = new Map();
  }

  subscribe(userId: Id, subscriber: (user: T, joinedGames: { id: Game.Id; state: JoinedGameState }[]) => void) {
    const oldSubscription = this._subscriptions.get(userId);
    if (oldSubscription) {
      oldSubscription();
    }

    const callback = async () => {
      const user = await this.userRepository.findBy(userId);
      if (!user) {
        return;
      }

      subscriber(user, await this.gameRepository.listUserJoined(user.id));
    };

    const key = `users/${userId}`;
    const unsubscribe = onValue(ref(this.database, key), callback);

    this._subscriptions.set(userId, unsubscribe);
  }
}
