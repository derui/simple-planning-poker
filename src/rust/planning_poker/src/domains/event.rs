use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

use super::{
    card::Card,
    game::GameId,
    game_player::{GamePlayerId, UserMode},
    id::Id,
    selectable_cards::SelectableCards,
    user::UserId,
};

#[derive(PartialEq, Debug)]
pub struct EventId(Id<Uuid>);

impl EventId {
    pub fn new(uuid_factory: UuidFactory) -> Self {
        let v = uuid_factory.create();

        Self(Id::new(v))
    }
}

impl ToString for EventId {
    fn to_string(&self) -> String {
        format!("{}", self.0.to_string())
    }
}

#[derive(Debug, PartialEq)]
pub struct DomainEvent {
    id: EventId,
    kind: DomainEventKind,
}

#[derive(Debug, PartialEq)]
enum DomainEventKind {
    GameCreated {
        game_id: GameId,
        name: String,
        created_user_id: UserId,
        created_game_player_id: GamePlayerId,
        selectable_cards: SelectableCards,
    },
    NewGameStarted {
        game_id: GameId,
    },
    UserNameChanged {
        user_id: UserId,
        name: String,
    },
    GamePlayerModeChanged {
        game_player_id: GamePlayerId,
        mode: UserMode,
    },
    GameShowedDown {
        game_id: GameId,
    },
    UserInvited {
        game_id: GameId,
        user_id: UserId,
        game_player_id: GamePlayerId,
    },
    GamePlayerCardSelected {
        game_player_id: GamePlayerId,
        card: Card,
    },
    UserLeavedFromGame {
        game_player_id: GamePlayerId,
        game_id: GameId,
    },
}
