import { GameId } from "@/domains/game";
import { GamePlayerId } from "@/domains/game-player";
import { createUser, JoinedGame, User, UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { Database, get, ref, update } from "firebase/database";

export class UserRepositoryImpl implements UserRepository {
  constructor(private database: Database) {}

  save(user: User): void {
    const databaseRef = ref(this.database);
    const updates: { [key: string]: any } = {};
    updates[`users/${user.id}/name`] = user.name;

    user.joinedGames.forEach(({ gameId, playerId }) => {
      updates[`games/${gameId}/users/${playerId}/name`] = user.name;
    });

    update(databaseRef, updates);
  }

  async findBy(id: UserId): Promise<User | undefined> {
    const snapshot = await get(ref(this.database, `users/${id}`));
    const val = snapshot.val();

    if (!val) {
      return undefined;
    }
    const name = val["name"] as string;
    const rawJoinedGames = (val.joinedGames as { [k: string]: { playerId: string } } | undefined) ?? {};
    const joinedGames: JoinedGame[] = Object.entries(rawJoinedGames).map(([gameId, gameInfo]) => {
      return { gameId: gameId as GameId, playerId: gameInfo.playerId as GamePlayerId };
    });

    return createUser({ id, name, joinedGames });
  }
}
