use yew::{function_component, html, Properties};

use crate::domains::game_player::UserMode;

#[derive(Properties, PartialEq)]
pub struct WaitingHandButtonProps {
    pub user_mode: UserMode,
}

#[function_component(WaitingHandButton)]
pub fn waiting_hand_button(props: &WaitingHandButtonProps) -> Html {
    if props.user_mode == UserMode::Inspector {
        html! {<span class="app__game__main__game-management-button--waiting">{ "Inspecting..." }</span> }
    } else {
        html! {
        <span class="app__game__main__game-management-button--waiting">{ "Waiting to select card..." }</span>
                }
    }
}
