use yew::Callback;
use yew_agent::Dispatched;

use crate::agents::{
    global_bus::{Actions, GameActions},
    global_status::GlobalStatus,
};

pub fn use_join_user() -> Callback<String> {
    Callback::once(move |signature: String| {
        GlobalStatus::dispatcher().send(Actions::ForGame(GameActions::JoinUser(signature)))
    })
}
