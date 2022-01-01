use std::{collections::HashSet, rc::Rc};

use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::spawn_local;
use yew_agent::{Agent, AgentLink, Context, HandlerId};

use crate::{
    domains::{
        event::{DomainEvent, DomainEventKind},
        game::{Game, HaveGameRepository},
        game_player::{GamePlayer, HaveGamePlayerRepository},
        join_service::HaveJoinService,
        user::{HaveUserRepository, User},
    },
    infrastructures::{
        authenticator::{Authenticator, HaveAuthenticator},
        event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
        firebase::{Auth, Database},
    },
    utils::uuid_factory::{DefaultUuidFactory, HaveUuidFactory},
};

use super::{
    domain_event_listener::DomainEventListener,
    game_action_reducer::reduce_game_action,
    global_status::{GamePlayerProjection, GameProjection},
    sign_in_action_reducer::CurrentUserStatusProjection,
};

#[derive(Clone, PartialEq, Deserialize, Serialize, Debug)]
pub enum GameActions {
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
}

/// inner messages
#[derive(Clone, Debug)]
pub enum InnerMessage {
    UpdateGame(Game),
    UpdateGamePlayer(GamePlayer),
    UpdateUser(User),
}

/// responses
#[derive(Clone)]
pub enum Response {
    GameUpdated(GameProjection),
    GamePlayerProjection(GamePlayerProjection),
    Authenticating,
    Authenticated,
    SignedIn(CurrentUserStatusProjection),
}

pub struct GlobalStatus {
    link: AgentLink<GlobalStatus>,
    subscribers: HashSet<HandlerId>,
    listener: Rc<DomainEventListener>,
    database: Database,
    factory: Rc<DefaultUuidFactory>,
    authenticator: Authenticator,
    pub current_game: Option<Game>,
    pub current_game_player: Option<GamePlayer>,
    pub current_user: Option<User>,
}

impl Clone for GlobalStatus {
    fn clone(&self) -> Self {
        Self {
            link: self.link.clone(),
            subscribers: self.subscribers.clone(),
            listener: Rc::clone(&self.listener),
            database: self.database.clone(),
            authenticator: self.authenticator.clone(),
            factory: Rc::clone(&self.factory),
            current_game: self.current_game.clone(),
            current_game_player: self.current_game_player.clone(),
            current_user: self.current_user.clone(),
        }
    }
}

impl EventDispatcher for GlobalStatus {
    fn dispatch(&self, event: &DomainEventKind) {
        let event = DomainEvent::new(&DefaultUuidFactory::default(), event.clone());
        let this = self.clone();

        let fut = async move { this.listener.handle(&event).await };
        spawn_local(fut)
    }
}

impl GlobalStatus {
    pub fn publish(&self, output: Response) {
        for sub in self.subscribers.iter() {
            self.link.respond(*sub, output.clone());
        }
    }
}

impl Agent for GlobalStatus {
    type Reach = Context<Self>;

    type Message = InnerMessage;

    type Input = Actions;

    type Output = Response;

    fn create(link: AgentLink<Self>) -> Self {
        Self {
            link,
            subscribers: HashSet::new(),
            listener: Rc::new(DomainEventListener::new()),
            database: Database::new(),
            authenticator: Authenticator::new(&Database::new(), &Auth::new()),
            factory: Rc::new(DefaultUuidFactory::default()),
            current_game: None,
            current_game_player: None,
            current_user: None,
        }
    }

    fn update(&mut self, msg: Self::Message) {
        self.update(msg);
    }

    fn handle_input(&mut self, msg: Self::Input, _id: yew_agent::HandlerId) {
        let this = self.clone();
        let fut = async move {
            let messages = match msg {
                Actions::ForGame(msg) => reduce_game_action(&this, msg).await,
                _ => unimplemented!(),
            };
            messages
                .iter()
                .for_each(|v| this.link.send_message(v.clone()))
        };

        spawn_local(fut)
    }

    fn connected(&mut self, id: HandlerId) {
        self.subscribers.insert(id);
    }

    fn disconnected(&mut self, id: HandlerId) {
        self.subscribers.remove(&id);
    }
}

// dependency wiring
impl HaveGameRepository for GlobalStatus {
    type T = Database;

    fn get_game_repository(&self) -> &Self::T {
        &self.database
    }
}

impl HaveGamePlayerRepository for GlobalStatus {
    type T = Database;

    fn get_game_player_repository(&self) -> &Self::T {
        &self.database
    }
}

impl HaveEventDispatcher for GlobalStatus {
    type T = GlobalStatus;

    fn get_event_dispatcher(&self) -> &Self::T {
        self
    }
}

impl HaveJoinService for GlobalStatus {
    type T = Self;

    fn get_join_service(&self) -> &Self::T {
        self
    }
}

impl HaveUserRepository for GlobalStatus {
    type T = Database;

    fn get_user_repository(&self) -> &Self::T {
        &self.database
    }
}

impl HaveUuidFactory for GlobalStatus {
    type T = DefaultUuidFactory;

    fn get_uuid_factory(&self) -> &Self::T {
        &*self.factory
    }
}

impl HaveAuthenticator for GlobalStatus {
    type T = Authenticator;

    fn get_authenticator(&self) -> &Self::T {
        &self.authenticator
    }
}
