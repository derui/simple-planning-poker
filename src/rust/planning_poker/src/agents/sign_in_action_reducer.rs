use futures::{future::join_all, FutureExt};

use crate::domains::{
    game::{Game, GameRepository, HaveGameRepository},
    game_player::GamePlayerId,
    user::{HaveUserRepository, User, UserId, UserRepository},
};

use super::global_bus::{GlobalStatus, InnerMessage, SignInActions};

#[derive(PartialEq, Clone)]
pub struct JoinedGameProjection {
    game_id: String,
    name: String,
    player_id: String,
}

#[derive(PartialEq, Clone)]
pub struct CurrentUserStatusProjection {
    id: UserId,
    name: String,
    joined_games: Vec<JoinedGameProjection>,
}

async fn get_games(database: &GlobalStatus, user: &User) -> Vec<(Game, GamePlayerId)> {
    let game_ids = user.joined_games();

    let fut = game_ids.iter().map(|v| {
        GameRepository::find_by(database.get_game_repository(), v.game)
            .map(|g| g.map(|g| (g, v.game_player)))
    });

    let fut = join_all(fut).await;
    fut.iter().filter_map(|v| v.clone()).collect()
}

mod internal {
    use crate::{
        agents::global_bus::{InnerMessage, Response},
        infrastructures::authenticator::HaveAuthenticator,
    };

    use super::*;

    pub async fn sign_in_or_sign_up(
        this: &GlobalStatus,
        email: &str,
        password: &str,
        sign_in: bool,
    ) -> Vec<InnerMessage> {
        let email = email.to_string();
        let password = password.to_string();
        let authenticator = this.get_authenticator();

        this.publish(Response::Authenticating);

        let user_id = if sign_in {
            authenticator.sign_in(&email, &password).await
        } else {
            authenticator.sign_up(&email, &password).await
        };

        let user = UserRepository::find_by(this.get_user_repository(), user_id)
            .await
            .expect("should find");
        let joined_games = get_games(this, &user)
            .await
            .iter()
            .map(|(g, player_id)| JoinedGameProjection {
                game_id: g.id().to_string(),
                name: g.name().to_string(),
                player_id: player_id.to_string(),
            })
            .collect();

        let proj = CurrentUserStatusProjection {
            id: user.id(),
            name: user.name().to_string(),
            joined_games,
        };

        this.publish(Response::SignedIn(proj));
        this.publish(Response::Authenticated);
        vec![InnerMessage::UpdateUser(user)]
    }
}

pub async fn reduce_sign_in(this: &GlobalStatus, msg: SignInActions) -> Vec<InnerMessage> {
    match msg {
        SignInActions::SignIn { email, password } => {
            internal::sign_in_or_sign_up(this, &email, &password, true).await
        }
        SignInActions::SignUp { email, password } => {
            internal::sign_in_or_sign_up(this, &email, &password, false).await
        }
    }
}
