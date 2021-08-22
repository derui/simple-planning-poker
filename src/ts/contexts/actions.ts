import { UserId } from "@/domains/user";
import { Authenticator, createSigninActions, SigninActions } from "../status/signin";
import { createContext } from "react";
import { createGameCreationAction, GameCreationAction } from "@/status/game-creator";
import { CreateGameUseCase } from "@/usecases/create-game";
import { EventDispatcher } from "@/usecases/base";
import { GameRepository } from "@/domains/game-repository";
import { Game } from "@/domains/game";

class DummyAuthenticator implements Authenticator {
  authenticate(email: string): Promise<UserId> {
    return Promise.resolve(email as UserId);
  }
}

// context for SignInAction.
export const signInActionContext = createContext<SigninActions>(createSigninActions(new DummyAuthenticator()));

class DummyDispatcher implements EventDispatcher {
  dispatch(): void {}
}
class DummyGameRepository implements GameRepository {
  save(): void {
    throw new Error("Do not use in production");
  }
  findBy(): Game | undefined {
    throw new Error("Do not use in production");
  }
}

// context for GameCreationAction.
export const gameCreationActionContext = createContext<GameCreationAction>(
  createGameCreationAction(new CreateGameUseCase(new DummyDispatcher(), new DummyGameRepository()))
);
