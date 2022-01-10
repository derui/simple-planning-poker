use yew::Callback;
use yew_agent::Dispatched;
use yew_router::{history::History, hooks::use_history};

use crate::{
    agents::{
        global_bus::{Actions, GameActions},
        global_status::GlobalStatus,
    },
    Route,
};

pub fn use_show_down() -> Callback<String> {
    let history = use_history().unwrap();

    Callback::from(move |game_id| {
        GlobalStatus::dispatcher().send(Actions::ForGame(GameActions::ShowDown));
        history.push(Route::GameResult { id: game_id })
    })
}
