use std::{cell::RefCell, collections::HashMap};

use uuid::Uuid;

use crate::{
    domains::{
        event::DomainEventKind,
        game::{Game, GameId, GameRepository, HaveGameRepository},
        game_player::{GamePlayer, GamePlayerRepository, HaveGamePlayerRepository},
        id::Id,
        invitation::InvitationSignature,
        selectable_cards::SelectableCards,
        story_point::StoryPoint,
        user::User,
    },
    utils::{
        types::LocalBoxFuture,
        uuid_factory::{DefaultUuidFactory, HaveUuidFactory, UuidFactory},
    },
};

use super::{JoinService, JoinServiceDependency};

struct Mock {
    game_hash_map: RefCell<HashMap<GameId, Game>>,
}

unsafe impl Send for Mock {}

impl Mock {
    fn new() -> Self {
        Self {
            game_hash_map: RefCell::new(HashMap::new()),
        }
    }
}

impl UuidFactory for Mock {
    fn create(&self) -> uuid::Uuid {
        Uuid::new_v4()
    }
}

impl HaveGameRepository for Mock {
    type T = Self;

    fn get_game_repository(&self) -> &Self::T {
        self
    }
}
impl HaveGamePlayerRepository for Mock {
    type T = Self;

    fn get_game_player_repository(&self) -> &Self::T {
        self
    }
}
impl HaveUuidFactory for Mock {
    type T = Self;

    fn get_uuid_factory(&self) -> &Self::T {
        self
    }
}

impl GameRepository for Mock {
    fn save(&self, game: &Game) -> LocalBoxFuture<'static, ()> {
        let mut v = self.game_hash_map.borrow_mut();
        v.insert(game.id(), game.clone());

        Box::pin(async {})
    }

    fn find_by(&self, _id: GameId) -> LocalBoxFuture<'static, Option<Game>> {
        todo!()
    }

    fn find_by_invitation_signature(
        &self,
        signature: InvitationSignature,
    ) -> LocalBoxFuture<'static, Option<Game>> {
        let v = self.game_hash_map.borrow();
        let ret = v
            .iter()
            .find(|(_, g)| signature == InvitationSignature::new(g.id()))
            .map(|v| v.1.clone());

        Box::pin(async { ret })
    }
}

impl GamePlayerRepository for Mock {
    fn save(
        &self,
        _player: &crate::domains::game_player::GamePlayer,
    ) -> LocalBoxFuture<'static, ()> {
        let fut = async {};
        Box::pin(fut)
    }

    fn find_by(
        &self,
        _id: crate::domains::game_player::GamePlayerId,
    ) -> LocalBoxFuture<'static, Option<GamePlayer>> {
        todo!()
    }

    fn find_by_user_and_game(
        &self,
        _user_id: crate::domains::user::UserId,
        _game_id: crate::domains::game::GameId,
    ) -> LocalBoxFuture<'static, Option<GamePlayer>> {
        todo!()
    }

    fn delete(
        &self,
        _player: &crate::domains::game_player::GamePlayer,
    ) -> LocalBoxFuture<'static, ()> {
        todo!()
    }
}

impl JoinServiceDependency for Mock {}

#[tokio::test]
async fn do_not_invite_if_invitation_signature_is_invalid() {
    // arrange
    let default_uuid_factory = DefaultUuidFactory::default();
    let game_id = Id::create(&default_uuid_factory);
    let signature = InvitationSignature::new(game_id);
    let user = User::new(Id::create(&default_uuid_factory), "name", &[]);

    let service = Mock::new();

    // do
    service.join(&user, signature).await;

    // verify
}

#[tokio::test]
async fn invite_if_user_is_not_invited_yet() {
    // arrange
    let default_uuid_factory = DefaultUuidFactory::default();
    let game_id = Id::create(&default_uuid_factory);
    let signature = InvitationSignature::new(game_id);
    let user_id = Id::create(&default_uuid_factory);
    let cards = SelectableCards::new(&[StoryPoint::new(2)]);
    let player_id = Id::create(&default_uuid_factory);
    let game = Game::new(game_id, "name", &[player_id], &cards);
    let service = Mock::new();
    GameRepository::save(&service, &game).await;

    let user = User::new(user_id, "name", &[]);

    // do
    let event = service.join(&user, signature).await.unwrap();

    // verify
    match event {
        DomainEventKind::UserInvited {
            game_id: given_game_id,
            user_id: given_user_id,
            ..
        } => {
            assert_eq!(given_game_id, game_id);
            assert_eq!(given_user_id, user_id);
        }
        _ => panic!("receive only UserInvited"),
    }
}
