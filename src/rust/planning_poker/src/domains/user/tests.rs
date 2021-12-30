use crate::{domains::id::Id, utils::uuid_factory::DefaultUuidFactory};

use super::*;

#[test]
#[should_panic]
fn can_not_create_with_empty_name() {
    // arrange
    let id = Id::create(&DefaultUuidFactory::default());

    // do
    User::new(id, "", &[]);

    // verify
}

#[test]
fn create_user() {
    // arrange
    let id = Id::create(&DefaultUuidFactory::default());

    // do
    let user = User::new(id, "name", &[]);

    // verify
    assert_eq!(user.id(), id);
    assert_eq!(user.name(), "name")
}

#[test]
fn change_name() {
    // arrange
    let id = Id::create(&DefaultUuidFactory::default());
    let mut user = User::new(id, "name", &[]);

    // do
    user.change_name("name2");

    // verify
    assert_eq!(user.name(), "name2")
}

#[test]
#[should_panic]
fn can_not_change_name() {
    // arrange
    let id = Id::create(&DefaultUuidFactory::default());
    let mut user = User::new(id, "name", &[]);

    // do
    user.change_name("");

    // verify
}

#[test]
fn can_change_name() {
    // arrange

    // do

    // verify
    assert!(!User::can_change_name(""));
    assert!(User::can_change_name("a"));
}

#[cfg(test)]
mod joined_game {
    use crate::domains::user::JoinedGame;

    use super::*;

    #[test]
    fn is_joined_for_joined_game() {
        // arrange
        let id = Id::create(&DefaultUuidFactory::default());
        let game_id = Id::create(&DefaultUuidFactory::default());
        let player_id = Id::create(&DefaultUuidFactory::default());
        let user = User::new(
            id,
            "name",
            &[JoinedGame {
                game: game_id,
                game_player: player_id,
            }],
        );

        // do
        let ret = user.is_joined(game_id);

        // verify
        assert!(ret)
    }

    #[test]
    fn is_joined_for_not_joined_game() {
        // arrange
        let id = Id::create(&DefaultUuidFactory::default());
        let game_id = Id::create(&DefaultUuidFactory::default());
        let user = User::new(id, "name", &[]);

        // do
        let ret = user.is_joined(game_id);

        // verify
        assert!(!ret)
    }

    #[test]
    fn find_joined_game() {
        // arrange
        let id = Id::create(&DefaultUuidFactory::default());
        let game_id = Id::create(&DefaultUuidFactory::default());
        let player_id = Id::create(&DefaultUuidFactory::default());
        let joined_game = JoinedGame {
            game: game_id,
            game_player: player_id,
        };
        let user = User::new(id, "name", &[joined_game.clone()]);

        // do
        let ret = user.find_joined_game(game_id);

        // verify
        assert_eq!(ret, Some(joined_game))
    }
}

mod leave_game {
    use super::*;

    #[test]
    fn leave_from_joined_game() {
        // arrange
        let id = Id::create(&DefaultUuidFactory::default());
        let game_id = Id::create(&DefaultUuidFactory::default());
        let player_id = Id::create(&DefaultUuidFactory::default());
        let joined_game = JoinedGame {
            game: game_id,
            game_player: player_id,
        };
        let mut user = User::new(id, "name", &[joined_game]);

        // do
        user.leave_from(game_id, move |e| {
            assert_eq!(
                e,
                DomainEventKind::UserLeavedFromGame {
                    game_id,
                    game_player_id: player_id
                }
            )
        });

        // verify
    }

    #[test]
    fn leave_from_not_joined_game() {
        // arrange
        let id = Id::create(&DefaultUuidFactory::default());
        let game_id = Id::create(&DefaultUuidFactory::default());
        let mut user = User::new(id, "name", &[]);

        // do
        user.leave_from(game_id, move |_| panic!("do not call receiver"));

        // verify
    }
}
