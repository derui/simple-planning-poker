
use yew::{use_effect_with_deps, use_state, Callback};
use yew_agent::Bridged;

use crate::agents::{
    global_bus::{Actions, Response, SignInActions},
    global_status::GlobalStatus,
};

#[derive(PartialEq, Clone, Copy)]
pub enum AuthenticatedStatus {
    Authenticated,
    NotSignedIn,
    Checking,
}

pub fn use_authenticated() -> AuthenticatedStatus {
    let state = use_state(|| AuthenticatedStatus::Checking);

    let effect_state = state.clone();

    use_effect_with_deps(
        move |_| {
            let mut bridge = GlobalStatus::bridge(Callback::from(move |msg| {
                if let Response::Authenticated = msg {
                    effect_state.set(AuthenticatedStatus::Authenticated);
                } else if let Response::NotSignedIn = msg {
                    effect_state.set(AuthenticatedStatus::NotSignedIn);
                }
            }));
            bridge.send(Actions::ForSignIn(SignInActions::CheckCurrentAuth));

            || drop(bridge)
        },
        (),
    );

    *state
}
