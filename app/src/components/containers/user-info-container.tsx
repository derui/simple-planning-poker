import React from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { UserInfoUpdater } from "../presentations/user-info-updater";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Loader } from "../presentations/loader";
import { iconize } from "../iconize";
import * as UserAction from "@/status/actions/user";
import * as GameAction from "@/status/actions/game";
import { UserMode } from "@/domains/game-player";
import { selectUserInfo } from "@/status/selectors/user";
import { isFinished } from "@/utils/loadable";

type Props = BaseProps;

const styles = {
  root: (opened: boolean) =>
    classnames(
      "flex",
      "relative",
      "items-center",
      "px-3",
      "border-b",
      "transition-colors",
      "cursor-pointer",
      {
        "border-transparent": !opened,
        "border-secondary1-500": opened,
      },
      "hover:border-secondary1-500"
    ),

  icon: classnames("inline-block", "flex-none", "w-6", "h-6", "mr-3", "before:bg-secondary1-500", iconize("user")),

  name: classnames("inline-block", "flex-none", "w-24", "overflow-hidden", "text-ellipsis", "text-primary-500"),

  indicator: (opened: boolean) =>
    classnames(
      "ml-3",
      "inline-block",
      "flex-none",
      "before:bg-primary-500",
      iconize("chevron-down", { size: "s" }),
      "w-5",
      "h-5",
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
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  const handleChangeUserInfo = (mode: UserMode, name: string) => {
    setOpened(false);
    dispatch(UserAction.changeName(name));
    dispatch(GameAction.changeUserMode(mode));
  };

  if (!isFinished(userInfo)) {
    return (
      <div className={styles.root(opened)} data-testid={testid("root")}>
        <Loader size="m" shown testid={testid("loader")} />
      </div>
    );
  }

  const payload = userInfo[0];

  return (
    <div className={styles.root(opened)} data-testid={testid("root")} onClick={() => setOpened(!opened)}>
      <span className={styles.icon}></span>
      <span className={styles.name} data-testid={testid("name")}>
        {payload.userName}
      </span>
      <span className={styles.indicator(opened)} data-testid={testid("indicator")} data-opened={opened}></span>
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
