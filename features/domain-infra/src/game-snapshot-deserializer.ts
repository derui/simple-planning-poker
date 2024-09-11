import { DataSnapshot } from "firebase/database";
import { Game, StoryPoint, ApplicablePoints, User, Voting, GamePlayer } from "@spp/shared-domain";

/**
 * Snapshot type for game
 */
interface Snapshot {
  name: string;
  cards: number[];
  voting: Voting.Id;
  owner: string;
  joinedPlayers: Record<User.Id, { type: GamePlayer.PlayerType; mode: GamePlayer.UserMode }> | undefined;
}

/**
 * Parse unknown as Snapshot forcely.
 */
const parseSnapshot = function parseSnapshot(_value: unknown): _value is Snapshot {
  return true;
};

/**
 * deserialize from firebase's snapshot
 */
export const deserializeFrom = function deserializeFrom(id: Game.Id, snapshot: DataSnapshot): Game.T | null {
  const val: unknown = snapshot.val();
  if (!parseSnapshot(val)) {
    return null;
  }
  const { name, cards, voting, owner, joinedPlayers } = val;

  const selectableCards = ApplicablePoints.create(cards.map(StoryPoint.create));
  const [game] = Game.create({
    id,
    name,
    owner: User.createId(owner),
    points: selectableCards,
    voting,
    joinedPlayers: Object.entries(joinedPlayers ?? {}).map(([k, { mode, type }]) => ({
      type,
      user: User.createId(k),
      mode,
    })),
  });

  return game;
};
