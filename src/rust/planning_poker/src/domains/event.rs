use domain_macro::DomainId;
use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

use super::{
    card::Card,
    game::GameId,
    game_player::{GamePlayerId, UserMode},
    id::{DomainId, Id},
    selectable_cards::SelectableCards,
    user::UserId,
};

#[derive(PartialEq, Debug, DomainId)]
pub struct EventId(Id<Uuid>);

#[derive(Debug, PartialEq)]
pub struct DomainEvent {
    id: EventId,
    kind: DomainEventKind,
}

#[derive(Debug, PartialEq)]
pub enum DomainEventKind {
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

impl DomainEvent {
    fn new(factory: &dyn UuidFactory, kind: DomainEventKind) -> Self {
        let id = Id::create(factory);
        Self { id, kind }
    }

    fn id(&self) -> &EventId {
        &self.id
    }

    fn kind(&self) -> &DomainEventKind {
        &self.kind
    }
}
