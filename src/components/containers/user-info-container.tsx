import React from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { UserInfoUpdater } from "../presentations/user-info-updater";
import { useAppDispatch, useAppSelector } from "../hooks";
import * as UserAction from "@/status/actions/user";
import * as GameAction from "@/status/actions/game";
import { UserMode } from "@/domains/game-player";
import { selectUserInfo } from "@/status/selectors/user";

type Props = BaseProps;

const styles = {
  root: classnames(
    "flex",
    "relative",
    "align-center",
    "px-3",
    "border-1-bt",
    "border-1-bt-transparent",
    "transition-color",
    "cursor-pointer",
    "hover:border-secondary-500"
  ),

  icon: classnames(
    "inline-block",
    "flex-none",
    "w-6",
    "h-6",
    "bg-secondary1-500",
    "mr-3",
    '[mask-image:url("/assets/svg/tabler-icon/user.svg")]',
    "[mask-size:cover]"
  ),

  name: classnames("inline-block", "flex-none", "w-32", "overflow-hidden", "text-ellipsis", "text-primary-500"),

  indicator: (opened: boolean) =>
    classnames(
      "ml-3",
      "inline-block",
      "flex-none",
      '[mask-image:url("/assets/svg/tabler-icon/shevron-down.svg")]',
      "[mask-size:cover]",
      "w-5",
      "h-5",
      "bg-primary-500",
      "transition-transform",
      {
        "[transform:rotateZ(180deg)]": opened,
      }
    ),
};

// eslint-disable-next-line func-style
export function UserInfoContainer(props: Props) {
  const testid = generateTestId(props.testid);
  const [opened, setOpened] = React.useState(false);
  const [payload, loading] = useAppSelector(selectUserInfo());
  const dispatch = useAppDispatch();

  const handleChangeUserInfo = (mode: UserMode, name: string) => {
    setOpened(false);
    dispatch(UserAction.changeName(name));
    dispatch(GameAction.changeUserMode(mode));
  };

  if (loading !== "finished" || !payload) {
    return null;
  }

  return (
    <div className={styles.root} data-testid={testid("root")} onClick={() => setOpened(!opened)}>
      <span className={styles.icon}></span>
      <span className={styles.name} data-testid={testid("name")}>
        {payload.userName}
      </span>
      {loading !== "finished" ? null : (
        <span className={styles.indicator(opened)} data-testid={testid("indicator")} data-opened={opened}></span>
      )}
      {opened ? (
        <UserInfoUpdater
          testid={testid("updater")}
          name={payload.userName}
          mode={payload.userMode}
          onChangeUserInfo={handleChangeUserInfo}
        />
      ) : null}
    </div>
  );
}
