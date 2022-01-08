use yew::Callback;
use yew_agent::Dispatched;

use crate::agents::{
    global_bus::{Actions, GameActions},
    global_status::GlobalStatus,
};

pub fn use_show_down() -> Callback<()> {
    Callback::once(move |_| {
        GlobalStatus::dispatcher().send(Actions::ForGame(GameActions::ShowDown))
    })
}
