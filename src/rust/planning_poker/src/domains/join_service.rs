use std::borrow::BorrowMut;

use crate::utils::uuid_factory::UuidFactory;

use super::{
    event::DomainEventKind,
    game::GameRepository,
    game_player::{GamePlayer, GamePlayerRepository, UserMode},
    id::Id,
    invitation::InvitationSignature,
    user::User,
};

#[cfg(test)]
mod tests;

pub struct JoinService<'a> {
    game_repository: Box<&'a dyn GameRepository>,
    game_player_repository: Box<&'a dyn GamePlayerRepository>,
    factory: Box<&'a dyn UuidFactory>,
}

impl<'a> JoinService<'a> {
    pub fn new(
        game_repository: &'a dyn GameRepository,
        game_player_repository: &'a dyn GamePlayerRepository,
        factory: &'a dyn UuidFactory,
    ) -> Self {
        Self {
            game_repository: Box::new(game_repository),
            game_player_repository: Box::new(game_player_repository),
            factory: Box::new(factory),
        }
    }

    pub fn join<F>(&self, user: &User, signature: InvitationSignature, mut receiver: F)
    where
        F: FnMut(DomainEventKind) + 'static,
    {
        if let Some((game, joined_game)) = self
            .game_repository
            .find_by_invitation_signature(signature)
            .and_then(|game| {
                let id = game.id();
                Some((game, user.find_joined_game(id)))
            })
        {
            let (game_id, game_player_id) = match joined_game {
                Some(joined_game) => (joined_game.game, joined_game.game_player),
                None => {
                    let id = Id::create(*self.factory);
                    let player = GamePlayer::new(
                        id,
                        game.id(),
                        user.id(),
                        None,
                        game.cards(),
                        UserMode::Normal,
                    );

                    self.game_player_repository.save(&player);
                    (game.id(), id)
                }
            };

            receiver(DomainEventKind::UserInvited {
                game_id,
                user_id: user.id(),
                game_player_id,
            })
        }
    }
}
