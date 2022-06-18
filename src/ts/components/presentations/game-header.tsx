import { UserMode } from "@/domains/game-player";
import { Component } from "solid-js";
import { GameInfo } from "./game-info";
import { GameSettings } from "./game-settings";
import { UserInfo } from "./user-info";

interface Props {
  gameName: string;
  onChangeName: (name: string) => void;
  userName: string;
  onChangeMode: (name: UserMode) => void;
  userMode: UserMode;
  origin: string;
  invitationSignature: string;
  onLeaveGame: () => void;
}

export const GameHeaderComponent: Component<Props> = (props) => {
  return (
    <div class="app__game__header">
      <GameInfo gameName={props.gameName} onLeaveGame={() => props.onLeaveGame()} />
      <div class="app__game__header__right">
        <GameSettings origin={props.origin} invitationSignature={props.invitationSignature} />
        <UserInfo
          name={props.userName}
          onChangeName={(name) => props.onChangeName(name)}
          mode={props.userMode}
          onChangeMode={(mode) => props.onChangeMode(mode)}
        />
      </div>
    </div>
  );
};
