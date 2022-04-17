import * as React from "react";
import { CardHolderComponent } from "../presentations/card-holder";
import { GameHeaderComponent } from "../presentations/game-header";
import { EmptyCardHolderComponent } from "../presentations/empty-card-holder";
import { UserMode } from "@/domains/game-player";
import { GameId } from "@/domains/game";
import { useNavigate, useParams } from "react-router";
import gameActionsContext, { GameActions } from "@/contexts/actions/game-actions";
import {
  useCurrentGameName,
  useCurrentGameState,
  useCurrentPlayerInformationState,
  useCurrentPlayerSelectedCardState,
  useSelectableCardsState,
  useUserHandsState,
} from "@/status/game/selectors";
import userActionsContext from "@/contexts/actions/user-actions";
import GameAreaComponent from "../presentations/game-area";
import { mapFuture } from "@/status/util";

interface Props {}

const createCardHolderComponent = ({ useSelectCard }: GameActions) => {
  const selectCard = useSelectCard();
  const cards = useSelectableCardsState().valueMaybe() ?? [];
  const selectedIndex = useCurrentPlayerSelectedCardState()?.valueMaybe()?.index;

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
    <CardHolderComponent
      displays={props.displays}
      selectedIndex={props.selectedIndex}
      onClickCard={(index) => selectCard(index)}
    />
  );
};

const GameContainer: React.FunctionComponent<Props> = () => {
  const param = useParams<{ gameId: string }>();
  const gameActions = React.useContext(gameActionsContext);
  const component = createCardHolderComponent(gameActions);
  const currentGameName = useCurrentGameName();
  const userHands = useUserHandsState();
  const changeName = React.useContext(userActionsContext).useChangeUserName();
  const changeMode = gameActions.useChangeUserMode();
  const currentUserInformation = useCurrentPlayerInformationState();
  const currentUserName = currentUserInformation.name;
  const currentUserMode = currentUserInformation.mode ?? UserMode.normal;
  const currentGameState = useCurrentGameState();
  const signature = currentGameState.valueMaybe()?.viewModel?.invitationSignature;
  const currentStatus = mapFuture(currentGameState, (v) => v.status);
  const openGame = gameActions.useOpenGame();
  const leaveGame = gameActions.useLeaveGame();
  const navigate = useNavigate();
  const showDown = gameActions.useShowDown();

  React.useEffect(() => {
    openGame(param.gameId as GameId, () => {
      navigate("/", { replace: true });
    });
  }, [param.gameId]);

  React.useEffect(() => {
    if (currentStatus.valueMaybe() === "ShowedDown") {
      navigate(`/game/${param.gameId}/result`, { replace: true });
    }
  }, [currentStatus.valueMaybe()]);

  let Component = <EmptyCardHolderComponent />;
  if (currentUserMode === UserMode.normal) {
    Component = component;
  }

  const onShowDown = () => {
    showDown();
  };

  return (
    <div className="app__game">
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
      <main className="app__game__main">
        <GameAreaComponent
          onShowDown={onShowDown}
          gameStatus={currentStatus}
          lines={userHands}
          userMode={currentUserMode}
        />
      </main>
      {Component}
    </div>
  );
};

export default GameContainer;
