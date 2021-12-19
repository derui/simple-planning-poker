use core::panic;

use crate::{
    domains::{
        card::Card,
        event::DomainEventKind,
        game::{AveragePoint, Game, GameId},
        id::Id,
        selectable_cards::SelectableCards,
        story_point::StoryPoint,
    },
    utils::uuid_factory::{DefaultUuidFactory, FunctionUuidFactory},
};
use uuid::Uuid;

#[test]
fn allow_create_id_with_uuid() {
    // arrange
    let factory =
        FunctionUuidFactory::new(&|| Uuid::parse_str("936DA01F9ABD4d9d80C702AF85C822A8").unwrap());

    // do
    let id = Id::create::<GameId>(&factory);

    // verify
    assert_eq!(id.to_string(), "936da01f-9abd-4d9d-80c7-02af85c822a8");
}

#[test]
#[should_panic]
fn create_with_zero_player() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);

    // do
    Game::new(game_id, "value", &vec![], &cards);

    // verify
}

#[test]
fn can_not_average_when_no_showed_down() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let game = Game::new(
        game_id,
        "value",
        &vec![Id::create(&DefaultUuidFactory::new())],
        &cards,
    );

    // do
    let v = game.calculate_average();

    // verify
    assert_eq!(game.showed_down(), false);
    assert_eq!(v.is_err(), true);
}

#[test]
fn calculate_average_with_story_point() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let player_id = Id::create(&DefaultUuidFactory::new());
    let mut game = Game::new(game_id, "value", &vec![player_id], &cards);

    // do
    game.give_player_hand(player_id, &Card::storypoint(StoryPoint::new(1)));
    game.show_down(move |e| assert_eq!(e, DomainEventKind::GameShowedDown { game_id: game_id }));
    let v = game.calculate_average();

    // verify
    assert_eq!(v, Ok(AveragePoint(1.0)));
}

#[test]
#[should_panic]
fn give_incorrect_card_from_player() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let player_id = Id::create(&DefaultUuidFactory::new());
    let mut game = Game::new(game_id, "value", &vec![player_id], &cards);

    // do
    game.give_player_hand(player_id, &Card::storypoint(StoryPoint::new(2)));

    // verify
}

#[test]
fn next_game_if_showed_down() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let player_id = Id::create(&DefaultUuidFactory::new());
    let mut game = Game::new(game_id, "value", &vec![player_id], &cards);

    // do
    game.give_player_hand(player_id, &Card::storypoint(StoryPoint::new(1)));
    game.show_down(|_| {});
    game.next_game(move |e| assert_eq!(e, DomainEventKind::NewGameStarted { game_id: game_id }));
    let v = game.calculate_average();

    // verify
    assert_eq!(v.is_err(), true);
}

#[test]
fn next_game_do_not_raise_event() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let player_id = Id::create(&DefaultUuidFactory::new());
    let mut game = Game::new(game_id, "value", &vec![player_id], &cards);

    // do
    game.next_game(|_| panic!("call event why"));

    // verify
}

#[test]
fn change_name() {
    // arrange
    let game_id = Id::create::<GameId>(&DefaultUuidFactory::new());
    let cards = SelectableCards::new(&vec![StoryPoint::new(1)]);
    let player_id = Id::create(&DefaultUuidFactory::new());
    let mut game = Game::new(game_id, "value", &vec![player_id], &cards);

    // do
    game.change_name("foo");

    // verify
    assert_eq!(game.name(), "foo")
}

#[test]
fn can_change_name() {
    // arrange

    // do

    // verify
    assert_eq!(Game::can_change_name(""), false);
    assert_eq!(Game::can_change_name("a"), true);
}
