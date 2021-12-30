use crate::utils::{types::LocalBoxFuture, uuid_factory::HaveUuidFactory};

use super::{
    event::DomainEventKind,
    game::{GameRepository, HaveGameRepository},
    game_player::{GamePlayer, GamePlayerRepository, HaveGamePlayerRepository, UserMode},
    id::Id,
    invitation::InvitationSignature,
    user::User,
};

#[cfg(test)]
mod tests;

pub trait JoinService {
    fn join(
        &self,
        user: &User,
        signature: InvitationSignature,
    ) -> LocalBoxFuture<'_, Option<DomainEventKind>>;
}

pub trait JoinServiceDependency:
    HaveGameRepository + HaveGamePlayerRepository + HaveUuidFactory
{
}

pub trait HaveJoinService {
    type T: JoinService;

    fn get_join_service(&self) -> &Self::T;
}

impl<T: JoinServiceDependency> JoinService for T {
    fn join(
        &self,
        user: &User,
        signature: InvitationSignature,
    ) -> LocalBoxFuture<'_, Option<DomainEventKind>> {
        let user = user.clone();

        Box::pin(async move {
            let game_repository = self.get_game_repository();
            let game_player_repository = self.get_game_player_repository();
            let factory = self.get_uuid_factory();
            let signature = signature.clone();
            let user = user.clone();

            let game = game_repository
                .find_by_invitation_signature(signature)
                .await;

            if let Some((game, joined_game)) = game.map(|game| {
                let id = game.id();
                (game, user.find_joined_game(id))
            }) {
                let (game_id, game_player_id) = match joined_game {
                    Some(joined_game) => (joined_game.game, joined_game.game_player),
                    None => {
                        let id = Id::create(factory);
                        let player = GamePlayer::new(
                            id,
                            game.id(),
                            user.id(),
                            None,
                            game.cards(),
                            UserMode::Normal,
                        );

                        game_player_repository.save(&player);
                        (game.id(), id)
                    }
                };

                Some(DomainEventKind::UserInvited {
                    game_id,
                    user_id: user.id(),
                    game_player_id,
                })
            } else {
                None
            }
        })
    }
}
