use planning_poker::{
    agents::global_status::CardProjection, components::presentations::player_hand::PlayerHand,
    components::presentations::types::NamePosition, domains::game_player::UserMode,
};
use wasm_bindgen_test::wasm_bindgen_test;
use yew::html;

use crate::common::{mount, obtain_result_by_class};

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn should_print_name() {
    let node = html! {
        <PlayerHand card={None} name_position={NamePosition::Lower}
            mode={UserMode::Normal} name={String::from("test")} showed_down={false} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__user-hand__user-name");
    assert_eq!(result.as_str(), "test");
}

#[wasm_bindgen_test]
fn should_print_giveup_card() {
    let node = html! {
        <PlayerHand card={None} name_position={NamePosition::Lower}
            mode={UserMode::Normal} name={String::from("test")} showed_down={true} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__user-hand__user-card");
    assert_eq!(result.as_str(), "?");
}

#[wasm_bindgen_test]
fn should_print_storypoint_card() {
    let card = Some(CardProjection::StoryPoint(5));
    let node = html! {
        <PlayerHand card={card} name_position={NamePosition::Lower}
            mode={UserMode::Normal} name={String::from("test")} showed_down={true} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__user-hand__user-card");
    assert_eq!(result.as_str(), "5");
}

#[wasm_bindgen_test]
fn should_print_eye_when_inspector() {
    let card = CardProjection::StoryPoint(5);
    let node = html! {
        <PlayerHand card={card} name_position={NamePosition::Lower}
            mode={UserMode::Inspector} name={String::from("test")} showed_down={false} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__user-hand__user-card__eye");
    assert_eq!(result.as_str(), "");
}

#[wasm_bindgen_test]
fn should_print_selected_if_it_selected() {
    let card = Some(CardProjection::StoryPoint(5));
    let node = html! {
        <PlayerHand card={card} name_position={NamePosition::Lower}
            mode={UserMode::Normal} name={String::from("test")} showed_down={false} />
    };
    mount(&node);

    let result = obtain_result_by_class("app__game__main__user-hand__user-card--handed");
    assert_eq!(result.as_str(), "");
}
