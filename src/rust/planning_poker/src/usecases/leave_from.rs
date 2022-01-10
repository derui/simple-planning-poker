use crate::{
    domains::{
        game::GameId,
        user::{HaveUserRepository, UserId, UserRepository},
    },
    infrastructures::event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
    utils::types::LocalBoxFuture,
};

pub trait LeaveGameDependency: HaveUserRepository + HaveEventDispatcher {}

pub enum LeaveGameOutput {
    NotFound,
    LeaveFailed,
}

pub trait LeaveGame {
    fn execute(
        &self,
        game_id: GameId,
        user_id: UserId,
    ) -> LocalBoxFuture<'_, Result<(), LeaveGameOutput>>;
}

impl<T: LeaveGameDependency> LeaveGame for T {
    fn execute(
        &self,
        game_id: GameId,
        user_id: UserId,
    ) -> LocalBoxFuture<'_, Result<(), LeaveGameOutput>> {
        let repository = self.get_user_repository();
        let dispatcher = self.get_event_dispatcher();

        let fut = async move {
            let player = repository.find_by(user_id).await;

            if let Some(mut user) = player {
                let event = user.leave_from(game_id);
                repository.save(&user).await;

                if let Some(event) = event {
                    dispatcher.dispatch(&event);
                    Ok(())
                } else {
                    Err(LeaveGameOutput::LeaveFailed)
                }
            } else {
                Err(LeaveGameOutput::NotFound)
            }
        };

        Box::pin(fut)
    }
}
