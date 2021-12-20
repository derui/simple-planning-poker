use crate::domains::card::Card;

use super::SerializedCard;

#[test]
fn should_be_able_to_serialize_and_deserialize_card() {
    // arrange
    let card = Card::giveup();

    // do
    let deserialized = SerializedCard::serialize(&card);
    let ret = SerializedCard::deserialize(&deserialized);

    // verify
    assert_eq!(ret, card);
}
