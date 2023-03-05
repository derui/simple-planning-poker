import { GameObserver, UserObserver } from "./contexts/observer";
import { GameRepository } from "./domains/game-repository";
import { UserRepository } from "./domains/user-repository";
import { Authenticator } from "./status/type";
import { ChangeUserModeUseCase } from "./usecases/change-user-mode";
import { ChangeUserNameUseCase } from "./usecases/change-user-name";
import { CreateGameUseCase } from "./usecases/create-game";
import { HandCardUseCase } from "./usecases/hand-card";
import { JoinUserUseCase } from "./usecases/join-user";
import { LeaveGameUseCase } from "./usecases/leave-game";
import { NewRoundUseCase } from "./usecases/new-round";
import { ShowDownUseCase } from "./usecases/show-down";
import { DependencyRegistrar } from "./utils/dependency-registrar";

export type Dependencies = {
  userRepository: UserRepository;
  userObserver: UserObserver;
  changeUserNameUseCase: ChangeUserNameUseCase;
  gameRepository: GameRepository;
  createGameUseCase: CreateGameUseCase;
  handCardUseCase: HandCardUseCase;
  showDownUseCase: ShowDownUseCase;
  newRoundUseCase: NewRoundUseCase;
  changeUserModeUseCase: ChangeUserModeUseCase;
  joinUserUseCase: JoinUserUseCase;
  leaveGameUseCase: LeaveGameUseCase;
  authenticator: Authenticator;
  gameObserver: GameObserver;
};

export type ApplicationDependencyRegistrar = DependencyRegistrar<Dependencies>;
