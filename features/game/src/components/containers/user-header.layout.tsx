import { UserDto } from "../../atoms/dto.js";
import { UserHeader } from "../presentations/user-header.js";
import { UserNameEditor } from "../presentations/user-name-editor.js";
import { VoterMode } from "../type.js";
import * as styles from "./user-header.css.js";

export interface Props {
  readonly user?: UserDto;
  readonly mode: "edit" | "view";

  readonly onSubmitEdit: (name: string) => void;
  readonly onChangeDefaultVoterMode: (next: VoterMode) => void;
  readonly onRequestUserNameEdit: () => void;
  readonly onCancelUserNameEdit: () => void;
}

export const UserHeaderLayout = function UserHeaderLayout({
  user,
  mode,
  onSubmitEdit,
  onChangeDefaultVoterMode,
  onRequestUserNameEdit,
  onCancelUserNameEdit,
}: Props): JSX.Element {
  if (!user) {
    return <div className={styles.root}></div>;
  }

  if (mode == "edit") {
    return (
      <div className={styles.root}>
        <UserNameEditor defaultValue={user.name} onSubmit={onSubmitEdit} onCancel={onCancelUserNameEdit} />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <UserHeader
        userName={user.name}
        defaultVoterMode={VoterMode.Normal}
        onRequestUserNameEdit={onRequestUserNameEdit}
        onChangeDefaultVoterMode={onChangeDefaultVoterMode}
      />
    </div>
  );
};
