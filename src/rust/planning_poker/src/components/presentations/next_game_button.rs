use yew::{function_component, html, Callback, Properties};

use crate::domains::game_player::UserMode;

#[derive(Properties, PartialEq)]
pub struct NextGameButtonProps {
    pub user_mode: UserMode,
    pub onclick: Callback<()>,
}

#[function_component(NextGameButton)]
pub fn next_game_button(props: &NextGameButtonProps) -> Html {
    if props.user_mode == UserMode::Inspector {
        html! {<span class="app__game__main__game-management-button--waiting">{ "Inspecting..." }</span> }
    } else {
        html! {

        <button class="app__game__main__game-management-button--next-game" onclick={props.onclick.reform(|_| ())}>
          { "Start next game" }
        </button>
        }
    }
}
