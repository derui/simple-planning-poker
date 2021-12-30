use crate::{
    domains::{
        game::{GameId, GameRepository, HaveGameRepository},
        game_player::GamePlayerRepository,
        user::{HaveUserRepository, UserId, UserRepository},
    },
    infrastructures::event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
    utils::types::LocalBoxFuture,
};

pub trait NewGameDependency: HaveGameRepository + HaveEventDispatcher {}

pub enum NewGameOutput {
    NotFound,
    LeaveFailed,
}

pub trait NewGame {
    fn execute(&self, game_id: GameId) -> LocalBoxFuture<'_, Result<(), NewGameOutput>>;
}

impl<T: NewGameDependency> NewGame for T {
    fn execute(&self, game_id: GameId) -> LocalBoxFuture<'_, Result<(), NewGameOutput>> {
        let repository = self.get_game_repository();
        let dispatcher = self.get_event_dispatcher();

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
