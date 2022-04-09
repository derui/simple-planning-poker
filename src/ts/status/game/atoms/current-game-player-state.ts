import { atom } from "recoil";
import { GamePlayerId, UserMode } from "@/domains/game-player";
import { UserId } from "@/domains/user";
import { Card } from "@/domains/card";
import AtomKeys from "./key";

interface GamePlayerViewModel {
  id: GamePlayerId;
  userId: UserId;
  name: string;
  mode: UserMode;
  hand?: Card;
}

const currentGamePlayerState = atom<GamePlayerViewModel | undefined>({
  key: AtomKeys.currentGamePlayerState,
  default: undefined,
});

export default currentGamePlayerState;
