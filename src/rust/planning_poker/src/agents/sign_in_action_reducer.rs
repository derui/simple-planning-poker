use serde::{Deserialize, Serialize};

use crate::domains::user::{HaveUserRepository, UserRepository};

use super::{
    global_bus::{GlobalStatusUpdateMessage, SignInActions},
    global_status::GlobalStatus,
};

#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct JoinedGameProjection {
    pub game_id: String,
    pub name: String,
    pub player_id: String,
}

#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct CurrentUserStatusProjection {
    pub id: String,
    pub name: String,
    pub joined_games: Vec<JoinedGameProjection>,
}

mod internal {

    use crate::{
        agents::{
            global_bus::{InnerMessage, Response},
            global_status::GlobalStatus,
        },
        infrastructures::authenticator::{AuthenticatorIntf, HaveAuthenticator},
    };

    use super::*;

    pub async fn sign_in_or_sign_up(
        this: &GlobalStatus,
        email: &str,
        password: &str,
        sign_in: bool,
    ) -> Option<GlobalStatusUpdateMessage> {
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

        let proj = this.renew_user_projection(&user).await;

        this.publish(Response::SignedIn(proj));
        this.publish(Response::Authenticated);
        Some(GlobalStatusUpdateMessage::new(vec![
            InnerMessage::UpdateUser(user),
        ]))
    }

    pub async fn check_current_auth(this: &GlobalStatus) -> Option<GlobalStatusUpdateMessage> {
        let authenticator = this.get_authenticator();
        let user_id = authenticator.check_user_id_if_exists();

        match user_id {
            None => {
                this.publish(Response::NotSignedIn);
                None
            }
            Some(user_id) => {
                let user = UserRepository::find_by(this.get_user_repository(), user_id)
                    .await
                    .expect("should find");

                let proj = this.renew_user_projection(&user).await;

                this.publish(Response::SignedIn(proj));
                this.publish(Response::Authenticated);
                Some(GlobalStatusUpdateMessage::new(vec![
                    InnerMessage::UpdateUser(user),
                ]))
            }
        }
    }
}

pub async fn reduce_sign_in(
    this: &GlobalStatus,
    msg: SignInActions,
) -> Option<GlobalStatusUpdateMessage> {
    match msg {
        SignInActions::SignIn { email, password } => {
            internal::sign_in_or_sign_up(this, &email, &password, true).await
        }
        SignInActions::SignUp { email, password } => {
            internal::sign_in_or_sign_up(this, &email, &password, false).await
        }
        SignInActions::CheckCurrentAuth => internal::check_current_auth(this).await,
    }
}
