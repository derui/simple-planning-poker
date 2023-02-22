import { T, Id } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { UserObserver } from "@/contexts/observer";
import { Database, onValue, ref } from "firebase/database";

export class UserObserverImpl implements UserObserver {
  constructor(private database: Database, private userRepository: UserRepository) {}

  subscribe(userId: Id, subscriber: (user: T) => void): () => void {
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
