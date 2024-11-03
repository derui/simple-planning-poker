import * as AppUrl from "@spp/shared-app-url";
import { Voting } from "@spp/shared-domain";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hooks } from "../../hooks/facade.js";
import { GameIndexLayout } from "./game-index.layout.js";

// eslint-disable-next-line func-style
export function GameIndex(): JSX.Element {
  const { loading, games, nextVotingId, startVoting } = hooks.useListGames();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextVotingId) {
      navigate(AppUrl.votingPage(Voting.createId(nextVotingId)));
    }
  }, [nextVotingId]);

  return <GameIndexLayout games={games} loading={loading == "loading"} onStartVoting={startVoting} />;
}
