use yew::{use_effect_with_deps, use_state, Callback};
use yew_agent::Bridged;

use crate::agents::{
    global_bus::{Actions, GameActions, Response},
    global_status::{GameProjection, GlobalStatus},
};

pub fn use_game(game_id: String) -> Option<GameProjection> {
    let state = use_state(|| None);

    let effect_state = state.clone();
    let dependency = game_id.clone();

    use_effect_with_deps(
        move |_| {
            let mut bridge = GlobalStatus::bridge(Callback::from(move |msg| {
                if let Response::SnapshotUpdated(snapshot) = msg {
                    effect_state.set(snapshot.current_game);
                }
            }));

            bridge.send(Actions::ForGame(GameActions::OpenGame(game_id)));
            || drop(bridge)
        },
        dependency,
    );

    (*state).clone()
}
