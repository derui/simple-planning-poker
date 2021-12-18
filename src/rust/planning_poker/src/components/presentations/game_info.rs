use yew::{function_component, html, Callback, Properties};

#[derive(Properties, PartialEq)]
pub struct Props {
    pub game_name: String,
    pub onleavegame: Callback<()>,
}

#[function_component(GameInfo)]
pub fn game_info(props: &Props) -> Html {
    html! {
    <main class="app__game__header__game-info">
      <div class="app__game__header__game-info__name-container">
        <span class="app__game__header__game-info__name-label">{ "Now voting" }</span>
        <span class="app__game__header__game-info__name"> {props.game_name.clone()}</span>
      </div>
      <div class="app__game__header__game-info__actions">
            <button class="app__game__header__game-info__actions__leave" onclick={props.onleavegame.reform(|_| ())}></button>
      </div>
    </main>
    }
}
