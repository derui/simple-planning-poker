use crate::{
    domains::game::{GameId, GameRepository, HaveGameRepository},
    utils::types::LocalBoxFuture,
};

pub trait NewGameDependency: HaveGameRepository {}

#[derive(Debug, PartialEq)]
pub enum NewGameOutput {
    NotFound,
}

pub trait NewGame {
    fn execute(&self, game_id: GameId) -> LocalBoxFuture<'_, Result<(), NewGameOutput>>;
}

impl<T: NewGameDependency> NewGame for T {
    fn execute(&self, game_id: GameId) -> LocalBoxFuture<'_, Result<(), NewGameOutput>> {
        let repository = self.get_game_repository();

        let fut = async move {
            let game = repository.find_by(game_id).await;

            if let Some(mut game) = game {
                game.next_game();
                repository.save(&game).await;
                Ok(())
            } else {
                Err(NewGameOutput::NotFound)
            }
        };

        Box::pin(fut)
    }
}
