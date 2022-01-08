use yew::{use_effect, use_state, Callback};
use yew_agent::{Bridged, Dispatched};

use crate::agents::{
    global_bus::{Actions, GameActions, Response},
    global_status::{GameProjection, GlobalStatus},
};

pub fn use_join_user() -> Callback<String> {
    Callback::once(move |signature: String| {
        GlobalStatus::dispatcher().send(Actions::ForGame(GameActions::JoinUser(signature.clone())))
    })
}
