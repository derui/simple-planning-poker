use crate::{
    domains::{
        card::Card, event::DomainEventKind, game_player::UserMode, id::Id,
        selectable_cards::SelectableCards, story_point::StoryPoint,
    },
    utils::uuid_factory::DefaultUuidFactory,
};

use super::GamePlayer;

#[test]
fn create_game_player() {
    // arrange
    let player_id = Id::create(&DefaultUuidFactory::default());
    let user_id = Id::create(&DefaultUuidFactory::default());
    let game_id = Id::create(&DefaultUuidFactory::default());
    let selectable_cards = SelectableCards::new(&[StoryPoint::new(1)]);

    // do
    let player = GamePlayer::new(
        player_id,
        game_id,
        user_id,
        None,
        &selectable_cards,
        super::UserMode::Inspector,
    );

    // verify
    assert_eq!(player.id, player_id);
    assert_eq!(player.game(), &game_id);
    assert_eq!(player.user(), &user_id);
    assert_eq!(player.hand(), None);
}

#[test]
#[should_panic]
fn not_contains_card_handed() {
    // arrange
    let player_id = Id::create(&DefaultUuidFactory::default());
    let user_id = Id::create(&DefaultUuidFactory::default());
    let game_id = Id::create(&DefaultUuidFactory::default());
    let selectable_cards = SelectableCards::new(&[StoryPoint::new(1)]);

    // do
    GamePlayer::new(
        player_id,
        game_id,
        user_id,
        Some(Card::storypoint(StoryPoint::new(3))),
        &selectable_cards,
        super::UserMode::Inspector,
    );

    // verify
}

#[test]
fn change_mode() {
    // arrange
    let player_id = Id::create(&DefaultUuidFactory::default());
    let user_id = Id::create(&DefaultUuidFactory::default());
    let game_id = Id::create(&DefaultUuidFactory::default());
    let selectable_cards = SelectableCards::new(&[StoryPoint::new(1)]);
    let mut player = GamePlayer::new(
        player_id,
        game_id,
        user_id,
        None,
        &selectable_cards,
        super::UserMode::Inspector,
    );

    // do
    let callback = move |e| {
        assert_eq!(
            e,
            DomainEventKind::GamePlayerModeChanged {
                game_player_id: player_id,
                mode: UserMode::Normal
            }
        )
    };
    player.change_user_mode(super::UserMode::Normal, callback);

    // verify
    assert_eq!(player.mode(), &super::UserMode::Normal);
}

#[test]
#[should_panic]
fn can_not_take_card_not_contained_game() {
    // arrange
    let player_id = Id::create(&DefaultUuidFactory::default());
    let user_id = Id::create(&DefaultUuidFactory::default());
    let game_id = Id::create(&DefaultUuidFactory::default());
    let selectable_cards = SelectableCards::new(&[StoryPoint::new(1)]);
    let mut player = GamePlayer::new(
        player_id,
        game_id,
        user_id,
        None,
        &selectable_cards,
        super::UserMode::Inspector,
    );

    // do
    let callback = |_| {};
    player.take_hand(Card::storypoint(StoryPoint::new(3)), callback);

    // verify
}

#[test]
fn take_card() {
    // arrange
    let player_id = Id::create(&DefaultUuidFactory::default());
    let user_id = Id::create(&DefaultUuidFactory::default());
    let game_id = Id::create(&DefaultUuidFactory::default());
    let selectable_cards = SelectableCards::new(&[StoryPoint::new(1)]);
    let mut player = GamePlayer::new(
        player_id,
        game_id,
        user_id,
        None,
        &selectable_cards,
        super::UserMode::Inspector,
    );

    // do
    let callback = move |e| {
        assert_eq!(
            e,
            DomainEventKind::GamePlayerCardSelected {
                game_player_id: player_id,
                card: selectable_cards.at(0).unwrap().clone()
            }
        )
    };
    player.take_hand(Card::storypoint(StoryPoint::new(1)), callback);

    // verify
    assert_eq!(player.hand(), Some(&Card::storypoint(StoryPoint::new(1))));
}
