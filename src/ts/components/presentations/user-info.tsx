import React from "react";
import classnames from "classnames";
import { UserInfoUpdaterComponent } from "./user-info-updater";
import { UserMode } from "@/domains/game-player";

interface Props {
  name: string;
  mode: UserMode;
  onChangeName: (name: string) => void;
  onChangeMode: (mode: UserMode) => void;
}

export const UserInfoComponent: React.FunctionComponent<Props> = (props) => {
  const [showUpdater, setShowUpdater] = React.useState(false);
  const indicatorClassName = classnames({
    "app__game__user-info__indicator": true,
    "app__game__user-info__indicator--opened": showUpdater,
  });

  return (
    <div className="app__game__user-info" onClick={() => setShowUpdater(!showUpdater)}>
      <span className="app__game__user-info__icon"></span>
      <span className="app__game__user-info__name">{props.name}</span>
      <span className={indicatorClassName}></span>
      {showUpdater ? (
        <UserInfoUpdaterComponent
          name={props.name}
          mode={props.mode}
          onChangeName={(name) => {
            setShowUpdater(false);
            props.onChangeName(name);
          }}
          onChangeMode={(mode) => {
            setShowUpdater(false);
            props.onChangeMode(mode);
          }}
        />
      ) : null}
    </div>
  );
};
