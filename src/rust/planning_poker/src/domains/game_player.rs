use core::panic;

use domain_macro::DomainId;
use uuid::Uuid;

use crate::utils::types::LocalBoxFuture;

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

impl From<String> for UserMode {
    fn from(v: String) -> Self {
        let v = v.as_str();
        match v {
            "inspector" => UserMode::Inspector,
            "normal" => UserMode::Normal,
            _ => panic!("Can not convert"),
        }
    }
}

impl ToString for UserMode {
    fn to_string(&self) -> String {
        match *self {
            UserMode::Inspector => String::from("inspector"),
            UserMode::Normal => String::from("normal"),
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
    if let Some(v) = hand {
        if !cards.contains(v) {
            panic!("Can not take hand with not contained card")
        }
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

    pub fn id(&self) -> GamePlayerId {
        self.id
    }

    pub fn mode(&self) -> &UserMode {
        &self.mode
    }

    pub fn game(&self) -> &GameId {
        &self.game
    }

    pub fn hand(&self) -> Option<&Card> {
        match &self.hand {
            Some(v) => Some(v),
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

    pub fn take_hand(&mut self, card: Card) -> DomainEventKind {
        if !self.cards.contains(&card) {
            panic!(
                "Can not hand not in cards defined in the game: {}",
                self.game().to_string()
            );
        }

        self.hand = Some(card.clone());

        DomainEventKind::GamePlayerCardSelected {
            game_player_id: self.id,
            card,
        }
    }
}

/// Repository interface for [GamePlayer]

pub trait GamePlayerRepository {
    fn save<'a>(&'a self, player: &'a GamePlayer) -> LocalBoxFuture<'a, ()>;

    fn find_by(&self, id: GamePlayerId) -> LocalBoxFuture<'_, Option<GamePlayer>>;

    fn find_by_user_and_game(
        &self,
        user_id: UserId,
        game_id: GameId,
    ) -> LocalBoxFuture<'_, Option<GamePlayer>>;

    fn delete<'a>(&'a self, player: &'a GamePlayer) -> LocalBoxFuture<'a, ()>;
}

pub trait GamePlayerRepositoryDep {}

pub trait HaveGamePlayerRepository {
    type T: GamePlayerRepository;

    fn get_game_player_repository(&self) -> &Self::T;
}
