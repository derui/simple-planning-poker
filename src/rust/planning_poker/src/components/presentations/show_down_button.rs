use yew::{function_component, html, Callback, Properties};

use crate::domains::game_player::UserMode;

#[derive(Properties, PartialEq)]
pub struct ShowDownButtonProps {
    pub user_mode: UserMode,
    pub onclick: Callback<()>,
}

#[function_component(ShowDownButton)]
pub fn show_down_button(props: &ShowDownButtonProps) -> Html {
    if props.user_mode == UserMode::Inspector {
        html! {<span class="app__game__main__game-management-button--waiting">{ "Inspecting..." }</span> }
    } else {
        html! {

        <button class="app__game__main__game-management-button--show-down" onclick={props.onclick.reform(|_| ())}>
          { "Show down!" }
        </button>
        }
    }
}
