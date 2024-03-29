import classNames from "classnames";
import { useNavigate } from "react-router";
import { GameInfo } from "../presentations/game-info";
import { InvitationToken } from "../presentations/invitation-token";
import { useAppDispatch, useAppSelector } from "../hooks";
import { BaseProps, generateTestId } from "../base";
import { Skeleton } from "../presentations/skeleton";
import { JoinedUserList } from "../presentations/joined-user-list";
import { UserInfoContainer } from "./user-info-container";
import { isFinished } from "@/utils/loadable";
import { selectCurrentGameInvitationToken, selectCurrentGameName, selectJoinedPlayers } from "@/status/selectors/game";
import { kickPlayer, leaveGame } from "@/status/actions/game";
import { selectUserInfo } from "@/status/selectors/user";
import * as User from "@/domains/user";
import { showMessage } from "@/status/actions/common";

type Props = BaseProps;

const styles = {
  root: classNames("flex", "flex-none", "justify-between", "items-center", "p-4", "z-30"),
  right: classNames("flex", "flex-auto", "align-center", "justify-end", "space-x-4"),
} as const;

// eslint-disable-next-line func-style
export function GameHeaderContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const gameName = useAppSelector(selectCurrentGameName);
  const userInfo = useAppSelector(selectUserInfo);
  const invitation = useAppSelector(selectCurrentGameInvitationToken);
  const joinedPlayers = useAppSelector(selectJoinedPlayers);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isFinished(gameName) || !isFinished(invitation) || !isFinished(userInfo) || !isFinished(joinedPlayers)) {
    return (
      <div className={styles.root} data-testid={gen("root")}>
        <Skeleton testid={gen("loading")} />
      </div>
    );
  }

  const handleLeaveGame = () => {
    dispatch(leaveGame());
    navigate("/game");
  };

  const handleKick = (id: User.Id) => {
    dispatch(kickPlayer(id));
  };

  const handleCopy = () => {
    dispatch(showMessage("invitation token copied"));
  };

  const handleBack = () => {
    navigate("/game");
  };

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <GameInfo
        owner={userInfo[0].owner}
        gameName={gameName[0]}
        onLeaveGame={handleLeaveGame}
        onBack={handleBack}
        testid={gen("game-info")}
      />

      <div className={styles.right}>
        <JoinedUserList
          users={joinedPlayers[0]}
          onKick={userInfo[0].owner ? handleKick : undefined}
          testid={gen("joined-user-list")}
        />
        <InvitationToken invitationToken={invitation[0]} testid={gen("invitation")} onCopy={handleCopy} />
        <UserInfoContainer testid={gen("user-info")} />
      </div>
    </div>
  );
}
