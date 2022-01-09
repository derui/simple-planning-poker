use yew::{use_effect_with_deps, use_state, Callback};
use yew_agent::Bridged;

use crate::agents::{
    global_bus::{Actions, Response},
    global_status::GlobalStatus,
    sign_in_action_reducer::CurrentUserStatusProjection,
};

pub fn use_current_user() -> Option<CurrentUserStatusProjection> {
    let state = use_state(|| None);

    let effect_state = state.clone();

    use_effect_with_deps(
        |_| {
            let mut bridge = GlobalStatus::bridge(Callback::from(move |msg| match msg {
                Response::SnapshotUpdated(snapshot) => {
                    effect_state.set(snapshot.current_user);
                }
                Response::SignedIn(data) => {
                    effect_state.set(Some(data));
                }
                _ => (),
            }));
            bridge.send(Actions::RequestSnapshot);

            || drop(bridge)
        },
        (),
    );

    (*state).clone()
}
