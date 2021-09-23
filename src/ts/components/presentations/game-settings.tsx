import classNames from "classnames";
import React from "react";

interface Props {
  origin: string;
  invitationSignature: string;
}

export const GameSettingsComponent: React.FunctionComponent<Props> = ({ origin, invitationSignature }) => {
  const url = `${origin}/invitation/${invitationSignature}`;
  const [open, setOpen] = React.useState(false);
  const containerClassName = classNames({
    "app__game__game-settings__container": true,
    "app__game__game-settings__container--opened": open,
  });
  const openerClassName = classNames({
    "app__game__game-settings__opener": true,
    "app__game__game-settings__opener--opened": open,
  });

  return (
    <div className="app__game__game-settings">
      <button className={openerClassName} onClick={() => setOpen(!open)}></button>
      <div className={containerClassName}>
        <div className="app__game__game-settings__item">
          <span className="app__game__game-settings__label">Invitation Link</span>
          <input type="text" className="app__game__game-settings__url" readOnly value={url} />
        </div>
      </div>
    </div>
  );
};
