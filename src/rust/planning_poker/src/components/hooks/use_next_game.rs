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

pub fn use_next_game(game_id: &str) -> Callback<()> {
    let history = use_history().unwrap();

    let game_id = game_id.to_owned();
    Callback::once(move |_| {
        GlobalStatus::dispatcher().send(Actions::ForGame(GameActions::NextGame));
        history.push(Route::Game { id: game_id });
    })
}
