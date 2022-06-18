import { CardHolder } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { EmptyCardHolder } from "../presentations/empty-card-holder";
import { UserMode } from "@/domains/game-player";
import { GameId } from "@/domains/game";
import { gameActionsContext, GameActions } from "@/contexts/actions/game-actions";
import { userActionsContext } from "@/contexts/actions/user-actions";
import { GameArea } from "../presentations/game-area";
import { mapFuture } from "@/status/util";
import { Component, createEffect, Match, Switch, useContext } from "solid-js";
import { useNavigate, useParams } from "solid-app-router";
import { useGameSelectors } from "@/contexts/selectors/game-selectors";

interface Props {}

const createCardHolderComponent = ({ useSelectCard }: GameActions) => {
  const selectCard = useSelectCard();
  const { selectableCards, currentPlayerSelectedCard } = useGameSelectors();
  const cards = selectableCards().valueMaybe() ?? [];
  const selectedIndex = currentPlayerSelectedCard()?.valueMaybe()?.index;

  const props = {
    displays: cards.map((v) => {
      switch (v.kind) {
        case "giveup":
          return "?";
        case "storypoint":
          return v.storyPoint.value.toString();
      }
    }),
    selectedIndex: selectedIndex ?? null,
  };

  return (
    <CardHolder
      displays={props.displays}
      selectedIndex={props.selectedIndex}
      onClickCard={(index) => selectCard(index)}
    />
  );
};

export const GameContainer: Component<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = useContext(gameActionsContext);
  const component = createCardHolderComponent(gameActions);
  const selectors = useGameSelectors();
  const currentGameName = selectors.currentGameName();
  const userHands = selectors.userHands();
  const changeName = useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const currentUserInformation = selectors.currentPlayerInformation();
  const currentUserName = currentUserInformation.name;
  const currentUserMode = currentUserInformation.mode ?? UserMode.normal;
  const currentGameState = selectors.currentGame();
  const signature = currentGameState.valueMaybe()?.viewModel?.invitationSignature;
  const currentStatus = mapFuture(currentGameState, (v) => v.status);
  const openGame = gameActions.useOpenGame();
  const leaveGame = gameActions.useLeaveGame();
  const navigate = useNavigate();
  const showDown = gameActions.useShowDown();

  createEffect(() => {
    openGame(param.gameId as GameId, () => {
      navigate("/", { replace: true });
    });
  });

  createEffect(() => {
    if (currentStatus.valueMaybe() === "ShowedDown") {
      navigate(`/game/${param.gameId}/result`, { replace: true });
    }
  });

  return (
    <div class="app__game">
      <GameHeaderComponent
        gameName={currentGameName}
        userName={currentUserName || ""}
        userMode={currentUserMode}
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
        <GameArea onShowDown={showDown} gameStatus={currentStatus} lines={userHands} userMode={currentUserMode} />
      </main>
      <Switch>
        <Match when={currentUserMode === UserMode.normal}>{component}</Match>
        <Match when={currentUserMode !== UserMode.normal}>
          <EmptyCardHolder />
        </Match>
      </Switch>
    </div>
  );
};
