use std::{cell::RefCell, collections::HashMap};

use crate::{
    domains::{
        game_player::{
            GamePlayer, GamePlayerId, GamePlayerRepository, HaveGamePlayerRepository, UserMode,
        },
        id::Id,
        selectable_cards::SelectableCards,
        story_point::StoryPoint,
    },
    usecases::change_user_mode::ChangeUserModeOutput,
    utils::uuid_factory::DefaultUuidFactory,
};

use super::{ChangeUserMode, ChangeUserModeDependency};

struct Mock {
    map: RefCell<HashMap<GamePlayerId, GamePlayer>>,
}
impl Mock {
    fn new() -> Self {
        Self {
            map: RefCell::new(HashMap::new()),
        }
    }
}

impl GamePlayerRepository for Mock {
    fn save<'a>(
        &'a self,
        player: &'a crate::domains::game_player::GamePlayer,
    ) -> crate::utils::types::LocalBoxFuture<'a, ()> {
        let mut map = self.map.borrow_mut();
        let player = player.clone();
        map.insert(player.id(), player);

        Box::pin(async {})
    }

    fn find_by(
        &self,
        id: crate::domains::game_player::GamePlayerId,
    ) -> crate::utils::types::LocalBoxFuture<'_, Option<crate::domains::game_player::GamePlayer>>
    {
        let result = self.map.borrow().get(&id).cloned();

        Box::pin(async move { result })
    }

    fn find_by_user_and_game(
        &self,
        _user_id: crate::domains::user::UserId,
        _game_id: crate::domains::game::GameId,
    ) -> crate::utils::types::LocalBoxFuture<'_, Option<crate::domains::game_player::GamePlayer>>
    {
        todo!()
    }

    fn delete<'a>(
        &'a self,
        _player: &'a crate::domains::game_player::GamePlayer,
    ) -> crate::utils::types::LocalBoxFuture<'a, ()> {
        todo!()
    }
}
impl HaveGamePlayerRepository for Mock {
    type T = Mock;

    fn get_game_player_repository(&self) -> &Self::T {
        self
    }
}

impl ChangeUserModeDependency for Mock {}

#[tokio::test]
async fn should_return_error_if_not_found() {
    // arrange
    let mock = Mock::new();
    let uuid_factory = DefaultUuidFactory::default();
    let game_player_id = Id::create(&uuid_factory);

    // do
    let output = mock.execute(game_player_id, UserMode::Normal).await;

    // verify
    assert_eq!(output, Err(ChangeUserModeOutput::NotFound))
}

#[tokio::test]
async fn should_be_change_mode() {
    // arrange
    let mock = Mock::new();
    let uuid_factory = DefaultUuidFactory::default();
    let game_player_id = Id::create(&uuid_factory);
    let game_id = Id::create(&uuid_factory);
    let user_id = Id::create(&uuid_factory);
    let cards = SelectableCards::new(&[StoryPoint::new(1)]);
    let game_player = GamePlayer::new(
        game_player_id,
        game_id,
        user_id,
        None,
        &cards,
        UserMode::Inspector,
    );
    GamePlayerRepository::save(&mock, &game_player).await;

    // do
    let output = mock.execute(game_player_id, UserMode::Normal).await;

    // verify
    assert_eq!(*output.unwrap().mode(), UserMode::Normal)
}
