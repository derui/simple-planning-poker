use crate::{
    domains::{
        game::{GameId, HaveGameRepository},
        game_player::{GamePlayerRepository, HaveGamePlayerRepository, UserMode},
        invitation::InvitationSignature,
    },
    usecases::{
        change_user_mode::ChangeUserMode, hand_card::HandCard, join_user::JoinUser,
        new_game::NewGame, show_down::ShowDown,
    },
};

use super::{
    global_bus::{GameActions, GlobalStatusUpdateMessage, InnerMessage},
    global_status::GlobalStatus,
};

// implementation
mod internal {
    use std::vec;

    use crate::{
        agents::global_status::GlobalStatus,
        domains::{
            game::GameRepository,
            user::{HaveUserRepository, UserRepository},
        },
        usecases::create_game::CreateGame,
    };

    use super::*;

    pub async fn change_mode(
        this: &GlobalStatus,
        mode: String,
    ) -> Option<GlobalStatusUpdateMessage> {
        let player = this.current_game_player.clone();
        if let Some(player) = player {
            let mode = UserMode::from(mode);

            let player = ChangeUserMode::execute(this, player.id(), mode).await;
            if let Ok(player) = player {
                Some(GlobalStatusUpdateMessage::new(vec![
                    InnerMessage::UpdateGamePlayer(player),
                ]))
            } else {
                None
            }
        } else {
            None
        }
    }

    pub async fn select_card(
        this: &GlobalStatus,
        card_index: u32,
    ) -> Option<GlobalStatusUpdateMessage> {
        let game = this.current_game.clone();
        let game_player = this.current_game_player.clone();

        if let (Some(game), Some(player)) = (game, game_player) {
            let card = game.cards().at(card_index as usize);
            if let Some(card) = card {
                let player = HandCard::execute(this, player.id(), card).await;
                if let Ok(player) = player {
                    return Some(GlobalStatusUpdateMessage::new(vec![
                        InnerMessage::UpdateGamePlayer(player),
                    ]));
                }
            }
        }

        None
    }

    pub async fn next_game(this: &GlobalStatus) -> Option<GlobalStatusUpdateMessage> {
        let game = this.current_game.clone();

        match game {
            Some(game) => {
                NewGame::execute(this, game.id())
                    .await
                    .expect("should be new game");
                let game = GameRepository::find_by(this.get_game_repository(), game.id())
                    .await
                    .expect("should be found");

                Some(GlobalStatusUpdateMessage::new(vec![
                    InnerMessage::UpdateGame(game),
                ]))
            }
            None => None,
        }
    }

    pub async fn join_user(
        this: &GlobalStatus,
        signature: &str,
    ) -> Option<GlobalStatusUpdateMessage> {
        let user = this.current_user.clone();
        let signature = InvitationSignature::from(signature);

        if let Some(user) = user {
            JoinUser::execute(this, signature.clone(), user.id())
                .await
                .expect("should be new game");
            let game =
                GameRepository::find_by_invitation_signature(this.get_game_repository(), signature)
                    .await;

            if let None = game {
                return None;
            }
            let game = game.unwrap();
            let user = UserRepository::find_by(this.get_user_repository(), user.id())
                .await
                .unwrap();

            let game_id = game.id();
            let joined_game = user.find_joined_game(game_id);
            if let Some(joined_game) = joined_game {
                let repository = this.get_game_player_repository();
                let player =
                    GamePlayerRepository::find_by(repository, joined_game.game_player).await;

                if let Some(player) = player {
                    let repository = this.get_game_repository();
                    let _game = GameRepository::find_by(repository, game_id)
                        .await
                        .expect("should be found");

                    return Some(GlobalStatusUpdateMessage::new(vec![
                        InnerMessage::UpdateGamePlayer(player),
                    ]));
                }
            }
        }

        None
    }

    pub async fn show_down(this: &GlobalStatus) -> Option<GlobalStatusUpdateMessage> {
        let game = this.current_game.clone();

        match game {
            Some(game) => {
                ShowDown::execute(this, game.id())
                    .await
                    .expect("should be new game");

                let repository = this.get_game_repository();
                let game = GameRepository::find_by(repository, game.id())
                    .await
                    .expect("should be found");

                Some(GlobalStatusUpdateMessage::new(vec![
                    InnerMessage::UpdateGame(game),
                ]))
            }
            None => None,
        }
    }

