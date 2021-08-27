import * as React from "react";

export interface UserInfoProps {
  name: string;
  onChangeName: (name: string) => void;
}

const NameEditor = (name: string, setName: (name: string) => void, submitName: () => void) => {
  return (
    <div className="app__game__user-info__name-editor">
      <label className="app__game__user-info__name-editor__label">Name</label>
      <input
        className="app__game__user-info__name-editor__input"
        type="text"
        defaultValue={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="app__game__user-info__name-editor__submit" onClick={() => submitName()}>
        update
      </button>
    </div>
  );
};

const NameViewer = (name: string, enableNameEditor: () => void) => {
  return (
    <div className="app__game__user-info__name-viewer">
      <label className="app__game__user-info__name-viewer__label">Name</label>
      <span className="app__game__user-info__name-viewer__name" onClick={() => enableNameEditor()}>
        {name}
      </span>
    </div>
  );
};

export const UserInfoComponent: React.FunctionComponent<UserInfoProps> = ({ name, onChangeName }) => {
  const [editName, setEditName] = React.useState(false);
  const [currentName, setCurrentName] = React.useState(name);

  return (
    <div className="app__game__user-info">
      {editName
        ? NameEditor(currentName, setCurrentName, () => {
            setEditName(false);
            onChangeName(currentName);
          })
        : NameViewer(currentName, () => setEditName(true))}
    </div>
  );
};
