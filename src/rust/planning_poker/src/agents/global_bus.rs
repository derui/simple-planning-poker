use serde::{Deserialize, Serialize};

use crate::domains::{game::Game, game_player::GamePlayer, user::User};

use super::{
    global_status::GlobalStatusProjection, sign_in_action_reducer::CurrentUserStatusProjection,
};

#[derive(Clone, PartialEq, Deserialize, Serialize, Debug)]
pub enum GameActions {
    CreateGame { name: String, points: Vec<String> },
    SelectCard(u32),
    NextGame,
    JoinUser(String),
    ShowDown,
    ChangeMode(String),
    OpenGame(String),
    LeaveGame,
}

#[derive(Clone, PartialEq, Deserialize, Serialize, Debug)]
pub enum SignInActions {
    SignIn { email: String, password: String },
    SignUp { email: String, password: String },
    CheckCurrentAuth,
}

#[derive(Clone, PartialEq, Deserialize, Serialize, Debug)]
pub enum UserActions {
    ChangeUserName(String),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Actions {
    ForSignIn(SignInActions),
    ForUser(UserActions),
    ForGame(GameActions),
    RequestSnapshot,
}

/// inner messages
#[derive(Clone, Debug)]
pub enum InnerMessage {
    UpdateGame(Game),
    UpdateGamePlayer(GamePlayer),
    UpdateUser(User),
}

#[derive(Clone, Debug, Default)]
pub struct GlobalStatusUpdateMessage {
    messages: Vec<InnerMessage>,
    responses: Vec<Response>,
}

impl GlobalStatusUpdateMessage {
    pub fn new(messages: Vec<InnerMessage>) -> Self {
        GlobalStatusUpdateMessage {
            messages,
            responses: Vec::new(),
        }
    }

    pub fn new_with_responses(messages: Vec<InnerMessage>, responses: Vec<Response>) -> Self {
        GlobalStatusUpdateMessage {
            messages,
            responses,
        }
    }

    pub fn messages(&self) -> &[InnerMessage] {
        &self.messages
    }

    pub fn responses(&self) -> &[Response] {
        &self.responses
    }
}

/// responses
#[derive(Clone, Debug)]
pub enum Response {
    SnapshotUpdated(GlobalStatusProjection),
    Authenticating,
    Authenticated,
    SignedIn(CurrentUserStatusProjection),
    NotSignedIn,
}
