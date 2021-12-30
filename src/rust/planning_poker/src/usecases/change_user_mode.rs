use crate::{
    domains::{
        game_player::{
            GamePlayer, GamePlayerId, GamePlayerRepository, HaveGamePlayerRepository, UserMode,
        },
        user::UserRepository,
    },
    utils::types::LocalBoxFuture,
};

pub trait ChangeUserModeDependency: HaveGamePlayerRepository {}

pub enum ChangeUserModeOutput {
    NotFound,
}

pub trait ChangeUserMode {
    fn execute<'a>(
        &'a self,
        game_player_id: GamePlayerId,
        mode: UserMode,
    ) -> LocalBoxFuture<'a, Result<GamePlayer, ChangeUserModeOutput>>;
}

async fn execute(
    repository: &dyn GamePlayerRepository,
    game_player_id: GamePlayerId,
    mode: UserMode,
) -> Result<GamePlayer, ChangeUserModeOutput> {
    let user = repository.find_by(game_player_id).await;

    match user {
        None => Err(ChangeUserModeOutput::NotFound),
        Some(mut player) => {
            player.change_user_mode(mode, |_| {});
            repository.save(&player).await;

            Ok(player)
        }
    }
}

impl<T: ChangeUserModeDependency> ChangeUserMode for T {
    fn execute<'a>(
        &'a self,
        game_player_id: GamePlayerId,
        mode: UserMode,
    ) -> LocalBoxFuture<'a, Result<GamePlayer, ChangeUserModeOutput>> {
        let repository = self.get_game_player_repository();
        let mode = mode.to_owned();

        Box::pin(execute(repository, game_player_id, mode))
    }
}
