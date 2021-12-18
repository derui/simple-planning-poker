use domain_macro::DomainId;
use uuid::Uuid;

use super::{
    base::Entity,
    card::{self, Card},
    event::{DomainEvent, DomainEventKind},
    game::GameId,
    id::{DomainId, Id},
    selectable_cards::SelectableCards,
    user::UserId,
};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug, DomainId, Copy, Clone)]
pub struct GamePlayerId(Id<Uuid>);

#[derive(Debug, PartialEq, Clone)]
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
#[derive(Debug, PartialEq)]
pub struct GamePlayer {
    id: GamePlayerId,
    mode: UserMode,
    game: GameId,
    user: UserId,
    hand: Option<Card>,
    cards: SelectableCards,
}

impl Entity<GamePlayerId> for GamePlayer {
    fn id(&self) -> GamePlayerId {
        self.id
    }
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

    fn mode(&self) -> &UserMode {
        &self.mode
    }

    fn game(&self) -> &GameId {
        &self.game
    }

    fn hand(&self) -> Option<&Card> {
        match &self.hand {
            Some(v) => Some(&v),
            None => None,
        }
    }

    fn user(&self) -> &UserId {
        &self.user
    }

    fn change_user_mode(
        &mut self,
        mode: UserMode,
        receiver: &mut dyn FnMut(DomainEventKind) -> (),
    ) {
        if mode == self.mode {
            return;
        }
        self.mode = mode;

        receiver(DomainEventKind::GamePlayerModeChanged {
            game_player_id: self.id,
            mode: self.mode.clone(),
        })
    }

    fn take_hand(&mut self, card: Card, receiver: &mut dyn FnMut(DomainEventKind) -> ()) {
        if !self.cards.contains(&card) {
            panic!(
                "Can not hand not in cards defined in the game: {}",
                self.game().to_string()
            );
        }

        self.hand = Some(card.clone());

        receiver(DomainEventKind::GamePlayerCardSelected {
            game_player_id: self.id,
            card: card.clone(),
        })
    }
}
