use yew::{function_component, html, use_effect_with_deps, Callback, Properties};
use yew_agent::{use_bridge, Bridged};
use yew_router::{history::History, hooks::use_history};

use crate::{
    agents::{global_bus::Response, global_status::GlobalStatus},
    components::hooks::use_join_user,
    Route,
};

#[derive(Properties, PartialEq)]
pub struct InvitationContainerProps {
    pub signature: String,
}

#[function_component(InvitationContainer)]
pub fn invitation_container(props: &InvitationContainerProps) -> Html {
    let join_user = use_join_user();
    let history = use_history().unwrap();

    use_effect_with_deps(
        move |signature| {
            join_user.emit(signature.to_owned());

            GlobalStatus::bridge(Callback::from(move |msg| match msg {
                Response::SnapshotUpdated(s) => {
                    if let Some(game) = s.current_game {
                        history.replace(Route::Game {
                            id: game.id.clone(),
                        })
                    }
                }
                _ => (),
            }));

            || {}
        },
        props.signature.clone(),
    );

    html! {
    <div class="app__invitation">
      <div class="app__invitation__overlay"></div>
      <div class="app__invitation__dialog">
        <h3>{ "Joining to the game..." }</h3>
      </div>
    </div>
    }
}
