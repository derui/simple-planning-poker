use planning_poker::{
    components::presentations::{average_point_showcase::AveragePointShowcase, types::CardCount},
    domains::story_point::StoryPoint,
};
use wasm_bindgen_test::wasm_bindgen_test;
use web_sys::MouseEvent;
use yew::{html, Callback};

use crate::common::{emit, mount, obtain_result_by_class};

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn should_be_able_to_print_empty_showcase() {
    let node = html! {
        <AveragePointShowcase card_counts={vec!()} average_point={0.0} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__average-point-showcase__results");
    assert_eq!(result.as_str(), "");
    let result = obtain_result_by_class("app__game__average-point-showcase__average-value");
    assert_eq!(result.as_str(), "0");
}

#[wasm_bindgen_test]
fn should_be_able_to_print_result() {
    let card_counts = vec![CardCount {
        story_point: StoryPoint::new(1),
        count: 3,
    }];
    let node = html! {
        <AveragePointShowcase card_counts={card_counts} average_point={0.0} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__result-display__card");
    assert_eq!(result.as_str(), "1");
    let result = obtain_result_by_class("app__game__result-display__count");
    assert_eq!(result.as_str(), "3 votes");
}
