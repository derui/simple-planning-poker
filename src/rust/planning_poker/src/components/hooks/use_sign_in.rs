use yew::{use_effect, Callback};
use yew_agent::{Bridged, Dispatched};
use yew_router::{history::History, hooks::use_history};

use crate::{
    agents::{
        global_bus::{Actions, Response, SignInActions},
        global_status::GlobalStatus,
    },
    Route,
};

pub fn use_sign_in() -> Callback<(String, String)> {
    let history = use_history().unwrap();

    use_effect(|| {
        let bridge = GlobalStatus::bridge(Callback::from(move |msg| {
            if let Response::SignedIn(_) = msg {
                history.replace(Route::Selector)
            }
        }));
        || drop(bridge)
    });

    Callback::once(move |(email, password)| {
        GlobalStatus::dispatcher().send(Actions::ForSignIn(SignInActions::SignIn {
            email,
            password,
        }))
    })
}
