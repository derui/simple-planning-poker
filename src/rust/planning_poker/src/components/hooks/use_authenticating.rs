use yew::{use_effect, use_state, Callback};
use yew_agent::Bridged;

use crate::agents::{global_bus::Response, global_status::GlobalStatus};

pub fn use_authenticating() -> bool {
    let state = use_state(|| false);

    let effect_state = state.clone();

    use_effect(|| {
        let bridge = GlobalStatus::bridge(Callback::from(move |msg| match msg {
            Response::Authenticated => {
                effect_state.set(false);
            }
            Response::Authenticating => {
                effect_state.set(true);
            }
            _ => (),
        }));

        || drop(bridge)
    });

    *state
}
