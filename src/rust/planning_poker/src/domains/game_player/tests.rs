use crate::{
    domains::{id::Id, selectable_cards::SelectableCards, story_point::StoryPoint},
    utils::uuid_factory::UuidFactory,
};

use super::GamePlayer;

#[test]
fn create_game_player() {
    // arrange
    let player_id = Id::create(&UuidFactory::default());
    let user_id = Id::create(&UuidFactory::default());
    let game_id = Id::create(&UuidFactory::default());
    let selectable_cards = SelectableCards::new(&vec![StoryPoint::new(1)]);

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
