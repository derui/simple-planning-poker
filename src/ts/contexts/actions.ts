import { UserId } from "@/domains/user";
import { Authenticator, createSigninActions, SigninActions } from "../status/signin";
import { createContext } from "react";
import { InGameAction } from "@/status/in-game-action";
import { UserRepository } from "@/domains/user-repository";
import { UserActions } from "@/status/user";
import { InGameSelector } from "@/status/in-game-selector";
import { GameCreationAction } from "@/status/game-creator";

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

// context for GameCreationAction.
export const gameCreationActionContext = createContext<GameCreationAction>({} as GameCreationAction);

export const inGameActionContext = createContext<InGameAction>({} as InGameAction);

export const inGameSelectorContext = createContext<InGameSelector>({} as InGameSelector);

// context for UserActions.
export const userActionsContext = createContext<UserActions>({} as UserActions);
