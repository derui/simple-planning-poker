import { inGameActionContext } from "@/contexts/actions";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

interface Props {}

export const InvitationContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ signature: string }>();
  const inGameActions = React.useContext(inGameActionContext);
  const joinUser = inGameActions.useJoinUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    joinUser(param.signature!!, (gameId) => navigate(`/game/${gameId}`, { replace: true }));
  }, [param.signature]);

  return (
    <div className="app__invitation">
      <div className="app__invitation__overlay"></div>
      <div className="app__invitation__dialog">
        <h3>Joining to the game...</h3>
      </div>
    </div>
  );
};
