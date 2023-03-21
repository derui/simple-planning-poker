import { useEffect } from "react";
import { generatePath, useNavigate, useParams } from "react-router";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Loader } from "../presentations/loader";
import { Overlay } from "../presentations/overlay";
import * as Game from "@/domains/game";
import { openGame } from "@/status/actions/game";
import { selectCurrentRoundId } from "@/status/selectors/game";

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
export function OpenGamePage() {
  const param = useParams<{ gameId: string }>();
  const dispatch = useAppDispatch();
  const currentRoundId = useAppSelector(selectCurrentRoundId);
  const navigate = useNavigate();

  useEffect(() => {
    if (param.gameId) {
      dispatch(openGame(param.gameId as Game.Id));
    }
  }, [param.gameId]);

  useEffect(() => {
    if (currentRoundId) {
      navigate(generatePath("/game/:gameId/round/:roundId", { gameId: param.gameId!, roundId: currentRoundId }));
    }
  }, [currentRoundId]);

  return (
    <div data-testid="root">
      <Overlay show={true} testid="overlay">
        <div className={styles.dialog}>
          <h3 className={styles.dialogHeader}>
            <Loader size="m" shown={true} testid={"loader"} />
            <span className={styles.dialogText}>
              Opening the game... <br /> Wait a moment, please
            </span>
          </h3>
        </div>
      </Overlay>
    </div>
  );
}

export default OpenGamePage;
