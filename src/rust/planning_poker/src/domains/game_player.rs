use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

use super::{card::Card, game::GameId, id::Id, selectable_cards::SelectableCards, user::UserId};

#[derive(PartialEq, Debug)]
pub struct GamePlayerId(Id<Uuid>);

impl GamePlayerId {
    pub fn new(uuid_factory: UuidFactory) -> Self {
        let v = uuid_factory.create();

        Self(Id::new(v))
    }
}

impl ToString for GamePlayerId {
    fn to_string(&self) -> String {
        format!("{}", self.0.to_string())
    }
}

#[derive(Debug, PartialEq)]
pub enum UserMode {
    Inspector,
    Normal,
}

impl ToString for UserMode {
    fn to_string(&self) -> String {
        match self {
            &UserMode::Inspector => String::from("inspector"),
            &UserMode::Normal => String::from("normal"),
        }
    }
}

// Game player entity
pub struct GamePlayer {
    id: GamePlayerId,
    mode: UserMode,
    game: GameId,
    user: UserId,
    hand: Option<Card>,
    cards: SelectableCards,
}

impl GamePlayer {
    fn new(
        id: GamePlayerId,
        game: GameId,
        user: UserId,
        hand: Option<Card>,
        cards: &SelectableCards,
        mode: UserMode,
    ) -> Self {
        Self {
            id,
            game,
            user,
            hand,
            mode,
            cards: cards.clone(),
        }
    }
}
