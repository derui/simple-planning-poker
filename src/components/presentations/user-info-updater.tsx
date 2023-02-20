import * as React from "react";
import classnames from "classnames";
import { UserMode } from "@/domains/game-player";

export interface UserInfoProps {
  name: string;
  mode: UserMode;
  onChangeName: (name: string) => void;
  onChangeMode: (mode: UserMode) => void;
}

const NameEditor = (name: string, setName: (name: string) => void) => {
  return (
    <div className="app__game__user-info-updater__name-editor">
      <label className="app__game__user-info-updater__name-editor__label">Name</label>
      <input
        className="app__game__user-info-updater__name-editor__input"
        type="text"
        defaultValue={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

const ModeChanger = (mode: UserMode, setMode: (name: UserMode) => void) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const checked = mode === UserMode.inspector;
  const railClass = classnames({
    "app__game__user-info-updater__mode-changer__switch__rail": true,
    "app__game__user-info-updater__mode-changer__switch__rail--checked": checked,
  });

  const boxClass = classnames({
    "app__game__user-info-updater__mode-changer__switch__box": true,
    "app__game__user-info-updater__mode-changer__switch__box--checked": checked,
  });

  return (
    <div className="app__game__user-info-updater__mode-changer">
      <label className="app__game__user-info-updater__mode-changer__label">Inspector Mode</label>
      <div className="app__game__user-info-updater__mode-changer__switch-container">
        <span className="app__game__user-info-updater__mode-changer__switch-label">Off</span>
        <span className="app__game__user-info-updater__mode-changer__switch">
          <span className={railClass} onClick={() => ref?.current?.click()}>
            <span className={boxClass}></span>
          </span>
          <input
            ref={ref}
            className="app__game__user-info-updater__mode-changer__switch__input"
            type="checkbox"
            checked={checked}
            onChange={(e) => (e.target.checked ? setMode(UserMode.inspector) : setMode(UserMode.normal))}
          />
        </span>
        <span className="app__game__user-info-updater__mode-changer__switch-label">On</span>
      </div>
    </div>
  );
};

const UpdateApplyer = (allowApplying: boolean, submit: () => void) => {
  return (
    <div className="app__game__user-info-updater__applyer">
      <button
        disabled={!allowApplying}
        className="app__game__user-info-updater__name-editor__submit"
        onClick={() => submit()}
      >
        update
      </button>
    </div>
  );
};

export const UserInfoUpdaterComponent: React.FunctionComponent<UserInfoProps> = ({
  name,
  mode,
  onChangeMode,
  onChangeName,
}) => {
  const [currentName, setCurrentName] = React.useState(name);
  const [currentMode, setMode] = React.useState<UserMode>(mode);

  return (
    <div
      className="app__game__user-info-updater"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {NameEditor(currentName, setCurrentName)}
      {ModeChanger(currentMode, setMode)}
      {UpdateApplyer(currentName !== "", () => {
        onChangeName(currentName);
        onChangeMode(currentMode);
      })}
    </div>
  );
};
