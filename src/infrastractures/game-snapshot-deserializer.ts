import { DataSnapshot } from "firebase/database";
import * as Game from "@/domains/game";
import * as StoryPoint from "@/domains/story-point";
import * as SelectableCards from "@/domains/selectable-cards";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import { PlayerType, UserMode } from "@/domains/game-player";

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = async function deserializeFrom(
  id: Game.Id,
  snapshot: DataSnapshot
): Promise<Game.T | null> {
  const val = snapshot.val();
  if (!val) {
    return null;
  }

  const name = val.name as string;
  const cards = val.cards as number[];
  const roundId = val.round as Round.Id;
  const finishedRounds = (val.finishedRounds ?? []) as Round.Id[];
  const owner = val.owner as string;
  const joinedPlayers = (val.joinedPlayers as Record<User.Id, { type: PlayerType; mode: UserMode }> | undefined) ?? {};

  const selectableCards = SelectableCards.create(cards.map(StoryPoint.create));
  const [game] = Game.create({
    id,
    name,
    owner: User.createId(owner),
    cards: selectableCards,
    round: roundId,
    joinedPlayers: Object.entries(joinedPlayers).map(([k, { mode, type }]) => ({
      type,
      user: User.createId(k),
      mode,
    })),
    finishedRounds,
  });

  return game;
};
