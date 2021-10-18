import { inGameActionContext } from "~/src/ts/contexts/actions";
import { gameObserverContext } from "~/src/ts/contexts/observer";
import { GameId } from "~/src/ts/domains/game";
import * as React from "react";
import { useParams } from "react-router";

export const GameObserverContainer: React.FunctionComponent<{}> = () => {
  const param = useParams<{ gameId: string }>();
  const inGameAction = React.useContext(inGameActionContext);
  const observer = React.useContext(gameObserverContext);
  const setCurrentGame = inGameAction.useSetCurrentGame(param.gameId as GameId);

  React.useEffect(() => {
    observer.subscribe(param.gameId as GameId, (game) => {
      setCurrentGame(game);
    });
    return () => {
      observer.unsubscribe();
    };
  }, [param.gameId]);

  return null;
};
