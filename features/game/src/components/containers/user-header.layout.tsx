import { UserDto } from "../../atoms/dto.js";
import { UserHeader } from "../presentations/user-header.js";
import { VoterMode } from "../type.js";
import * as styles from "./user-header.css.js";

export interface Props {
  readonly user?: UserDto;
  readonly mode: "edit" | "view";

  readonly onSubmitEdit: (name: string) => void;
  readonly onChangeDefaultVoterMode: (next: VoterMode) => void;
  readonly onRequestUserNameEdit: () => void;
}

export const UserHeaderLayout = function UserHeaderLayout({
  user,
  mode,
  onSubmitEdit,
  onChangeDefaultVoterMode,
}: Props): JSX.Element {
  if (!user) {
    return <div className={styles.root}></div>;
  }

  return (
    <div className={styles.root}>
      <UserHeader
        userName={user.name}
        defaultVoterMode={VoterMode.Normal}
        onRequestUserNameEdit={onSubmitEdit}
        onChangeDefaultVoterMode={onChangeDefaultVoterMode}
      />
    </div>
  );
};
