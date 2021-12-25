use planning_poker::{
    domains::card::Card,
    infrastructures::card_converter::{deserialize, serialize},
};
use wasm_bindgen_test::wasm_bindgen_test;

#[wasm_bindgen_test]
fn should_be_able_to_serialize_and_deserialize_card() {
    // arrange
    let card = Card::giveup();

    // do
    let serialized = serialize(&card);
    let ret = deserialize(&serialized);

    // verify
    assert_eq!(ret.expect("shoud be parseable"), card);
}
