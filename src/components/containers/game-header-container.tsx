import classNames from "classnames";
import { useNavigate } from "react-router";
import { GameInfo } from "../presentations/game-info";
import { InvitationLink } from "../presentations/invitation-link";
import { useAppDispatch, useAppSelector } from "../hooks";
import { BaseProps, generateTestId } from "../base";
import { Skeleton } from "../presentations/skeleton";
import { UserInfoContainer } from "./user-info-container";
import { isFinished } from "@/utils/loadable";
import { selectCurrentGameInvitationLink, selectCurrentGameName } from "@/status/selectors/game";
import { leaveGame } from "@/status/actions/game";

type Props = BaseProps;

const styles = {
  root: classNames("flex", "flex-none", "justify-between", "items-center", "p-4", "z-30"),
  right: classNames("flex", "flex-auto", "align-center", "justify-end"),
} as const;

// eslint-disable-next-line func-style
export function GameHeaderContainer(props: Props) {
  const gen = generateTestId(props.testid);
  const gameName = useAppSelector(selectCurrentGameName);
  const invitation = useAppSelector(selectCurrentGameInvitationLink);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isFinished(gameName) || !isFinished(invitation)) {
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

  return (
    <div className={styles.root} data-testid={gen("root")}>
      <GameInfo gameName={gameName[0]} onLeaveGame={handleLeaveGame} testid={gen("game-info")} />
      <div className={styles.right}>
        <InvitationLink invitationLink={invitation[0]} testid={gen("invitation")} />
        <UserInfoContainer testid={gen("user-info")} />
      </div>
    </div>
  );
}
