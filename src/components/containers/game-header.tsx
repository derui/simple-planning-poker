import React from "react";
import classNames from "classnames";
import { GameInfo } from "../presentations/game-info";
import { InvitationLink } from "../presentations/invitation-link";
import { UserInfoUpdater } from "../presentations/user-info-updater";
import { useAppSelector } from "../hooks";
import { BaseProps } from "../base";
import { selectUserInfo } from "@/status/selectors/user";
import { isLoading } from "@/utils/loadable";

type Props = BaseProps;

const styles = {
  root: classNames("flex", "flex-none", "justify-between", "text-white", "align-center", "p-4", "z-30"),
  right: classNames("flex", "flex-auto", "align-center", "justify-end"),
} as const;

export const GameHeaderComponent: React.FunctionComponent<Props> = (props) => {
  const userInfo = useAppSelector(selectUserInfo());

  if (isLoading(userInfo)) {
    return (
      <div className={styles.root}>
        <GameInfo gameName={props.gameName} onLeaveGame={() => props.onLeaveGame()} />
        <div className={styles.right}>
          <InvitationLink />
          <UserInfoUpdater name={userInfo.userName} onChangeUserInfo={handleChangeUserInfo} mode={props.userMode} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <GameInfo gameName={props.gameName} onLeaveGame={() => props.onLeaveGame()} />
      <div className={styles.right}>
        <InvitationLink />
        <UserInfoUpdater name={userInfo.userName} onChangeUserInfo={handleChangeUserInfo} mode={props.userMode} />
      </div>
    </div>
  );
};
