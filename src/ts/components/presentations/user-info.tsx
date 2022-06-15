import { UserInfoUpdater } from "./user-info-updater";
import { UserMode } from "@/domains/game-player";
import { Component, createSignal, Show } from "solid-js";

interface Props {
  name: string;
  mode: UserMode;
  onChangeName: (name: string) => void;
  onChangeMode: (mode: UserMode) => void;
}

const UserInfoComponent: Component<Props> = (props) => {
  const [showUpdater, setShowUpdater] = createSignal(false);
  const indicatorClassName = {
    "app__game__user-info__indicator": true,
    "app__game__user-info__indicator--opened": showUpdater(),
  };

  return (
    <div class="app__game__user-info" onClick={() => setShowUpdater(!showUpdater())}>
      <span class="app__game__user-info__icon"></span>
      <span class="app__game__user-info__name">{props.name}</span>
      <span classList={indicatorClassName}></span>
      <Show when={showUpdater()}>
        <UserInfoUpdater
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
      </Show>
    </div>
  );
};

export default UserInfoComponent;
