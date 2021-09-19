import { inGameActionContext } from "@/contexts/actions";
import * as React from "react";
import { useHistory, useParams } from "react-router-dom";

interface Props {}

export const InvitationContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ signature: string }>();
  const inGameActions = React.useContext(inGameActionContext);
  const joinUser = inGameActions.useJoinUser();
  const history = useHistory();

  React.useEffect(() => {
    joinUser(param.signature, (gameId) => history.replace(`/game/${gameId}`));
  }, [param.signature]);

  return <div className="app__invitation">Joining to the game...</div>;
};
