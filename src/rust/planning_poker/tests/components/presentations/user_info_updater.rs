use std::{borrow::BorrowMut, cell::RefCell, rc::Rc};

use planning_poker::components::presentations::{
    types::UserMode, user_info_updater::UserInfoUpdater,
};
use wasm_bindgen_test::wasm_bindgen_test;
use web_sys::{InputEvent, InputEventInit, MouseEvent};
use yew::{html, Callback};

use crate::common::{emit, mount};

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn update_name() {
    let name = Rc::new(RefCell::new(String::from("")));
    let onchangename = {
        let mut name = Rc::clone(&name);
        Callback::once(move |v: String| {
            let name = name.borrow_mut();
            name.replace(v);
        })
    };
    let node = html! {
        <UserInfoUpdater name={String::from("name")} mode={UserMode::Normal} onchangename={onchangename} onchangemode={Callback::from(move |_| ())} />
    };
    mount(&node);
    emit(
        "app__game__user-info-updater__name-editor__input",
        &InputEvent::new_with_event_init_dict(
            "input",
            InputEventInit::new()
                .data(Some("foo"))
                .bubbles(true)
                .cancelable(true),
        )
        .unwrap(),
    );
    emit(
        "app__game__user-info-updater__name-editor__submit",
        &MouseEvent::new("click").unwrap(),
    );

    assert_eq!(*name.borrow(), "foo");
}

#[wasm_bindgen_test]
fn update_password() {
    let mode = Rc::new(RefCell::new(UserMode::Inspector));
    let onchangename = {
        let mut name = Rc::clone(&mode);
        Callback::once(move |v| {
            let name = name.borrow_mut();
            name.replace(v);
        })
    };
    let node = html! {
        <UserInfoUpdater name={String::from("name")} mode={UserMode::Normal} onchangename={Callback::from(|_| ())} onchangemode={onchangename} />
    };
    mount(&node);
    emit(
        "app__game__user-info-updater__name-editor__input",
        &InputEvent::new_with_event_init_dict(
            "input",
            InputEventInit::new()
                .data(Some("foo"))
                .bubbles(true)
                .cancelable(true),
        )
        .unwrap(),
    );

    emit(
        "app__game__user-info-updater__mode-changer__switch__input",
        &MouseEvent::new("click").unwrap(),
    );

    emit(
        "app__game__user-info-updater__name-editor__submit",
        &MouseEvent::new("click").unwrap(),
    );

    assert_eq!(*mode.borrow(), UserMode::Inspector);
}
