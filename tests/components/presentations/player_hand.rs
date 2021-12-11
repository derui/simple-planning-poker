use planning_poker::{components::presentations::player_hand::*, domains::card::Card};
use wasm_bindgen_test::wasm_bindgen_test;
use yew::{html, FunctionComponent, FunctionProvider, Html};

use crate::common::obtain_result_by_class;

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn use_state_eq_works() {
    struct UseStateFunction {}

    impl FunctionProvider for UseStateFunction {
        type TProps = ();

        fn run(_: &Self::TProps) -> Html {
            // No race conditions will be caused since its only used in one place

            return html! {
                    <div id="output">
            <PlayerHand card={Card::giveup()} name_position={NamePosition::Lower}
            mode={UserMode::Normal} name={String::from("test")} selected={false} showed_down={false} />
                    </div>
                };
        }
    }
    type UseComponent = FunctionComponent<UseStateFunction>;
    yew::start_app_in_element::<UseComponent>(
        gloo_utils::document().get_element_by_id("output").unwrap(),
    );

    let result = obtain_result_by_class("app__game__main__user-hand");
    assert_eq!(result.as_str(), "1");
}
