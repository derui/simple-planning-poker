use crate::domains::{game::GameId, id::Id, };
use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

#[test]
fn allow_create_id_with_uuid() {
    // arrange
    let f = || Uuid::parse_str("936DA01F9ABD4d9d80C702AF85C822A8").unwrap();
    let factory = UuidFactory::new(&f);

    // do
    let id = Id::create::<GameId>(&factory);

    // verify
    assert_eq!(id.to_string(), "936da01f-9abd-4d9d-80c7-02af85c822a8");
}
