use planning_poker::{
    components::presentations::{game_settings::GameSettings},
};
use wasm_bindgen_test::wasm_bindgen_test;

use web_sys::{HtmlElement, HtmlInputElement, MouseEvent};
use yew::html;

use crate::common::{emit, mount, obtain_element_by_class};

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn print_invitation_link() {
    let node = html! {
        <GameSettings origin={String::from("origin")} invitation_signature={String::from("sig")} />
    };
    mount(&node);

    let result = obtain_element_by_class::<HtmlInputElement>("app__game__game-settings__url");
    assert_eq!(result.value(), "origin/invitation/sig");
}

#[wasm_bindgen_test]
fn toggle_open_dialog() {
    let node = html! {
        <GameSettings origin={String::from("origin")} invitation_signature={String::from("sig")} />
    };
    mount(&node);
    emit(
        "app__game__game-settings__opener",
        &MouseEvent::new("click").unwrap(),
    );

    let opener = obtain_element_by_class::<HtmlElement>("app__game__game-settings__opener");
    let container = obtain_element_by_class::<HtmlElement>("app__game__game-settings__container");

    assert_eq!(opener.class_name().contains("--opened"), true);
    assert_eq!(container.class_name().contains("--opened"), true);
}
