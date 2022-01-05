use yew::{function_component, html};
use yew_router::components::Link;

use crate::{agents::global_status::GameProjection, Route};

#[function_component(Empty)]
pub fn empty() -> Html {
    html! {
    <div class="app__game-selector__empty">
      <span class="app__game-selector__empty__text">{ "You do not have games that you are invited before." }</span>
    </div>
    }
}

#[function_component(GameSelectorContainer)]
pub fn game_selector_container() -> Html {
    let games: Vec<GameProjection> = Vec::new();
    let game_components = html! {<><a/></>};

    html! {
    <div class="app__game-selector">
      <header class="app__game-selector__header">{ "Select game you already joined" }</header>
            <main class="app__game-selector__main">{if !games.is_empty() { game_components } else { html! {<Empty />} }}</main>
      <footer class="app__game-selector__footer">
        <Link<Route> classes="app__game-selector__creator-opener" to={Route::CreateGame}>
            {"Create Game"}
        </Link<Route>>
      </footer>
    </div>
    }
}
