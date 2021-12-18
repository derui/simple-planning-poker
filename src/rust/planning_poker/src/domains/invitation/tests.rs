use crate::domains::{id::Id, invitation::Invitation};
use uuid::Uuid;

use crate::{domains::game::GameId, utils::uuid_factory::UuidFactory};

#[test]
fn create_signature_from_game_id() {
    // arrange
    let factory =
        UuidFactory::new(&|| Uuid::parse_str("936DA01F9ABD4d9d80C702AF85C822A8").unwrap());
    let game_id = Id::create::<GameId>(&factory);
    let game_id2 = Id::create::<GameId>(&factory);

    // do
    let invitation = Invitation::new(game_id);

    // verify
    assert_eq!(invitation.game_id(), &game_id2);
    assert_eq!(
        invitation.signature().to_string(),
        "66b4d84b49acf377cebe847c3807b62a96fd4b346c041d22baf73565fa324904"
    )
}
