use domain_macro::DomainId;
use uuid::Uuid;

use crate::utils::types::LocalBoxFuture;

use super::{
    event::DomainEventKind,
    game::GameId,
    game_player::GamePlayerId,
    id::{DomainId, Id},
};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug, DomainId, Clone, Copy)]
pub struct UserId(Id<Uuid>);

#[derive(PartialEq, Debug, Clone)]
pub struct JoinedGame {
    pub game: GameId,
    pub game_player: GamePlayerId,
}

#[derive(PartialEq, Clone)]
pub struct User {
    id: UserId,
    name: String,
    joined_games: Vec<JoinedGame>,
}

impl User {
    pub fn new(id: UserId, name: &str, joined_games: &[JoinedGame]) -> Self {
        if !Self::can_change_name(name) {
            panic!("Can not use empty name");
        }

        Self {
            id,
            name: String::from(name),
            joined_games: Vec::from(joined_games),
        }
    }

    pub fn id(&self) -> UserId {
        self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn joined_games(&self) -> &[JoinedGame] {
        &self.joined_games
    }

    pub fn can_change_name(name: &str) -> bool {
        !name.is_empty()
    }

    pub fn change_name(&mut self, name: &str) {
        if !Self::can_change_name(name) {
            panic!("Can not change name")
        }

        self.name = String::from(name)
    }

    pub fn is_joined(&self, game_id: GameId) -> bool {
        self.find_joined_game(game_id).is_some()
    }

    pub fn find_joined_game(&self, game_id: GameId) -> Option<JoinedGame> {
        self.joined_games
            .iter()
            .find(|v| v.game == game_id)
            .cloned()
    }

    pub fn leave_from(&mut self, game_id: GameId) -> Option<DomainEventKind> {
        self.find_joined_game(game_id).map(|game| {
            let new_games = self
                .joined_games
                .iter()
                .filter_map(|v| {
                    if v.game != game.game {
                        Some(v.clone())
                    } else {
                        None
                    }
                })
                .collect::<Vec<JoinedGame>>();
            self.joined_games = new_games;

            DomainEventKind::UserLeavedFromGame {
                game_id: game.game,
                game_player_id: game.game_player,
            }
        })
    }
}

/// Repository interface for [User]
pub trait UserRepository {
    fn save<'a>(&'a self, user: &'a User) -> LocalBoxFuture<'a, ()>;

    fn find_by(&'_ self, id: UserId) -> LocalBoxFuture<'_, Option<User>>;
}

pub trait HaveUserRepository {
    type T: UserRepository;

    fn get_user_repository(&self) -> &Self::T;
}
