import { useEffect } from "react";
import { generatePath, useNavigate, useParams } from "react-router";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Loader } from "../presentations/loader";
import { Overlay } from "../presentations/overlay";
import * as Invitation from "@/domains/invitation";
import { joinGame } from "@/status/actions/game";
import { selectCurrentGameId, selectCurrentRoundId } from "@/status/selectors/game";

const styles = {
  dialog: classNames(
    "flex-[0_0_auto]",
    "border",
    "border-secondary1-400",
    "rounded",
    "p-3",
    "bg-white",
    "z-10",
    "shadow"
  ),
  dialogHeader: classNames("flex", "items-center"),
  dialogText: classNames("align-middle", "ml-2"),
} as const;

// eslint-disable-next-line func-style
export function JoinGamePage() {
  const param = useParams<{ signature: string }>();
  const dispatch = useAppDispatch();
  const currentRoundId = useAppSelector(selectCurrentRoundId);
  const currentGameId = useAppSelector(selectCurrentGameId);
  const navigate = useNavigate();

  useEffect(() => {
    if (param.signature) {
      dispatch(joinGame(param.signature as Invitation.T));
    }
  }, [param.signature]);

  useEffect(() => {
    if (currentGameId && currentRoundId) {
      navigate(generatePath("/game/:gameId/round/:roundId", { gameId: currentGameId, roundId: currentRoundId }));
    }
  }, [currentRoundId, currentGameId]);

  return (
    <div data-testid="root">
      <Overlay show={true} testid="overlay">
        <div className={styles.dialog}>
          <h3 className={styles.dialogHeader}>
            <Loader size="m" shown={true} testid={"loader"} />
            <span className={styles.dialogText}>
              Joining to the game... <br /> Wait a moment, please
            </span>
          </h3>
        </div>
      </Overlay>
    </div>
  );
}

export default JoinGamePage;
