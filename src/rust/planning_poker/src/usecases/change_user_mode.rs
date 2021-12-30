use crate::{
    domains::game_player::{
        GamePlayer, GamePlayerId, GamePlayerRepository, HaveGamePlayerRepository, UserMode,
    },
    utils::types::LocalBoxFuture,
};

#[cfg(test)]
mod tests;

pub trait ChangeUserModeDependency: HaveGamePlayerRepository {}

#[derive(PartialEq, Debug)]
pub enum ChangeUserModeOutput {
    NotFound,
}

pub trait ChangeUserMode {
    fn execute(
        &self,
        game_player_id: GamePlayerId,
        mode: UserMode,
    ) -> LocalBoxFuture<'_, Result<GamePlayer, ChangeUserModeOutput>>;
}

impl<T: ChangeUserModeDependency> ChangeUserMode for T {
    fn execute(
        &self,
        game_player_id: GamePlayerId,
        mode: UserMode,
    ) -> LocalBoxFuture<'_, Result<GamePlayer, ChangeUserModeOutput>> {
        let repository = self.get_game_player_repository();

        let fut = async move {
            let user = repository.find_by(game_player_id).await;

            match user {
                None => Err(ChangeUserModeOutput::NotFound),
                Some(mut player) => {
                    player.change_user_mode(mode, |_| {});
                    repository.save(&player).await;

                    Ok(player)
                }
            }
        };

        Box::pin(fut)
    }
}
