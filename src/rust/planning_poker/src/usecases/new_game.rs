use crate::{
    domains::{
        event::DomainEventKind,
        game::{GameId, GameRepository, HaveGameRepository},
    },
    infrastructures::event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
    utils::types::LocalBoxFuture,
};

pub trait NewGameDependency: HaveGameRepository + HaveEventDispatcher {}

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
        let dispatcher = self.get_event_dispatcher();

        let fut = async move {
            let game = repository.find_by(game_id).await;

            if let Some(mut game) = game {
                game.next_game();
                repository.save(&game).await;

                dispatcher.dispatch(&DomainEventKind::NewGameStarted { game_id: game.id() });
                Ok(())
            } else {
                Err(NewGameOutput::NotFound)
            }
        };

        Box::pin(fut)
    }
}
