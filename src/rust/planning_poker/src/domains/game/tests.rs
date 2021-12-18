use crate::domains::{
    game::{Game, GameId},
    id::Id,
    selectable_cards::SelectableCards,
    story_point::StoryPoint,
};
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

#[test]
#[should_panic]
fn create_with_zero_player() {
    // arrange
    let game_id = Id::create::<GameId>(&UuidFactory::default());
    let name = String::from("value");
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);

    // do
    Game::new(game_id, name, true, &vec![], &cards);

    // verify
}

#[test]
fn can_not_average_when_no_showed_down() {
    // arrange
    let game_id = Id::create::<GameId>(&UuidFactory::default());
    let name = String::from("value");
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let game = Game::new(
        game_id,
        name,
        false,
        &vec![Id::create(&UuidFactory::default())],
        &cards,
    );

    // do
    let v = game.calculate_average();

    // verify
    assert_eq!(game.showed_down(), false);
    assert_eq!(v.is_err(), true);
}

#[test]
fn can_not_average_when_no_hands() {
    // arrange
    let game_id = Id::create::<GameId>(&UuidFactory::default());
    let name = String::from("value");
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let game = Game::new(
        game_id,
        name,
        false,
        &vec![Id::create(&UuidFactory::default())],
        &cards,
    );

    // do
    let v = game.calculate_average();

    // verify
    assert_eq!(v.is_err(), true);
}
