import { gameActionsContext } from "@/contexts/actions/game-actions";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createEffect, useContext } from "solid-js";

interface Props {}

export const InvitationContainer: Component<Props> = () => {
  const param = useParams<{ signature: string }>();
  const gameActions = useContext(gameActionsContext);
  const joinUser = gameActions.useJoinUser();
  const navigate = useNavigate();

  createEffect(() => {
    joinUser(param.signature!!, (gameId) => navigate(`/game/${gameId}`, { replace: true }));
  });

  return (
    <div class="app__invitation">
      <div class="app__invitation__overlay"></div>
      <div class="app__invitation__dialog">
        <h3>Joining to the game...</h3>
      </div>
    </div>
  );
};
