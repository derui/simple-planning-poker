import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { VoterMode } from "../type.js";
import * as styles from "./user-header.css.js";

export interface Props {
  /**
   * The user's name.
   */
  readonly userName: string;

  /**
   * The user's default voter mode.
   */
  readonly defaultVoterMode: VoterMode;

  /**
   * The user's default voter mode.
   */
  readonly onChangeDefaultVoterMode?: (next: VoterMode) => void;

  /**
   * The user' name change request callback.
   */
  readonly onRequestUserNameEdit?: () => void;
}

export const UserHeader = function UserHeader({
  userName,
  defaultVoterMode,
  onChangeDefaultVoterMode,
  onRequestUserNameEdit,
}: Props): JSX.Element {
  const HeaderIcon = defaultVoterMode == VoterMode.Inspector ? Icon.Eye : Icon.User;

  const handleChangeDefaultVoterMode = () => {
    const next = defaultVoterMode == VoterMode.Inspector ? VoterMode.Normal : VoterMode.Inspector;

    onChangeDefaultVoterMode?.(next);
  };

  const handleRequestUserNameEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    onRequestUserNameEdit?.();
  };

  return (
    <div className={styles.root}>
      <button className={styles.voterMode} onClick={handleChangeDefaultVoterMode} aria-label="Toggle voter mode">
        <HeaderIcon size="m" variant={Variant.orange} />
      </button>
      <div className={styles.userName.container}>
        <span className={styles.userName.name}>{userName}</span>
        <span className={styles.userName.icon}>
          <button className={styles.userName.icon} onClick={handleRequestUserNameEdit} aria-label="Edit user name">
            <Icon.Pencil size="m" variant={Variant.teal} />
          </button>
        </span>
      </div>
    </div>
  );
};
