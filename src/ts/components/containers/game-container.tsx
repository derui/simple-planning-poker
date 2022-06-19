import { CardHolder } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { EmptyCardHolder } from "../presentations/empty-card-holder";
import { UserMode } from "@/domains/game-player";
import { GameId } from "@/domains/game";
import { gameActionsContext } from "@/contexts/actions/game-actions";
import { userActionsContext } from "@/contexts/actions/user-actions";
import { GameArea } from "../presentations/game-area";
import { Component, createEffect, Match, Switch, useContext } from "solid-js";
import { useNavigate, useParams } from "solid-app-router";
import { useGameSelectors } from "@/contexts/selectors/game-selectors";

interface Props {}

const CardHolderComponent = () => {
  const { useSelectCard } = useContext(gameActionsContext);
  const selectCard = useSelectCard();
  const { selectableCards, currentPlayerSelectedCard } = useGameSelectors();
  const displays = () => {
    const cards = selectableCards().valueMaybe() ?? [];
    return cards.map((v) => {
      switch (v.kind) {
        case "giveup":
          return "?";
        case "storypoint":
          return v.storyPoint.value.toString();
      }
    });
  };
  const selectedIndex = () => currentPlayerSelectedCard()?.valueMaybe()?.index ?? null;

  return (
    <CardHolder displays={displays()} selectedIndex={selectedIndex()} onClickCard={(index) => selectCard(index)} />
  );
};

export const GameContainer: Component<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = useContext(gameActionsContext);
  const { currentGameName, userHands, currentPlayerInformation, currentGame } = useGameSelectors();
  const changeName = useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const signature = currentGame()?.viewModel?.invitationSignature;
  const currentStatus = () => currentGame()?.status;
  const openGame = gameActions.useOpenGame();
  const leaveGame = gameActions.useLeaveGame();
  const navigate = useNavigate();
  const showDown = gameActions.useShowDown();

  const currentUserMode = () => {
    return currentPlayerInformation().mode ?? UserMode.normal;
  };

  const currentUserName = () => {
    return currentPlayerInformation().name ?? "";
  };

  createEffect(() => {
    openGame(param.gameId as GameId, () => {
      navigate("/", { replace: true });
    });
  });

  createEffect(() => {
    if (currentStatus() === "ShowedDown") {
      navigate(`/game/result/${param.gameId}`, { replace: true });
    }
  });

  return (
    <div class="app__game">
      <GameHeaderComponent
        gameName={currentGameName()}
        userName={currentUserName()}
        userMode={currentUserMode()}
        onChangeName={(name) => changeName(name)}
        onChangeMode={(mode) => changeMode(mode)}
        onLeaveGame={() => {
          leaveGame();
          navigate("/", { replace: true });
        }}
        origin={document.location.origin}
        invitationSignature={signature || ""}
      />
      <main class="app__game__main">
        <GameArea onShowDown={showDown} gameStatus={currentStatus()} lines={userHands()} userMode={currentUserMode()} />
      </main>
      <Switch>
        <Match when={currentUserMode() === UserMode.normal}>
          <CardHolderComponent />
        </Match>
        <Match when={currentUserMode() !== UserMode.normal}>
          <EmptyCardHolder />
        </Match>
      </Switch>
    </div>
  );
};
