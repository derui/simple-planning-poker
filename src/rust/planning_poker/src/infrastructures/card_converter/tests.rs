use wasm_bindgen::JsValue;

use crate::{
    domains::card::Card,
    infrastructures::card_converter::{deserialize, serialize},
};

#[test]
fn should_be_able_to_serialize_and_deserialize_card() {
    // arrange
    let card = Card::giveup();

    // do
    let deserialized = serialize(&card);
    let ret = deserialize(&JsValue::from(deserialized));

    // verify
    assert_eq!(ret.unwrap(), card);
}
