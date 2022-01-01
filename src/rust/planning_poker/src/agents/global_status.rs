use futures::future::join_all;
use serde::{Deserialize, Serialize};

use crate::{
    domains::{
        game::Game,
        game_player::{GamePlayer, GamePlayerRepository, HaveGamePlayerRepository},
        invitation::InvitationSignature,
        join_service::JoinServiceDependency,
        user::{HaveUserRepository, UserRepository},
    },
    usecases::{
        change_user_mode::ChangeUserModeDependency, change_user_name::ChangeUserNameDependency,
        hand_card::HandCardDependency, join_user::JoinUserDependency, new_game::NewGameDependency,
        show_down::ShowDownDependency,
    },
};

use super::global_bus::{GlobalStatus, InnerMessage, Response};

type UserModeProjection = String;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CardProjection {
    is_giveup: bool,
    storypoint: u32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GamePlayerProjection {
    game_player_id: String,
    name: String,
    mode: UserModeProjection,
    card: Option<CardProjection>,
    selected: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GameProjection {
    id: String,
    name: String,
    hands: Vec<GamePlayerProjection>,
    showed_down: bool,
    average: Option<f32>,
    invitation_signature: String,
}

// use case wiring
impl JoinServiceDependency for GlobalStatus {}
impl HandCardDependency for GlobalStatus {}
impl ChangeUserModeDependency for GlobalStatus {}
impl NewGameDependency for GlobalStatus {}
impl JoinUserDependency for GlobalStatus {}
impl ShowDownDependency for GlobalStatus {}
impl ChangeUserNameDependency for GlobalStatus {}

// implementation
impl GlobalStatus {
    pub async fn publish_game_response(&self, game: &Game) {
        let game = self.renew_game_projection(game).await;
        self.publish(Response::GameUpdated(game))
    }

    pub async fn publish_game_player_response(&self, player: &GamePlayer) {
        let player = self.renew_game_player_projection(player).await;
        self.publish(Response::GamePlayerProjection(player))
    }

    pub fn update(&mut self, msg: InnerMessage) {
        match msg {
            InnerMessage::UpdateGamePlayer(player) => self.current_game_player = Some(player),
            InnerMessage::UpdateGame(game) => self.current_game = Some(game),
            InnerMessage::UpdateUser(user) => self.current_user = Some(user),
        }
    }

    async fn renew_game_player_projection(&self, game_player: &GamePlayer) -> GamePlayerProjection {
        let player =
            GamePlayerRepository::find_by(self.get_game_player_repository(), game_player.id())
                .await
                .expect("should be found player");
        let user = UserRepository::find_by(self.get_user_repository(), *player.user())
            .await
            .expect("should be found user");

        GamePlayerProjection {
            game_player_id: player.id().to_string(),
            name: user.name().to_owned(),
            mode: player.mode().to_string(),
            card: player.hand().map(|c| CardProjection {
                is_giveup: c.as_story_point().is_none(),
                storypoint: c
                    .as_story_point()
                    .map(|v| v.as_u32())
                    .unwrap_or_else(|| 0_u32),
            }),
            selected: player.hand().is_some(),
        }
    }

    async fn renew_game_projection(&self, game: &Game) -> GameProjection {
        let hands = game.players().iter().map(|player| async {
            let player = GamePlayerRepository::find_by(self.get_game_player_repository(), *player)
                .await
                .expect("should be found player");
            let user = UserRepository::find_by(self.get_user_repository(), *player.user())
                .await
                .expect("should be found user");

            GamePlayerProjection {
                game_player_id: player.id().to_string(),
                name: user.name().to_owned(),
                mode: player.mode().to_string(),
                card: player.hand().map(|c| CardProjection {
                    is_giveup: c.as_story_point().is_none(),
                    storypoint: c
                        .as_story_point()
                        .map(|v| v.as_u32())
                        .unwrap_or_else(|| 0_u32),
                }),
                selected: player.hand().is_some(),
            }
        });

        let hands = join_all(hands).await;

        GameProjection {
            id: game.id().to_string(),
            name: game.name().to_owned(),
            showed_down: game.showed_down(),
            average: game.calculate_average().ok().map(|v| v.as_f32()),
            invitation_signature: InvitationSignature::new(game.id()).to_string(),
            hands,
        }
    }
}
