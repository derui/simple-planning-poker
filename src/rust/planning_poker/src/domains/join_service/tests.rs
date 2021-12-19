use std::{cell::RefCell, collections::HashMap, rc::Rc};

use crate::{
    domains::{
        event::DomainEventKind,
        game::{Game, GameId, GameRepository},
        game_player::{GamePlayer, GamePlayerRepository},
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

impl GameRepository for MockGameRepository {
    fn save(&self, game: &Game) {
        let mut v = self.hash_map.borrow_mut();
        v.insert(game.id(), game.clone());
    }

    fn find_by(&self, id: crate::domains::game::GameId) -> Option<Game> {
        todo!()
    }

    fn find_by_invitation_signature(&self, signature: InvitationSignature) -> Option<Game> {
        let v = self.hash_map.borrow();
        v.iter()
            .find(|(_, g)| signature == InvitationSignature::new(g.id()))
            .map(|v| v.1.clone())
    }
}

struct MockGamePlayerRepository;
impl GamePlayerRepository for MockGamePlayerRepository {
    fn save(&self, player: &crate::domains::game_player::GamePlayer) {}

    fn find_by(
        &self,
        id: crate::domains::game_player::GamePlayerId,
    ) -> Option<crate::domains::game_player::GamePlayer> {
        todo!()
    }

    fn find_by_user_and_game(
        &self,
        user_id: crate::domains::user::UserId,
        game_id: crate::domains::game::GameId,
    ) -> Option<crate::domains::game_player::GamePlayer> {
        todo!()
    }

    fn delete(&self, player: &crate::domains::game_player::GamePlayer) {
        todo!()
    }
}

#[test]
fn do_not_invite_if_invitation_signature_is_invalid() {
    // arrange
    let default_uuid_factory = DefaultUuidFactory::new();
    let game_id = Id::create(&default_uuid_factory);
    let signature = InvitationSignature::new(game_id);
    let mock_game_repository = MockGameRepository::new();
    let service = JoinService::new(
        &mock_game_repository,
        &MockGamePlayerRepository {},
        &default_uuid_factory,
    );
    let user = User::new(Id::create(&default_uuid_factory), "name", &[]);

    // do
    service.join(&user, signature, |_| panic!("do not send event"))

    // verify
}

#[test]
fn invite_if_user_is_not_invited_yet() {
    // arrange
    let default_uuid_factory = DefaultUuidFactory::new();
    let game_id = Id::create(&default_uuid_factory);
    let signature = InvitationSignature::new(game_id);
    let mock_game_repository = MockGameRepository::new();
    let user_id = Id::create(&default_uuid_factory);
    let cards = SelectableCards::new(&vec![StoryPoint::new(2)]);
    let player_id = Id::create(&default_uuid_factory);
    let game = Game::new(game_id, "name", &[player_id], &cards);
    mock_game_repository.save(&game);

    let service = JoinService::new(
        &mock_game_repository,
        &MockGamePlayerRepository {},
        &default_uuid_factory,
    );
    let user = User::new(user_id, "name", &[]);

    // do
    service.join(&user, signature, move |e| match e {
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

    // verify
}
