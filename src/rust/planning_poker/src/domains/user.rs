use domain_macro::DomainId;
use uuid::Uuid;

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
    game: GameId,
    game_player: GamePlayerId,
}

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

    pub fn can_change_name(name: &str) -> bool {
        name.len() > 0
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
            .map(|v| v.clone())
    }

    pub fn leave_from<F>(&mut self, game_id: GameId, mut receiver: F)
    where
        F: FnMut(DomainEventKind) + 'static,
    {
        if let Some(game) = self.find_joined_game(game_id) {
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

            receiver(DomainEventKind::UserLeavedFromGame {
                game_id: game.game,
                game_player_id: game.game_player,
            })
        }
    }
}

/// Repository interface for [User]
pub trait UserRepository {
    fn save(user: &User);

    fn find_by(id: UserId) -> Option<User>;
}
