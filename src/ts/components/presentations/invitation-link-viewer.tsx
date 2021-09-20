import classNames from "classnames";
import React from "react";

interface Props {
  origin: string;
  invitationSignature: string;
}

export const InvitationLinkViewerComponent: React.FunctionComponent<Props> = ({ origin, invitationSignature }) => {
  const url = `${origin}/invitation/${invitationSignature}`;
  const [open, setOpen] = React.useState(false);
  const containerClassName = classNames({
    "app__game__invitation-link-viewer__container": true,
    "app__game__invitation-link-viewer__container--opened": open,
  });

  return (
    <div className="app__game__invitation-link-viewer">
      <button className="app__game__invitation-link-viewer__opener" onClick={() => setOpen(!open)}>
        Invite user
      </button>
      <div className={containerClassName}>
        <span className="app__game__invitation-link-viewer__label">Invitation Link</span>
        <input type="text" className="app__game__invitation-link-viewer__url" readOnly value={url} />
      </div>
    </div>
  );
};
