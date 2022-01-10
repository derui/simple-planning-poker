use gloo::console::console_dbg;

use crate::{
    domains::{
        event::DomainEventKind,
        game_player::GamePlayerId,
        invitation::InvitationSignature,
        join_service::{HaveJoinService, JoinService},
        user::{HaveUserRepository, UserId, UserRepository},
    },
    infrastructures::event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
    utils::types::LocalBoxFuture,
};

pub trait JoinUserDependency: HaveUserRepository + HaveEventDispatcher + HaveJoinService {}

#[derive(Clone, Debug, PartialEq)]
pub enum JoinUserOutput {
    NotFound,
    JoinFailed,
}

pub trait JoinUser {
    fn execute(
        &self,
        signature: InvitationSignature,
        user_id: UserId,
    ) -> LocalBoxFuture<'_, Result<GamePlayerId, JoinUserOutput>>;
}

impl<T: JoinUserDependency> JoinUser for T {
    fn execute(
        &self,
        signature: InvitationSignature,
        user_id: UserId,
    ) -> LocalBoxFuture<'_, Result<GamePlayerId, JoinUserOutput>> {
        let repository = self.get_user_repository();
        let dispatcher = self.get_event_dispatcher();
        let join_service = self.get_join_service();

        let fut = async move {
            let user = repository.find_by(user_id).await;

            if user.is_none() {
                return Err(JoinUserOutput::NotFound);
            }
            let user = user.unwrap();

            let event = join_service.join(&user, signature).await;
            if let Some(DomainEventKind::UserInvited { game_player_id, .. }) = event {
                dispatcher.dispatch(&event.unwrap());
                Ok(game_player_id)
            } else {
                Err(JoinUserOutput::JoinFailed)
            }
        };

        Box::pin(fut)
    }
}
