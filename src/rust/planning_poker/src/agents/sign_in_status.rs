use std::collections::HashSet;

use futures::{future::join_all, FutureExt};
use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::spawn_local;
use yew_agent::{Agent, AgentLink, Context, HandlerId};

use crate::{
    domains::{
        game::{Game, GameRepository},
        game_player::GamePlayerId,
        user::{HaveUserRepository, User, UserId, UserRepository},
    },
    infrastructures::{
        authenticator::Authenticator,
        firebase::{Auth, Database},
    },
    usecases::change_user_name::{ChangeUserName, ChangeUserNameDependency},
};

use super::global_status::Actions;

#[derive(Clone, PartialEq, Deserialize, Serialize, Debug)]
pub enum SignInActions {
    SignIn { email: String, password: String },
    SignUp { email: String, password: String },
}

#[derive(Clone, PartialEq, Deserialize, Serialize, Debug)]
pub enum UserActions {
    ChangeUserName(String),
}

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

#[derive(PartialEq, Clone)]
pub struct CurrentUserStatus {
    current_user: Option<User>,
}

impl Default for CurrentUserStatus {
    fn default() -> Self {
        Self { current_user: None }
    }
}

#[derive(Clone)]
pub struct CurrentUserBus {
    link: AgentLink<CurrentUserBus>,
    subscribers: HashSet<HandlerId>,
    database: Database,
    authenticator: Authenticator,
    current_user: Option<User>,
}

pub enum SignInMessage {
    Authenticating,
    Authenticated,
    SignedIn(CurrentUserStatusProjection),
}

pub enum CurrentUserMessage {
    ChangeName(User),
}

impl HaveUserRepository for CurrentUserBus {
    type T = Database;
    fn get_user_repository(&self) -> &Self::T {
        &self.database
    }
}
impl ChangeUserNameDependency for CurrentUserBus {}

async fn get_games(database: &Database, user: &User) -> Vec<(Game, GamePlayerId)> {
    let game_ids = user.joined_games();

    let fut = game_ids
        .iter()
        .map(|v| GameRepository::find_by(database, v.game).map(|g| g.map(|g| (g, v.game_player))));

    let fut = join_all(fut).await;
    fut.iter().filter_map(|v| v.clone()).collect()
}

impl CurrentUserBus {
    fn sign_in_or_sign_up(&mut self, email: &str, password: &str, sign_in: bool) {
        let email = email.to_string();
        let password = password.to_string();
        let authenticator = self.authenticator.clone();
        let database = self.database.clone();
        let this = self.clone();

        let fut = async move {
            let user_id = if sign_in {
                authenticator.sign_in(&email, &password).await
            } else {
                authenticator.sign_up(&email, &password).await
            };

            let user = UserRepository::find_by(&database, user_id)
                .await
                .expect("should find");
            let joined_games = get_games(&database, &user)
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

            for sub in this.subscribers.iter() {
                this.link
                    .respond(*sub, SignInMessage::SignedIn(proj.clone()));
            }
        };

        spawn_local(fut)
    }

    fn change_user_name(&mut self, name: String) {
        let this = self.clone();

        let user = match self.current_user.clone() {
            None => return,
            Some(v) => v.clone(),
        };

        let fut = async move {
            let result = ChangeUserName::execute(&this, user.id(), &name).await;
            match result {
                Ok(user) => this.link.send_message(CurrentUserMessage::ChangeName(user)),
                _ => (),
            }
        };

        spawn_local(fut)
    }
}

impl Agent for CurrentUserBus {
    type Reach = Context<Self>;

    type Message = CurrentUserMessage;

    type Input = Actions;

    type Output = SignInMessage;

    fn create(link: AgentLink<Self>) -> Self {
        let database = Database::new();
        Self {
            link,
            subscribers: HashSet::new(),
            database: database.clone(),
            authenticator: Authenticator::new(&database, &Auth::new()),
            current_user: None,
        }
    }

    fn update(&mut self, msg: Self::Message) {
        match msg {
            CurrentUserMessage::ChangeName(user) => self.current_user = Some(user),
        }
    }

    fn handle_input(&mut self, msg: Self::Input, _id: yew_agent::HandlerId) {
        match msg {
            Actions::ForSignIn(SignInActions::SignIn { email, password }) => {
                self.sign_in_or_sign_up(&email, &password, true)
            }
            Actions::ForSignIn(SignInActions::SignUp { email, password }) => {
                self.sign_in_or_sign_up(&email, &password, false)
            }
            Actions::ForUser(UserActions::ChangeUserName(name)) => self.change_user_name(name),
        }
    }

    fn connected(&mut self, id: HandlerId) {
        self.subscribers.insert(id);
    }

    fn disconnected(&mut self, id: HandlerId) {
        self.subscribers.remove(&id);
    }
}
