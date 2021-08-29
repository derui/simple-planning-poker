import * as React from "react";

export interface UserInfoProps {
  name: string;
  onChangeName: (name: string) => void;
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

export const UserInfoUpdaterComponent: React.FunctionComponent<UserInfoProps> = ({ name, onChangeName }) => {
  const [currentName, setCurrentName] = React.useState(name);

  return (
    <div
      className="app__game__user-info-updater"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {NameEditor(currentName, setCurrentName)}
      {UpdateApplyer(currentName !== "", () => onChangeName(currentName))}
    </div>
  );
};
