import { Component, createSignal } from "solid-js";

interface Props {
  origin: string;
  invitationSignature: string;
}

export const GameSettings: Component<Props> = (props) => {
  const url = () => `${props.origin}/invitation/${props.invitationSignature}`;
  const [open, setOpen] = createSignal(false);
  const containerClassName = {
    "app__game__game-settings__container": true,
    "app__game__game-settings__container--opened": open(),
  };
  const openerClassName = {
    "app__game__game-settings__opener": true,
    "app__game__game-settings__opener--opened": open(),
  };

  return (
    <div class="app__game__game-settings">
      <button classList={openerClassName} onClick={() => setOpen(!open())}></button>
      <div classList={containerClassName}>
        <div class="app__game__game-settings__item">
          <span class="app__game__game-settings__label">Invitation Link</span>
          <input type="text" class="app__game__game-settings__url" readOnly value={url()} />
        </div>
      </div>
    </div>
  );
};
