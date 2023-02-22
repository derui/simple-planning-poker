import { Id } from "@/domains/user";

export interface UserViewModel {
  id: string;
  name: string;
}

export interface UserJoinedGameViewModel {
  id: string;
  name: string;
  playerId: string;
}

export type CurrentUserViewModel = {
  id: Id | null;
  name: string;
  joinedGames: UserJoinedGameViewModel[];
};
