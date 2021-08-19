import { Card } from "./card";
import { createStoryPoint, StoryPoint } from "./story-point";
import { UserId } from "./user";

export interface UserHand {
  userId: UserId;
  card: Card;
}

// Game is value object
export interface Game {
  get joinedUsers(): UserId[];
  get userHands(): UserHand[];
  get showedDown(): boolean;

  // find hand by user id
  findHandBy(userId: UserId): Card | undefined;

  addPartiticatedUserOnTheWay(userId: UserId): Game;

  // show down all cards betted by user
  showDown(): Game;

  // calulate average story point in this game.
  calculateAverage(): StoryPoint | undefined;

  // game accept hand by user
  acceptHandBy(user: UserId, card: Card): Game;
}

type InternalGame = Game & { _userHands: UserHand[]; _showedDown: boolean; _joinedUsers: UserId[] };

const createInternalGame = (joinedUsers: UserId[], userHands: UserHand[], showedDown: boolean): Game => {
  if (joinedUsers.length === 0) {
    throw new Error("Users in game must be greater than 0");
  }

  return {
    _userHands: userHands,
    _showedDown: showedDown,
    _joinedUsers: joinedUsers,

    get userHands() {
      return this._userHands;
    },

    get showedDown() {
      return this._showedDown;
    },

    get joinedUsers() {
      return this._joinedUsers;
    },

    findHandBy(userId: UserId) {
      return this._userHands.find((v) => v.userId === userId)?.card;
    },

    addPartiticatedUserOnTheWay(userId: UserId): Game {
      if (this.joinedUsers.includes(userId)) {
        return this;
      }

      return createInternalGame(this.joinedUsers.concat([userId]), this.userHands, this.showedDown);
    },

    showDown(): Game {
      const handedUsers = new Set(this.userHands.map((v) => v.userId));
      const joinedUsers = new Set(this.joinedUsers);
      if (handedUsers.size > 0 && isSuperset(handedUsers, joinedUsers)) {
        return createInternalGame(this.joinedUsers, this.userHands, true);
      }

      return this;
    },

    calculateAverage(): StoryPoint | undefined {
      if (!this.showedDown) {
        return undefined;
      }

      const cards = this._userHands.map((v) => v.card).filter((v) => v.kind === "storypoint");

      const average =
        cards.reduce((point, v) => {
          switch (v.kind) {
            case "storypoint":
              return point + v.storyPoint.value;
            case "giveup":
              return point;
          }
        }, 0) / cards.length;

      return createStoryPoint(average);
    },

    acceptHandBy(user: UserId, card: Card): Game {
      if (this.showedDown) {
        return this;
      }

      const hands = this.userHands.filter((v) => v.userId !== user);
      hands.push({ userId: user, card });

      return createInternalGame(this.joinedUsers, hands, this.showedDown);
    },
  } as InternalGame;
};

export const createGame = (joinedUsers: UserId[]): Game => {
  if (joinedUsers.length === 0) {
    throw new Error("Users in game must be greater than 0");
  }

  return createInternalGame(joinedUsers, [], false);
};

const isSuperset = function <T>(baseSet: Set<T>, subset: Set<T>) {
  for (let elem of subset) {
    if (!baseSet.has(elem)) {
      return false;
    }
  }
  return true;
};
