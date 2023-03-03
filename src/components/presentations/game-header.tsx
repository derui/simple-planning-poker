import React from "react";
import { GameInfo } from "./game-info";
import { GameSettingsComponent } from "./game-settings";
import { UserInfo } from "./user-info";
import { UserMode } from "@/domains/game-player";

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

export const GameHeaderComponent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="app__game__header">
      <GameInfo gameName={props.gameName} onLeaveGame={() => props.onLeaveGame()} />
      <div className="app__game__header__right">
        <GameSettingsComponent origin={props.origin} invitationSignature={props.invitationSignature} />
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
