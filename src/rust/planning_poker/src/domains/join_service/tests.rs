use std::{cell::RefCell, collections::HashMap};

use async_trait::async_trait;

use crate::{
    domains::{
        event::DomainEventKind,
        game::{Game, GameId, GameRepository},
        game_player::GamePlayerRepository,
        id::Id,
        invitation::InvitationSignature,
        selectable_cards::SelectableCards,
        story_point::StoryPoint,
        user::User,
    },
    utils::uuid_factory::DefaultUuidFactory,
};

use super::JoinService;

struct MockGameRepository {
    hash_map: RefCell<HashMap<GameId, Game>>,
}
impl MockGameRepository {
    fn new() -> Self {
        MockGameRepository {
            hash_map: RefCell::new(HashMap::new()),
        }
    }
}

unsafe impl Sync for MockGameRepository {}

#[async_trait]
impl GameRepository for MockGameRepository {
    async fn save(&self, game: &Game) {
        let mut v = self.hash_map.borrow_mut();
        v.insert(game.id(), game.clone());
    }

    async fn find_by(&self, _id: crate::domains::game::GameId) -> Option<Game> {
        todo!()
    }

    async fn find_by_invitation_signature(&self, signature: InvitationSignature) -> Option<Game> {
        let v = self.hash_map.borrow();
        v.iter()
            .find(|(_, g)| signature == InvitationSignature::new(g.id()))
            .map(|v| v.1.clone())
    }
}

struct MockGamePlayerRepository;
#[async_trait]
impl GamePlayerRepository for MockGamePlayerRepository {
    async fn save(&self, _player: &crate::domains::game_player::GamePlayer) {}

    async fn find_by(
        &self,
        _id: crate::domains::game_player::GamePlayerId,
    ) -> Option<crate::domains::game_player::GamePlayer> {
        todo!()
    }

    async fn find_by_user_and_game(
        &self,
        _user_id: crate::domains::user::UserId,
        _game_id: crate::domains::game::GameId,
    ) -> Option<crate::domains::game_player::GamePlayer> {
        todo!()
    }

    async fn delete(&self, _player: &crate::domains::game_player::GamePlayer) {
        todo!()
    }
}

#[tokio::test]
async fn do_not_invite_if_invitation_signature_is_invalid() {
    // arrange
    let default_uuid_factory = DefaultUuidFactory::new();
    let game_id = Id::create(&default_uuid_factory);
    let signature = InvitationSignature::new(game_id);
    let mock_game_repository = MockGameRepository::new();
    let user = User::new(Id::create(&default_uuid_factory), "name", &[]);

    let service = JoinService::new(
        Box::new(mock_game_repository),
        Box::new(MockGamePlayerRepository {}),
        Box::new(default_uuid_factory),
    );

    // do
    service
        .join(&user, signature, |_| panic!("do not send event"))
        .await

    // verify
}

#[tokio::test]
async fn invite_if_user_is_not_invited_yet() {
    // arrange
    let default_uuid_factory = DefaultUuidFactory::new();
    let game_id = Id::create(&default_uuid_factory);
    let signature = InvitationSignature::new(game_id);
    let mock_game_repository = MockGameRepository::new();
    let user_id = Id::create(&default_uuid_factory);
    let cards = SelectableCards::new(&vec![StoryPoint::new(2)]);
    let player_id = Id::create(&default_uuid_factory);
    let game = Game::new(game_id, "name", &[player_id], &cards);
    mock_game_repository.save(&game).await;

    let service = JoinService::new(
        Box::new(mock_game_repository),
        Box::new(MockGamePlayerRepository {}),
        Box::new(default_uuid_factory),
    );
    let user = User::new(user_id, "name", &[]);

    // do
    service
        .join(&user, signature, move |e| match e {
            DomainEventKind::UserInvited {
                game_id: given_game_id,
                user_id: given_user_id,
                ..
            } => {
                assert_eq!(given_game_id, game_id);
                assert_eq!(given_user_id, user_id);
            }
            _ => panic!("receive only UserInvited"),
        })
        .await

    // verify
}
