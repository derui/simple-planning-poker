import { UserMode } from "@/domains/game-player";
import { Component, createSignal } from "solid-js";

export interface UserInfoProps {
  name: string;
  mode: UserMode;
  onChangeName: (name: string) => void;
  onChangeMode: (mode: UserMode) => void;
}

const NameEditor: Component<{ name: string; setName: (name: string) => void }> = (props) => {
  return (
    <div class="app__game__user-info-updater__name-editor">
      <label class="app__game__user-info-updater__name-editor__label">Name</label>
      <input
        class="app__game__user-info-updater__name-editor__input"
        type="text"
        value={props.name}
        onInput={(e) => {
          e.stopPropagation();
          e.preventDefault();
          props.setName(e.currentTarget.value);
        }}
      />
    </div>
  );
};

const ModeChanger: Component<{ mode: UserMode; setMode: (name: UserMode) => void }> = (props) => {
  let ref: HTMLInputElement | undefined;

  const checked = () => props.mode === UserMode.inspector;
  const railClass = () => ({
    "app__game__user-info-updater__mode-changer__switch__rail": true,
    "app__game__user-info-updater__mode-changer__switch__rail--checked": checked(),
  });

  const boxClass = () => ({
    "app__game__user-info-updater__mode-changer__switch__box": true,
    "app__game__user-info-updater__mode-changer__switch__box--checked": checked(),
  });

  return (
    <div class="app__game__user-info-updater__mode-changer">
      <label class="app__game__user-info-updater__mode-changer__label">Inspector Mode</label>
      <div class="app__game__user-info-updater__mode-changer__switch-container">
        <span class="app__game__user-info-updater__mode-changer__switch-label">Off</span>
        <span class="app__game__user-info-updater__mode-changer__switch">
          <span classList={railClass()} onClick={() => ref?.click()}>
            <span classList={boxClass()}></span>
          </span>
          <input
            ref={ref}
            class="app__game__user-info-updater__mode-changer__switch__input"
            type="checkbox"
            onclick={() => {
              checked() ? props.setMode(UserMode.normal) : props.setMode(UserMode.inspector);
            }}
          />
        </span>
        <span class="app__game__user-info-updater__mode-changer__switch-label">On</span>
      </div>
    </div>
  );
};

const UpdateApplyer: Component<{ allowApplying: boolean; submit: () => void }> = (props) => {
  return (
    <div class="app__game__user-info-updater__applyer">
      <button
        disabled={!props.allowApplying}
        class="app__game__user-info-updater__name-editor__submit"
        onClick={() => props.submit()}
      >
        update
      </button>
    </div>
  );
};

export const UserInfoUpdater: Component<UserInfoProps> = (props) => {
  const [currentName, setCurrentName] = createSignal(props.name);
  const [currentMode, setMode] = createSignal<UserMode>(props.mode);

  return (
    <div
      class="app__game__user-info-updater"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <NameEditor name={currentName()} setName={setCurrentName} />
      <ModeChanger mode={currentMode()} setMode={setMode} />
      <UpdateApplyer
        allowApplying={currentName() !== ""}
        submit={() => {
          props.onChangeName(currentName());
          props.onChangeMode(currentMode());
        }}
      />
    </div>
  );
};
