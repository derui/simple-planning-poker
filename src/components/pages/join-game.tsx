import { useEffect } from "react";
import { useParams } from "react-router";
import classNames from "classnames";
import { useAppDispatch } from "../hooks";
import { Loader } from "../presentations/loader";
import * as Invitation from "@/domains/invitation";
import { joinGame } from "@/status/actions/game";

const styles = {
  root: classNames("flex", "relative", "w-full", "h-full", "items-center", "justify-center"),
  overlay: classNames("absolute", "z-10", "bg-gray/20", "w-full", "h-full", "top-0", "left-0"),
  dialog: classNames("flex-[0_0_auto]", "border", "border-secondary1-400", "rounded", "p-3", "bg-white", "z-10"),
  dialogHeader: classNames("flex", "items-center"),
  dialogText: classNames("align-middle", "ml-2"),
} as const;

// eslint-disable-next-line func-style
export function JoinGamePage() {
  const param = useParams<{ signature: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (param.signature) {
      dispatch(joinGame(param.signature as Invitation.T));
    }
  }, [param.signature]);

  return (
    <div className={styles.root} data-testid="root">
      <div className={styles.overlay}></div>
      <div className={styles.dialog}>
        <h3 className={styles.dialogHeader}>
          <Loader size="m" shown={true} testid={"loader"} />
          <span className={styles.dialogText}>
            Joining to the game... <br /> Wait a moment, please
          </span>
        </h3>
      </div>
    </div>
  );
}
