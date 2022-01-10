use planning_poker::components::presentations::player_hands::{PlayerHands, Position};
use wasm_bindgen_test::wasm_bindgen_test;
use yew::html;

use crate::common::{mount, obtain_result_by_class};

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn should_print_upper() {
    let node = html! {
        <PlayerHands position={Position::Upper} user_hands={vec!()} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__users-in-upper");
    assert_eq!(result.as_str(), "");
}

#[wasm_bindgen_test]
fn should_print_lower() {
    let node = html! {
        <PlayerHands position={Position::Lower} user_hands={vec!()} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__users-in-lower");
    assert_eq!(result.as_str(), "");
}
