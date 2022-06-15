import { UserMode } from "@/domains/game-player";
import { Component, createSignal } from "solid-js";

export interface UserInfoProps {
  name: string;
  mode: UserMode;
  onChangeName: (name: string) => void;
  onChangeMode: (mode: UserMode) => void;
}

const NameEditor = (name: string, setName: (name: string) => void) => {
  return (
    <div class="app__game__user-info-updater__name-editor">
      <label class="app__game__user-info-updater__name-editor__label">Name</label>
      <input
        class="app__game__user-info-updater__name-editor__input"
        type="text"
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
      />
    </div>
  );
};

const ModeChanger = (mode: UserMode, setMode: (name: UserMode) => void) => {
  let ref: HTMLInputElement | undefined;
  const checked = mode === UserMode.inspector;
  const railClass = {
    "app__game__user-info-updater__mode-changer__switch__rail": true,
    "app__game__user-info-updater__mode-changer__switch__rail--checked": checked,
  };

  const boxClass = {
    "app__game__user-info-updater__mode-changer__switch__box": true,
    "app__game__user-info-updater__mode-changer__switch__box--checked": checked,
  };

  return (
    <div class="app__game__user-info-updater__mode-changer">
      <label class="app__game__user-info-updater__mode-changer__label">Inspector Mode</label>
      <div class="app__game__user-info-updater__mode-changer__switch-container">
        <span class="app__game__user-info-updater__mode-changer__switch-label">Off</span>
        <span class="app__game__user-info-updater__mode-changer__switch">
          <span classList={railClass} onClick={() => ref?.click()}>
            <span classList={boxClass}></span>
          </span>
          <input
            ref={ref}
            class="app__game__user-info-updater__mode-changer__switch__input"
            type="checkbox"
            checked={checked}
            onChange={(e) => (e.currentTarget.checked ? setMode(UserMode.inspector) : setMode(UserMode.normal))}
          />
        </span>
        <span class="app__game__user-info-updater__mode-changer__switch-label">On</span>
      </div>
    </div>
  );
};

const UpdateApplyer = (allowApplying: boolean, submit: () => void) => {
  return (
    <div class="app__game__user-info-updater__applyer">
      <button disabled={!allowApplying} class="app__game__user-info-updater__name-editor__submit" onClick={submit}>
        update
      </button>
    </div>
  );
};

export const UserInfoUpdater: Component<UserInfoProps> = ({ name, mode, onChangeMode, onChangeName }) => {
  const [currentName, setCurrentName] = createSignal(name);
  const [currentMode, setMode] = createSignal<UserMode>(mode);

  return (
    <div
      class="app__game__user-info-updater"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {NameEditor(currentName(), setCurrentName)}
      {ModeChanger(currentMode(), setMode)}
      {UpdateApplyer(currentName() !== "", () => {
        onChangeName(currentName());
        onChangeMode(currentMode());
      })}
    </div>
  );
};
