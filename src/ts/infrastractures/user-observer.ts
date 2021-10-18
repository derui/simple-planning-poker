import { User, UserId } from "~/src/ts/domains/user";
import { UserRepository } from "~/src/ts/domains/user-repository";
import { UserObserver } from "~/src/ts/contexts/observer";
import { Database, onValue, ref } from "firebase/database";

export class UserObserverImpl implements UserObserver {
  constructor(private database: Database, private userRepository: UserRepository) {}

  subscribe(userId: UserId, subscriber: (user: User) => void): () => void {
    const callback = async () => {
      const user = await this.userRepository.findBy(userId);
      if (!user) {
        return;
      }

      subscriber(user);
    };

    const key = `users/${userId}`;
    const unsubscribe = onValue(ref(this.database, key), callback);

    return unsubscribe;
  }
}
