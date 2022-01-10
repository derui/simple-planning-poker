use planning_poker::components::presentations::selectable_card::SelectableCard;
use wasm_bindgen_test::wasm_bindgen_test;
use web_sys::MouseEvent;
use yew::{html, Callback};

use crate::common::{emit, mount, obtain_result_by_class};

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn should_print_story_point() {
    let node = html! {
        <SelectableCard story_point={String::from("1")} selected={false} onclick={Callback::from(move |_| ())} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__selectable-card__storypoint");
    assert_eq!(result.as_str(), "1");
}

#[wasm_bindgen_test]
fn mark_as_selected() {
    let node = html! {
        <SelectableCard story_point={String::from("1")} selected={true} onclick={Callback::from(move |_| ())} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__selectable-card--selected");
    assert_ne!(result.as_str(), "");
}

#[wasm_bindgen_test]
fn callback_onclick() {
    static mut VALUE: u32 = 0;

    let node = html! {
        <SelectableCard story_point={String::from("1")} selected={true} onclick={Callback::from(move |_| unsafe {
            VALUE += 1
        })} />
    };
    mount(&node);

    emit(
        "app__game__selectable-card",
        &MouseEvent::new("click").unwrap(),
    );
    unsafe {
        assert_eq!(VALUE, 1);
    }
}
