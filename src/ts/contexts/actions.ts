import { UserId } from "@/domains/user";
import { Authenticator, createSigninActions, SigninActions } from "../status/signin";
import { createContext } from "react";
import { createGameCreationActions, GameCreationAction } from "@/status/game-creator";
import { CreateGameUseCase } from "@/usecases/create-game";
import { EventDispatcher } from "@/usecases/base";
import { GameRepository } from "@/domains/game-repository";
import { Game } from "@/domains/game";
import { InGameAction } from "@/status/in-game";
import { UserRepository } from "@/domains/user-repository";
import { UserActions } from "@/status/user";
import { ChangeUserNameUseCase } from "@/usecases/change-user-name";

class DummyAuthenticator implements Authenticator {
  authenticate(email: string): Promise<UserId> {
    return Promise.resolve(email as UserId);
  }

  getAuthenticatedUser(): Promise<UserId | undefined> {
    throw new Error("Method not implemented.");
  }
}

// context for SignInAction.
export const signInActionContext = createContext<SigninActions>(
  createSigninActions(new DummyAuthenticator(), {} as UserRepository)
);

class DummyDispatcher implements EventDispatcher {
  dispatch(): void {}
}
class DummyGameRepository implements GameRepository {
  save(): void {
    throw new Error("Do not use in production");
  }
  findBy(): Promise<Game | undefined> {
    throw new Error("Do not use in production");
  }
}

// context for GameCreationAction.
export const gameCreationActionContext = createContext<GameCreationAction>(
  createGameCreationActions(new CreateGameUseCase(new DummyDispatcher(), new DummyGameRepository()))
);

// context for GameCreationAction.
export const inGameActionContext = createContext<InGameAction>({} as InGameAction);

// context for UserActions.
export const userActionsContext = createContext<UserActions>({} as UserActions);
