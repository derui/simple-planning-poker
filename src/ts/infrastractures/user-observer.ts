import firebase from "firebase";
import { User, UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { UserObserver } from "@/contexts/observer";

export class UserObserverImpl implements UserObserver {
  constructor(private database: firebase.database.Database, private userRepository: UserRepository) {}

  subscribe(userId: UserId, subscriber: (user: User) => void): () => void {
    const callback = async () => {
      const user = await this.userRepository.findBy(userId);
      if (!user) {
        return;
      }

      subscriber(user);
    };

    const key = `users/${userId}`;
    this.database.ref(key).on("value", callback);

    return () => {
      this.database.ref(key).off("value", callback);
    };
  }
}
