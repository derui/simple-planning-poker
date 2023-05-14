import { Id } from "@/domains/round";
import * as Game from "@/domains/game";

export const averagePoint = function averagePoint(gameId: Game.Id, id: Id) {
  return `/roundHistories/${gameId}/${id}/averagePoint`;
};

export const finishedAt = function finishedAt(gameId: Game.Id, id: Id) {
  return `/roundHistories/${gameId}/${id}/finishedAt`;
};

export const theme = function theme(gameId: Game.Id, id: Id) {
  return `/roundHistories/${gameId}/${id}/theme`;
};
