import * as Round from "@/domains/round";
import * as StoryPoint from "@/domains/story-point";
import * as SelectableCards from "@/domains/selectable-cards";
import * as User from "@/domains/user";
import { child, Database, get, ref, update } from "firebase/database";
import { serialize, deserialize, Serialized } from "./user-hand-converter";
import * as resolver from "./round-ref-resolver";
import { RoundRepository } from "@/domains/round-repository";
import { filterUndefined } from "@/utils/basic";

/**
 * Implementation of `RoundRepository`
 */
export class RoundRepositoryImpl implements RoundRepository {
  constructor(private database: Database) {}

  async save(round: Round.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.count(round.id)] = round.count;
    updates[resolver.finished(round.id)] = Round.isFinishedRound(round);
    updates[resolver.userHands(round.id)] = Object.entries(round.hands).reduce<Record<User.Id, Serialized>>(
      (accum, [key, value]) => {
        accum[key as User.Id] = serialize(value);

        return accum;
      },
      {}
    );

    if (Round.isRound(round)) {
      updates[resolver.cards(round.id)] = round.selectableCards;
    }

    if (Round.isFinishedRound(round)) {
      updates[resolver.finishedAt(round.id)] = round.finishedAt;
    }

    await update(ref(this.database), updates);
  }

  async findBy(id: Round.Id): Promise<Round.T | null> {
    if (id === "") {
      return null;
    }
    const snapshot = await get(child(ref(this.database, "rounds"), id));

    const val = snapshot.val();
    if (!val) {
      return null;
    }

    const count = val.count as number;
    const cards = val.cards as number[];
    const hands = val.userHands as { [key: User.Id]: Serialized } | undefined;
    const finishedAt = val.finishedAt as string | undefined;

    const selectableCards = SelectableCards.create(cards.map(StoryPoint.create));
    const deserializedHands = hands
      ? Object.entries(hands)
          .map(([k, hand]) => {
            if (!hand) {
              return undefined;
            }
            return {
              user: User.createId(k),
              hand: deserialize(hand),
            };
          })
          .filter(filterUndefined)
      : [];

    if (finishedAt) {
      return Round.finishedRoundOf({
        id,
        count,
        finishedAt,
        hands: deserializedHands,
      });
    }

    return Round.roundOf({
      id,
      count,
      selectableCards,
      hands: deserializedHands,
    });
  }
}
