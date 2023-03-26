import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "@/components/hooks";
import { JoinedGameState } from "@/domains/game-repository";
import { selectCurrentGameId } from "@/status/selectors/game";
import { selectAllJoinedGames } from "@/status/selectors/user";

// eslint-disable-next-line func-style
export function KickedUserNavigator() {
  const gameId = useAppSelector(selectCurrentGameId);
  const joinedGames = useAppSelector(selectAllJoinedGames);
  const navigate = useNavigate();

  useEffect(() => {
    const joinedGame = joinedGames.find((v) => v.gameId === gameId);

    console.log(joinedGames, joinedGame);
    if (joinedGame && joinedGame.state === JoinedGameState.left) {
      navigate("/");
    }
  }, [joinedGames, gameId]);

  return null;
}
