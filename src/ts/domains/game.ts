import { createId, Id } from "./base";
import { Card } from "./card";
import { EventFactory, GameShowedDown, NewGameStarted, UserCardSelected, UserJoined } from "./event";
import { SelectableCards } from "./selectable-cards";
import { createStoryPoint, StoryPoint } from "./story-point";
import { User, UserId } from "./user";

export type GameId = Id<"Game">;

export const createGameId = () => createId<"Game">();

export interface UserHand {
  userId: UserId;
  card: Card;
}

// Game is value object
export interface Game {
  get id(): GameId;
  get name(): string;
  get joinedUsers(): UserId[];
  get userHands(): UserHand[];
  get showedDown(): boolean;
  get selectableCards(): SelectableCards;

  changeName(name: string): void;

  canChangeName(name: string): boolean;

  canShowDown(): boolean;

  // find hand by user id
  findHandBy(userId: UserId): Card | undefined;

  // join user to this room
  acceptToBeJoinedBy(user: User): UserJoined | undefined;

  // return true if room can accept to join user
  canAcceptToBeJoinedBy(user: User): boolean;

  // show down all cards betted by user
  showDown(): GameShowedDown | undefined;

  // calulate average story point in this game.
  calculateAverage(): StoryPoint | undefined;

  // game accept hand by user
  acceptHandBy(user: UserId, card: Card): UserCardSelected | undefined;

  // start new game
  newGame(): NewGameStarted;
}

type InternalGame = Game & {
  _userHands: UserHand[];
  _showedDown: boolean;
  _joinedUsers: UserId[];
  _name: string;
  _selectableCards: SelectableCards;
};

export const createGame = (
  id: GameId,
  name: string,
  initialUsers: UserId[],
  selectableCards: SelectableCards
): Game => {
  if (initialUsers.length === 0) {
    throw new Error("Users in game must be greater than 0");
  }

  return {
    _name: name,
    _userHands: [],
    _showedDown: false,
    _joinedUsers: initialUsers,
    _selectableCards: selectableCards,

    get id() {
      return id;
    },

    get name() {
      return this._name;
    },

    get userHands() {
      return this._userHands;
    },

    get showedDown() {
      return this._showedDown;
    },

    get joinedUsers() {
      return this._joinedUsers;
    },

    get selectableCards() {
      return this._selectableCards;
    },

    findHandBy(userId: UserId) {
      return this._userHands.find((v) => v.userId === userId)?.card;
    },

    canShowDown(): boolean {
      const handedUsers = new Set(this.userHands.map((v) => v.userId));
      const joinedUsers = new Set(this.joinedUsers);
      return handedUsers.size > 0 && isSuperset(joinedUsers, handedUsers) && !this.showedDown;
    },

    showDown(): GameShowedDown | undefined {
      if (this.canShowDown()) {
        this._showedDown = true;
        return EventFactory.gamdShowedDown(this.id);
      }

      return undefined;
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

    acceptHandBy(user: UserId, card: Card): UserCardSelected | undefined {
      if (this.showedDown) {
        return;
      }

      const hands = this.userHands.filter((v) => v.userId !== user);
      hands.push({ userId: user, card });
      this._userHands = hands;

      return EventFactory.userCardSelected(this.id, user, card);
    },

    changeName(name: string) {
      if (!this.canChangeName(name)) {
        throw new Error("can not change name");
      }
      this._name = name;
    },

    canChangeName(name: string) {
      return name !== "";
    },

    acceptToBeJoinedBy(user: User) {
      if (!this.canAcceptToBeJoinedBy(user)) {
        return;
      }

      this._joinedUsers.push(user.id);

      return EventFactory.userJoined(this.id, user.id, user.name);
    },

    canAcceptToBeJoinedBy(user: User): boolean {
      return !this._joinedUsers.some((v) => v === user.id);
    },

    newGame() {
      this._userHands = [];
      this._showedDown = false;

      return EventFactory.newGameStarted(this.id);
    },
  } as InternalGame;
};

const isSuperset = function <T>(baseSet: Set<T>, subset: Set<T>) {
  for (let elem of subset) {
    if (!baseSet.has(elem)) {
      return false;
    }
  }
  return true;
};
