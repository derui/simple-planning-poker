use core::panic;

use domain_macro::DomainId;
use uuid::Uuid;

use super::{
    base::Entity,
    card::Card,
    event::DomainEventKind,
    game::GameId,
    id::{DomainId, Id},
    selectable_cards::SelectableCards,
    user::UserId,
};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Eq, Debug, DomainId, Copy, Clone, Hash)]
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

fn should_contains_hand(hand: &Option<Card>, cards: &SelectableCards) {
    match hand {
        Some(v) => {
            if !cards.contains(&v) {
                panic!("Can not take hand with not contained card")
            }
        }
        _ => (),
    }
}

impl GamePlayer {
    pub fn new(
        id: GamePlayerId,
        game: GameId,
        user: UserId,
        hand: Option<Card>,
        cards: &SelectableCards,
        mode: UserMode,
    ) -> Self {
        should_contains_hand(&hand, cards);

        Self {
            id,
            game,
            user,
            hand,
            mode,
            cards: cards.clone(),
        }
    }

    pub fn mode(&self) -> &UserMode {
        &self.mode
    }

    pub fn game(&self) -> &GameId {
        &self.game
    }

    pub fn hand(&self) -> Option<&Card> {
        match &self.hand {
            Some(v) => Some(&v),
            None => None,
        }
    }

    pub fn user(&self) -> &UserId {
        &self.user
    }

    pub fn change_user_mode<F>(&mut self, mode: UserMode, mut receiver: F)
    where
        F: FnMut(DomainEventKind) + 'static,
    {
        if mode == self.mode {
            return;
        }
        self.mode = mode;

        receiver(DomainEventKind::GamePlayerModeChanged {
            game_player_id: self.id,
            mode: self.mode.clone(),
        })
    }

    pub fn take_hand<F>(&mut self, card: Card, mut receiver: F)
    where
        F: FnMut(DomainEventKind) + 'static,
    {
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
