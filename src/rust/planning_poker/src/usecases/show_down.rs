use crate::{
    domains::game::{GameId, GameRepository, HaveGameRepository},
    utils::types::LocalBoxFuture,
};

pub trait ShowDownDependency: HaveGameRepository {}

#[derive(Debug, Clone, PartialEq)]
pub enum ShowDownOutput {
    NotFound,
}

pub trait ShowDown {
    fn execute(&self, game_id: GameId) -> LocalBoxFuture<'_, Result<(), ShowDownOutput>>;
}

impl<T: ShowDownDependency> ShowDown for T {
    fn execute(&self, game_id: GameId) -> LocalBoxFuture<'_, Result<(), ShowDownOutput>> {
        let repository = self.get_game_repository();

        let fut = async move {
            let game = repository.find_by(game_id).await;

            if let Some(mut game) = game {
                game.show_down();

                repository.save(&game).await;

                Ok(())
            } else {
                Err(ShowDownOutput::NotFound)
            }
        };

        Box::pin(fut)
    }
}
