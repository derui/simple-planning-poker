use yew::{use_effect, use_state, Callback};
use yew_agent::Bridged;

use crate::agents::{
    global_bus::Response, global_status::GlobalStatus, sign_in_action_reducer::JoinedGameProjection,
};

pub fn use_joined_game() -> Vec<JoinedGameProjection> {
    let state = use_state(Vec::new);

    let effect_state = state.clone();

    use_effect(|| {
        let bridge = GlobalStatus::bridge(Callback::from(move |msg| match msg {
            Response::SignedIn(user) => {
                effect_state.set(user.joined_games);
            }
            Response::SnapshotUpdated(data) => {
                if let Some(user) = data.current_user {
                    effect_state.set(user.joined_games)
                };
            }
            _ => (),
        }));

        || drop(bridge)
    });

    (*state).clone()
}