    pub async fn reload_game(this: &GlobalStatus) -> Option<GlobalStatusUpdateMessage> {
        let game = this.current_game.clone();

        match game {
            Some(game) => {
                let repository = this.get_game_repository();
                let game = GameRepository::find_by(repository, game.id())
                    .await
                    .expect("should be found");

                Some(GlobalStatusUpdateMessage::new(vec![
                    InnerMessage::UpdateGame(game),
                ]))
            }
            None => None,
        }
    }

    pub async fn open_game(
        this: &GlobalStatus,
        game_id: String,
    ) -> Option<GlobalStatusUpdateMessage> {
        let game_id = GameId::from(game_id);
        let user = this.current_user.clone();
        let game_repo = this.get_game_repository();
        let game_player_repo = this.get_game_player_repository();

        if let Some(user) = user {
            let joined_game = user.joined_games().iter().find(|v| v.game == game_id);
            if let Some(joined_game) = joined_game {
                let player =
                    GamePlayerRepository::find_by(game_player_repo, joined_game.game_player);
                let game = GameRepository::find_by(game_repo, joined_game.game);

                let (player, game) = futures::join!(player, game);
                return match (player, game) {
                    (Some(player), Some(game)) => Some(GlobalStatusUpdateMessage::new(vec![
                        InnerMessage::UpdateGame(game),
                        InnerMessage::UpdateGamePlayer(player),
                    ])),
                    _ => None,
                };
            }
        }

        None
    }

    pub async fn leave_game(this: &GlobalStatus) -> Option<GlobalStatusUpdateMessage> {
        let game = this.current_game.clone();

        match game {
            Some(game) => {
                ShowDown::execute(this, game.id())
                    .await
                    .expect("should be new game");

                let repository = this.get_game_repository();
                let game = GameRepository::find_by(repository, game.id())
                    .await
                    .expect("should be found");

                Some(GlobalStatusUpdateMessage::new(vec![
                    InnerMessage::UpdateGame(game),
                ]))
            }
            None => None,
        }
    }

    pub async fn create_game(
        this: &GlobalStatus,
        name: &str,
        points: &[String],
    ) -> Option<GlobalStatusUpdateMessage> {
        let user = this.current_user.clone();

        if let Some(user) = user {
            let points = points
                .iter()
                .filter_map(|v| v.parse::<u32>().ok())
                .collect::<Vec<u32>>();
            if name.is_empty() || points.is_empty() {
                return None;
            }

            let ret = CreateGame::execute(this, name, user.id(), &points).await;

            if let Ok(game) = ret {
                let player = GamePlayerRepository::find_by_user_and_game(
                    this.get_game_player_repository(),
                    user.id(),
                    game.id(),
                )
                .await;

                if let Some(player) = player {
                    return Some(GlobalStatusUpdateMessage::new(vec![
                        InnerMessage::UpdateGame(game),
                        InnerMessage::UpdateGamePlayer(player),
                    ]));
                }
            }
        }

        None
    }
}

pub async fn reduce_game_action(
    this: &GlobalStatus,
    action: GameActions,
) -> Option<GlobalStatusUpdateMessage> {
    match action {
        GameActions::ChangeMode(mode) => internal::change_mode(this, mode).await,
        GameActions::SelectCard(index) => internal::select_card(this, index).await,
        GameActions::NextGame => internal::next_game(this).await,
        GameActions::JoinUser(signature) => internal::join_user(this, &signature).await,
        GameActions::ShowDown => internal::show_down(this).await,
        GameActions::ReloadGame => internal::reload_game(this).await,
        GameActions::OpenGame(game_id) => internal::open_game(this, game_id).await,
        GameActions::LeaveGame => internal::leave_game(this).await,
        GameActions::CreateGame { name, points } => {
            internal::create_game(this, &name, &points).await
        }
    }
}
