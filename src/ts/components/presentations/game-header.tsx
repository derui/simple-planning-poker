import { UserMode } from "~/src/ts/domains/game-player";
import React from "react";
import { GameInfoComponent } from "./game-info";
import { GameSettingsComponent } from "./game-settings";
import { UserInfoComponent } from "./user-info";

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
      <GameInfoComponent gameName={props.gameName} onLeaveGame={() => props.onLeaveGame()} />
      <div className="app__game__header__right">
        <GameSettingsComponent origin={props.origin} invitationSignature={props.invitationSignature} />
        <UserInfoComponent
          name={props.userName}
          onChangeName={(name) => props.onChangeName(name)}
          mode={props.userMode}
          onChangeMode={(mode) => props.onChangeMode(mode)}
        />
      </div>
    </div>
  );
};
