use js_sys::Array;
use wasm_bindgen::JsValue;

use crate::{
    domains::user::{User, UserId, UserRepository},
    utils::types::LocalBoxFuture,
};

use super::{
    firebase::Database,
    firebase::{
        auth::{
            self, create_user_with_email_and_password, sign_in_with_email_and_password,
            signed_in_user_id,
        },
        database::{self, reference_with_key, val},
        Auth,
    },
};

#[derive(Clone)]
pub struct Authenticator {
    database: Database,
    auth: Auth,
}

pub trait AuthenticatorIntf {
    fn sign_in(&self, email: &str, password: &str) -> LocalBoxFuture<'_, UserId>;

    fn sign_up(&self, email: &str, password: &str) -> LocalBoxFuture<'_, UserId>;

    fn check_user_id_if_exists(&self) -> Option<UserId>;
}

pub trait HaveAuthenticator {
    type T: AuthenticatorIntf;

    fn get_authenticator(&self) -> &Self::T;
}

impl AuthenticatorIntf for Authenticator {
    fn sign_in(&self, email: &str, password: &str) -> LocalBoxFuture<'_, UserId> {
        let email = email.to_owned();
        let password = password.to_owned();
        let fut = async move { self.sign_in(&email, &password).await };
        Box::pin(fut)
    }

    fn sign_up(&self, email: &str, password: &str) -> LocalBoxFuture<'_, UserId> {
        let email = email.to_owned();
        let password = password.to_owned();
        let fut = async move { self.sign_up(&email, &password).await };
        Box::pin(fut)
    }

    fn check_user_id_if_exists(&self) -> Option<UserId> {
        let user = auth::current_user_id(&self.auth.auth);

        if user.is_falsy() {
            None
        } else {
            let user_id = user.as_string().expect("should be string");
            let hash = &sha256::digest(user_id)[0..32];
            let user_id = UserId::from(hash.to_owned());

            Some(user_id)
        }
    }
}

impl Authenticator {
    pub fn new(database: &Database, auth: &Auth) -> Self {
        Self {
            database: database.clone(),
            auth: auth.clone(),
        }
    }

    async fn check_to_allow_signing_user_with(&self, email: &str) {
        let user = database::get(&reference_with_key(
            &self.database.database,
            "defined-users",
        ))
        .await;

        let allowed_mails = val(&user);
        let allowed_mails = if allowed_mails.is_falsy() {
            Array::new()
        } else {
            allowed_mails.into()
        };

        let email = JsValue::from_str(email);
        if !allowed_mails.some(&mut |v| v == email) {
            panic!("Do not allow sign in allowed before")
        }
    }

    pub async fn sign_in(&self, email: &str, password: &str) -> UserId {
        self.check_to_allow_signing_user_with(email).await;

        let auth = sign_in_with_email_and_password(&self.auth.auth, email, password).await;

        let user_id = signed_in_user_id(&auth);
        let hash = &sha256::digest(user_id)[0..32];
        let user_id = UserId::from(hash.to_owned());

        let user = UserRepository::find_by(&self.database, user_id).await;

        user.map(|v| v.id()).expect("Not found user")
    }

    pub async fn sign_up(&self, email: &str, password: &str) -> UserId {
        self.check_to_allow_signing_user_with(email).await;

        let auth = create_user_with_email_and_password(&self.auth.auth, email, password).await;

        let user_id = signed_in_user_id(&auth);
        let hash = &sha256::digest(user_id)[0..32];
        let user_id = UserId::from(hash.to_owned());

        let user = User::new(user_id, email, &[]);
        UserRepository::save(&self.database, &user).await;

        user_id
    }
}
