use yew::Callback;
use yew_agent::Dispatched;

use crate::agents::{
    global_bus::{Actions, GameActions},
    global_status::GlobalStatus,
};

pub fn use_select_card() -> Callback<u32> {
    Callback::from(move |index| {
        GlobalStatus::dispatcher().send(Actions::ForGame(GameActions::SelectCard(index)))
    })
}
