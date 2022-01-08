use yew::{function_component, html, Properties};
use yew_router::components::Link;

use crate::{components::hooks::use_joined_game, Route};

#[function_component(Empty)]
pub fn empty() -> Html {
    html! {
    <div class="app__game-selector__empty">
      <span class="app__game-selector__empty__text">{ "You do not have games that you are invited before." }</span>
    </div>
    }
}

#[derive(Properties, PartialEq)]
pub struct GameLinkProps {
    game_id: String,
    name: String,
}

#[function_component(GameLink)]
pub fn game_link(props: &GameLinkProps) -> Html {
    let key = props.game_id.clone();
    html! {
      <Link<Route> key={key} classes="app__game-selector__main__selection-container" to={Route::Game {id: props.game_id.clone()}}>
        <span class="app__game-selector__main__game-selector">{props.name.clone()}</span>
      </Link<Route>>
    }
}

#[function_component(GameSelectorContainer)]
pub fn game_selector_container() -> Html {
    let games = use_joined_game();
    let game_components = games
        .iter()
        .map(|v| {
            html! { <GameLink game_id={v.game_id.clone()} name={v.name.clone()} />}
        })
        .collect();
    let empty = vec![html! {<Empty />}];

    html! {
    <div class="app__game-selector">
      <header class="app__game-selector__header">{ "Select game you already joined" }</header>
            <main class="app__game-selector__main">
        {if !games.is_empty() { game_components } else { empty }}
        </main>
      <footer class="app__game-selector__footer">
        <Link<Route> classes="app__game-selector__creator-opener" to={Route::CreateGame}>
            {"Create Game"}
        </Link<Route>>
      </footer>
    </div>
    }
}
