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
        hooks::{use_current_player, use_current_user, use_game, use_next_game, use_select_card},
        presentations::{
            card_holder::CardHolder,
            empty_card_holder::EmptyCardHolder,
            game_info::GameInfo,
            game_settings::GameSettings,
            next_game_button::NextGameButton,
            player_hands::{PlayerHandProps, PlayerHands, Position},
            user_info::UserInfo,
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
struct NextButtonProps {
    game_id: String,
    user_mode: UserMode,
}

#[function_component(NextButton)]
fn next_button(props: &NextButtonProps) -> Html {
    let next_game = use_next_game(&props.game_id);
    let user_mode = props.user_mode.clone();

    html! { <NextGameButton user_mode={user_mode} onclick={next_game} /> }
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
                    showed_down: true,
                })
            }
        })
        .collect()
}

fn to_lower_hands(hands: &[GamePlayerProjection]) -> Vec<PlayerHandProps> {
    to_hands(hands, |index| index % 2 == 1)
}

#[derive(Properties, PartialEq)]
pub struct GameResultContainerProps {
    pub game_id: String,
}

#[function_component(GameResultContainer)]
pub fn game_result_container(props: &GameResultContainerProps) -> Html {
    let history = use_history().unwrap();
    let game = use_game(props.game_id.clone());
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

    if !game.showed_down {
        history.replace(Route::Game { id: game.id });
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
            <NextButton user_mode={user_mode.clone()} game_id={game.id.clone()} />
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
