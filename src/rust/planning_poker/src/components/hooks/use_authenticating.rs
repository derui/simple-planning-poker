use yew::{use_effect, use_effect_with_deps, use_state, Callback};
use yew_agent::Bridged;
use yew_router::{
    history::{self, History},
    hooks::use_history,
};

use crate::{
    agents::{
        global_bus::{Actions, Response, SignInActions},
        global_status::GlobalStatus,
    },
    Route,
};

pub fn use_authenticating() -> bool {
    let history = use_history().unwrap();
    let state = use_state(|| false);

    let effect_state = state.clone();

    use_effect_with_deps(
        |()| {
            let mut bridge = GlobalStatus::bridge(Callback::from(move |msg| match msg {
                Response::Authenticated => {
                    effect_state.set(false);
                    history.replace(Route::Selector);
                }
                Response::Authenticating => {
                    effect_state.set(true);
                }
                _ => (),
            }));
            bridge.send(Actions::ForSignIn(SignInActions::CheckCurrentAuth));

            || drop(bridge)
        },
        (),
    );

    *state
}
