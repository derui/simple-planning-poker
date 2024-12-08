import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { DataSnapshot } from "firebase/database";

/**
 * Snapshot type for game
 */
interface Snapshot {
  name: string;
  points: number[];
  owner: string;
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
export const deserializeFrom = function deserializeFrom(id: Game.Id, snapshot: DataSnapshot): Game.T | undefined {
  const val: unknown = snapshot.val();
  if (!val || !parseSnapshot(val)) {
    return;
  }

  const { name, points, owner } = val;

  const selectableCards = ApplicablePoints.create(points.map(StoryPoint.create));
  const [game] = Game.create({
    id,
    name: GameName.create(name),
    owner: User.createId(owner),
    points: selectableCards,
  });

  return game;
};
