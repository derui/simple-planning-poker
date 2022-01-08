use yew::{use_effect, use_state, Callback};
use yew_agent::Bridged;

use crate::agents::{
    global_bus::Response,
    global_status::{GamePlayerProjection, GlobalStatus},
};

pub fn use_current_player() -> Option<GamePlayerProjection> {
    let state = use_state(|| None);

    let effect_state = state.clone();

    use_effect(|| {
        let bridge = GlobalStatus::bridge(Callback::from(move |msg| {
            if let Response::SnapshotUpdated(snapshot) = msg {
                effect_state.set(snapshot.current_game_player);
            }
        }));

        || drop(bridge)
    });

    (*state).clone()
}
