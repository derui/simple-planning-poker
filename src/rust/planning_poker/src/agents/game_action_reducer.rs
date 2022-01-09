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
    global_bus::{GameActions, InnerMessage},
    global_status::GlobalStatus,
};

// implementation
mod internal {
    use std::vec;

    use gloo::console::console_dbg;

    use crate::{
        agents::global_status::GlobalStatus, domains::game::GameRepository,
        usecases::create_game::CreateGame,
    };

    use super::*;

    pub async fn change_mode(this: &GlobalStatus, mode: String) -> Vec<InnerMessage> {
        let this = this.clone();

        let player = this.current_game_player.borrow();
        if let Some(player) = &*player {
            let mode = UserMode::from(mode);

            let player = ChangeUserMode::execute(&this, player.id(), mode).await;
            if let Ok(player) = player {
                this.publish_snapshot().await;
                vec![InnerMessage::UpdateGamePlayer(player)]
            } else {
                vec![]
            }
        } else {
            vec![]
        }
    }

    pub async fn select_card(this: &GlobalStatus, card_index: u32) -> Vec<InnerMessage> {
        let game = this.current_game.borrow();
        let game_player = this.current_game_player.borrow();

        if let (Some(game), Some(player)) = (&*game, &*game_player) {
            let card = game.cards().at(card_index as usize);
            if let Some(card) = card {
                let player = HandCard::execute(this, player.id(), card).await;
                if let Ok(player) = player {
                    this.publish_snapshot().await;
                    vec![InnerMessage::UpdateGamePlayer(player)]
                } else {
                    vec![]
                }
            } else {
                vec![]
            }
        } else {
            vec![]
        }
    }

    pub async fn next_game(this: &GlobalStatus) -> Vec<InnerMessage> {
        let game = this.current_game.borrow();

        match &*game {
            Some(game) => {
                NewGame::execute(this, game.id())
                    .await
                    .expect("should be new game");
                let game = GameRepository::find_by(this.get_game_repository(), game.id())
                    .await
                    .expect("should be found");

                this.publish_snapshot().await;
                vec![InnerMessage::UpdateGame(game)]
            }
            None => vec![],
        }
    }

    pub async fn join_user(this: &GlobalStatus, signature: &str) -> Vec<InnerMessage> {
        let player = this.current_game_player.borrow();
        let signature = InvitationSignature::from(signature);

        match &*player {
            Some(player) => {
                JoinUser::execute(this, signature, *player.user())
                    .await
                    .expect("should be new game");

                let game_id = player.game();
                let repository = this.get_game_player_repository();
                let player = GamePlayerRepository::find_by(repository, player.id()).await;

                if let Some(player) = player {
                    let repository = this.get_game_repository();
                    let _game = GameRepository::find_by(repository, *game_id)
                        .await
                        .expect("should be found");

                    this.publish_snapshot().await;
                    vec![InnerMessage::UpdateGamePlayer(player)]
                } else {
                    vec![]
                }
            }
            None => vec![],
        }
    }

    pub async fn show_down(this: &GlobalStatus) -> Vec<InnerMessage> {
        let game = this.current_game.borrow();

        match &*game {
            Some(game) => {
                ShowDown::execute(this, game.id())
                    .await
                    .expect("should be new game");

                let repository = this.get_game_repository();
                let game = GameRepository::find_by(repository, game.id())
                    .await
                    .expect("should be found");

                this.publish_snapshot().await;
                vec![InnerMessage::UpdateGame(game)]
            }
            None => vec![],
        }
    }

    pub async fn open_game(this: &GlobalStatus, game_id: String) -> Vec<InnerMessage> {
        let game_id = GameId::from(game_id);
        let user = this.current_user.borrow();
        let game_repo = this.get_game_repository();
        let game_player_repo = this.get_game_player_repository();

        if let Some(user) = &*user {
            let joined_game = user.joined_games().iter().find(|v| v.game == game_id);
            if let Some(joined_game) = joined_game {
                let player =
                    GamePlayerRepository::find_by(game_player_repo, joined_game.game_player);
                let game = GameRepository::find_by(game_repo, joined_game.game);

                let (player, game) = futures::join!(player, game);
                console_dbg!(&player, &game);
                match (player, game) {
                    (Some(player), Some(game)) => {
                        this.publish_snapshot().await;
                        vec![
                            InnerMessage::UpdateGame(game),
                            InnerMessage::UpdateGamePlayer(player),
                        ]
                    }
                    _ => vec![],
                }
            } else {
                vec![]
            }
        } else {
            vec![]
        }
    }

    pub async fn leave_game(this: &GlobalStatus) -> Vec<InnerMessage> {
        let game = this.current_game.borrow();

        match &*game {
            Some(game) => {
                ShowDown::execute(this, game.id())
                    .await
                    .expect("should be new game");

                let repository = this.get_game_repository();
                let game = GameRepository::find_by(repository, game.id())
                    .await
                    .expect("should be found");

                this.publish_snapshot().await;
                vec![InnerMessage::UpdateGame(game)]
            }
            None => vec![],
        }
    }

    pub async fn create_game(
        this: &GlobalStatus,
        name: &str,
        points: &[String],
    ) -> Vec<InnerMessage> {
        let user = this.current_user.borrow();

        if let Some(user) = &*user {
            let points = points
                .iter()
                .filter_map(|v| v.parse::<u32>().ok())
                .collect::<Vec<u32>>();
            if name.is_empty() || points.is_empty() {
                return vec![];
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
                    this.publish_snapshot().await;
                    vec![
                        InnerMessage::UpdateGame(game),
                        InnerMessage::UpdateGamePlayer(player),
                    ]
                } else {
                    vec![]
                }
            } else {
                vec![]
            }
        } else {
            vec![]
        }
    }
}

pub async fn reduce_game_action(this: &GlobalStatus, action: GameActions) -> Vec<InnerMessage> {
    let this = this.clone();
    match action {
        GameActions::ChangeMode(mode) => internal::change_mode(&this, mode).await,
        GameActions::SelectCard(index) => internal::select_card(&this, index).await,
        GameActions::NextGame => internal::next_game(&this).await,
        GameActions::JoinUser(signature) => internal::join_user(&this, &signature).await,
        GameActions::ShowDown => internal::show_down(&this).await,
        GameActions::OpenGame(game_id) => internal::open_game(&this, game_id).await,
        GameActions::LeaveGame => internal::leave_game(&this).await,
        GameActions::CreateGame { name, points } => {
            internal::create_game(&this, &name, &points).await
        }
    }
}
