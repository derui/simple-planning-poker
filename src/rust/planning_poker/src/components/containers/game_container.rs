use gloo_utils::document;
use yew::{function_component, html, use_effect_with_deps, Callback, Properties};
use yew_agent::Dispatched;
use yew_router::{history::History, hooks::use_history};

use crate::{
    agents::{
        global_bus::{Actions, GameActions},
        global_status::{CardProjection, GamePlayerProjection, GlobalStatus},
    },
    components::{
        hooks::{use_current_player, use_current_user, use_game, use_select_card, use_show_down},
        presentations::{
            card_holder::CardHolder,
            empty_card_holder::EmptyCardHolder,
            game_info::GameInfo,
            game_settings::GameSettings,
            player_hands::{PlayerHandProps, PlayerHands, Position},
            show_down_button::ShowDownButton,
            user_info::UserInfo,
            waiting_hand_button::WaitingHandButton,
        },
    },
    domains::game_player::UserMode,
    Route,
};

#[derive(Properties, PartialEq)]
struct CardHolderWrapperProps {
    pub user_mode: UserMode,
    pub cards: Vec<CardProjection>,
    pub player: GamePlayerProjection,
}

#[function_component(CardHolderWrapper)]
fn card_holder_wrapper(props: &CardHolderWrapperProps) -> Html {
    let select_card = use_select_card();

    if props.user_mode == UserMode::Inspector {
        return html! {<EmptyCardHolder />};
    }

    let story_points = props
        .cards
        .iter()
        .map(|v| match v {
            CardProjection::GiveUp => "?".to_owned(),
            CardProjection::StoryPoint(v) => v.to_string(),
        })
        .collect::<Vec<String>>();

    html! {
        <CardHolder story_points={story_points} selected_index={props.player.selected_index} onclickcard={select_card} />
    }
}

#[derive(Properties, PartialEq)]
struct ProgressionButtonProps {
    user_mode: UserMode,
    empty_hands: bool,
}

#[function_component(ProgressionButton)]
fn progression_button(props: &ProgressionButtonProps) -> Html {
    let show_down = use_show_down();
    let user_mode = props.user_mode.clone();

    if props.empty_hands {
        html! { <WaitingHandButton user_mode={user_mode} /> }
    } else {
        html! { <ShowDownButton user_mode={user_mode} onclick={show_down} /> }
    }
}

#[derive(Properties, PartialEq)]
pub struct GameContainerProps {
    pub game_id: String,
}

fn to_upper_hands(hands: &[GamePlayerProjection]) -> Vec<PlayerHandProps> {
    to_hands(hands, |index| index % 2 == 0)
}

fn to_hands<F>(hands: &[GamePlayerProjection], predicate: F) -> Vec<PlayerHandProps>
where
    F: Fn(usize) -> bool,
{
    hands
        .iter()
        .enumerate()
        .filter_map(|(index, v)| {
            if predicate(index) {
                None
            } else {
                Some(PlayerHandProps {
                    name: v.name.clone(),
                    mode: UserMode::from(v.mode.clone()),
                    card: v.card.clone(),
                    showed_down: false,
                })
            }
        })
        .collect()
}

fn to_lower_hands(hands: &[GamePlayerProjection]) -> Vec<PlayerHandProps> {
    to_hands(hands, |index| index % 2 == 1)
}

#[function_component(GameContainer)]
pub fn game_container(props: &GameContainerProps) -> Html {
    let history = use_history().unwrap();
    let game = use_game();
    let user = use_current_user();
    let player = use_current_player();

    use_effect_with_deps(
        |game_id| {
            GlobalStatus::dispatcher()
                .send(Actions::ForGame(GameActions::OpenGame(game_id.clone())));
            || {}
        },
        props.game_id.clone(),
    );
    match (&game, &player, &user) {
        (None, _, _) | (_, None, _) | (_, _, None) => return html! {},
        _ => (),
    };

    let game = game.unwrap();
    let player = player.unwrap();
    let user = user.unwrap();
    let user_mode = UserMode::from(player.mode.clone());
    let origin = document()
        .location()
        .expect("should be able to get location")
        .origin()
        .expect("should get origin");

    if game.showed_down {
        history.replace(Route::GameResult { id: game.id });
        return html! {};
    }

    html! {
    <div class="app__game">
    <div class="app__game__header">
            <GameInfo game_name={game.name.clone()} onleavegame={Callback::from(|_| {})} />
      <div class="app__game__header__right">
        <GameSettings origin={origin} invitation_signature={game.invitation_signature} />
        <UserInfo
          name={user.name.clone()}
        onchangename={Callback::from(|_| {})}
          mode={user_mode.clone()}
        onchangemode={Callback::from(|_| {})}
        />
      </div>
    </div>
      <main class="app__game__main">
        <div class="app__game__main__game-area">
          <div class="app__game__main__grid-container">
            <div class="app__game__main__upper-spacer"></div>
            <PlayerHands position={Position::Upper} user_hands={to_upper_hands(&game.hands)} />
            <div class="app__game__main__table">
            <ProgressionButton user_mode={user_mode.clone()} empty_hands={game.hands.is_empty()} />
            </div>
            <PlayerHands position={Position::Lower} user_hands={to_lower_hands(&game.hands)} />
            <div class="app__game__main__lower-spacer"></div>
          </div>
        </div>
      </main>
            <CardHolderWrapper player={player.clone()} cards={game.cards.clone()} user_mode={user_mode.clone()} />
    </div>
    }
}
