use std::{cell::RefCell, collections::HashSet, rc::Rc, sync::Arc};

use futures::future::join_all;

use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::spawn_local;
use yew_agent::{Agent, AgentLink, Context, HandlerId};

use crate::{
    domains::{
        event::{DomainEvent, DomainEventKind},
        game::{Game, GameRepository, HaveGameRepository},
        game_player::{GamePlayer, GamePlayerId, GamePlayerRepository, HaveGamePlayerRepository},
        invitation::InvitationSignature,
        join_service::{HaveJoinService, JoinServiceDependency},
        user::{HaveUserRepository, User, UserRepository},
    },
    infrastructures::{
        authenticator::{Authenticator, HaveAuthenticator},
        event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
        firebase::{Auth, Database},
    },
    usecases::{
        change_user_mode::ChangeUserModeDependency, change_user_name::ChangeUserNameDependency,
        create_game::CreateGameDependency, hand_card::HandCardDependency,
        join_user::JoinUserDependency, new_game::NewGameDependency, show_down::ShowDownDependency,
    },
    utils::uuid_factory::{DefaultUuidFactory, HaveUuidFactory},
};

use super::{
    domain_event_listener::DomainEventListener,
    game_action_reducer::reduce_game_action,
    global_bus::{Actions, InnerMessage, Response},
    sign_in_action_reducer::{reduce_sign_in, CurrentUserStatusProjection, JoinedGameProjection},
    user_action_reducer::reduce_user_actions,
};

type UserModeProjection = String;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum CardProjection {
    GiveUp,
    StoryPoint(u32),
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct GamePlayerProjection {
    pub game_player_id: String,
    pub name: String,
    pub mode: UserModeProjection,
    pub card: Option<CardProjection>,
    pub selected_index: Option<u32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GameProjection {
    pub id: String,
    pub name: String,
    pub hands: Vec<GamePlayerProjection>,
    pub showed_down: bool,
    pub average: Option<f32>,
    pub invitation_signature: String,
    pub cards: Vec<CardProjection>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GlobalStatusProjection {
    pub current_game: Option<GameProjection>,
    pub current_game_player: Option<GamePlayerProjection>,
    pub current_user: Option<CurrentUserStatusProjection>,
}

pub struct GlobalStatus {
    link: AgentLink<GlobalStatus>,
    subscribers: HashSet<HandlerId>,
    listener: Rc<DomainEventListener>,
    pub database: Database,
    pub factory: Rc<DefaultUuidFactory>,
    pub authenticator: Authenticator,
    pub current_game: Arc<RefCell<Option<Game>>>,
    pub current_game_player: Arc<RefCell<Option<GamePlayer>>>,
    pub current_user: Arc<RefCell<Option<User>>>,
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
            current_game: Arc::clone(&self.current_game),
            current_game_player: Arc::clone(&self.current_game_player),
            current_user: Arc::clone(&self.current_user),
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

// use case wiring
impl JoinServiceDependency for GlobalStatus {}
impl HandCardDependency for GlobalStatus {}
impl ChangeUserModeDependency for GlobalStatus {}
impl NewGameDependency for GlobalStatus {}
impl JoinUserDependency for GlobalStatus {}
impl ShowDownDependency for GlobalStatus {}
impl ChangeUserNameDependency for GlobalStatus {}
impl CreateGameDependency for GlobalStatus {}

// implementation
impl GlobalStatus {
    pub fn update(&mut self, msg: InnerMessage) {
        match msg {
            InnerMessage::UpdateGamePlayer(player) => {
                self.current_game_player.replace(Some(player));
            }
            InnerMessage::UpdateGame(game) => {
                self.current_game.replace(Some(game));
            }
            InnerMessage::UpdateUser(user) => {
                self.current_user.replace(Some(user));
            }
        }
    }

    async fn renew_game_player_projection(
        &self,
        game_player_id: GamePlayerId,
    ) -> GamePlayerProjection {
        let player =
            GamePlayerRepository::find_by(self.get_game_player_repository(), game_player_id)
                .await
                .expect("should be found player");
        let user = UserRepository::find_by(self.get_user_repository(), *player.user())
            .await
            .expect("should be found user");

        GamePlayerProjection {
            game_player_id: player.id().to_string(),
            name: user.name().to_owned(),
            mode: player.mode().to_string(),
            card: player.hand().map(|c| match c.as_story_point() {
                None => CardProjection::GiveUp,
                Some(p) => CardProjection::StoryPoint(p.as_u32()),
            }),
            selected_index: player
                .hand()
                .and_then(|c| player.cards().index(c))
                .map(|v| v as u32),
        }
    }

    async fn renew_game_projection(&self, game: &Game) -> GameProjection {
        let hands = game
            .players()
            .iter()
            .map(|player| self.renew_game_player_projection(*player));

        let hands = join_all(hands).await;
        let mut cards = game
            .cards()
            .storypoints()
            .iter()
            .map(|v| CardProjection::StoryPoint(v.as_u32()))
            .collect::<Vec<CardProjection>>();
        cards.push(CardProjection::GiveUp);

        GameProjection {
            id: game.id().to_string(),
            name: game.name().to_owned(),
            showed_down: game.showed_down(),
            average: game.calculate_average().ok().map(|v| v.as_f32()),
            invitation_signature: InvitationSignature::new(game.id()).to_string(),
            hands,
            cards,
        }
    }

    async fn get_games(&self, user: &User) -> Vec<(Game, GamePlayerId)> {
        let game_ids = user.joined_games();

        let fut = game_ids.iter().map(|v| async {
            GameRepository::find_by(self.get_game_repository(), v.game)
                .await
                .map(|g| (g, v.game_player))
        });

        let fut = join_all(fut).await;
        fut.iter().filter_map(|v| v.clone()).collect()
    }

    pub async fn renew_user_projection(&self, user: &User) -> CurrentUserStatusProjection {
        let joined_games = self
            .get_games(user)
            .await
            .iter()
            .map(|(g, player_id)| JoinedGameProjection {
                game_id: g.id().to_string(),
                name: g.name().to_string(),
                player_id: player_id.to_string(),
            })
            .collect();

        CurrentUserStatusProjection {
            id: user.id().to_string(),
            name: user.name().to_string(),
            joined_games,
        }
    }

    pub async fn publish_snapshot(&self) {
        let current_game = match &*self.current_game.borrow() {
            None => None,
            Some(game) => Some(self.renew_game_projection(game).await),
        };

        let current_game_player = match &*self.current_game_player.borrow() {
            None => None,
            Some(player) => Some(self.renew_game_player_projection(player.id()).await),
        };

        let current_user = match &*self.current_user.borrow() {
            None => None,
            Some(user) => Some(self.renew_user_projection(user).await),
        };

        let proj = GlobalStatusProjection {
            current_game,
            current_game_player,
            current_user,
        };

        self.publish(Response::SnapshotUpdated(proj));
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
            current_game: Arc::new(RefCell::new(None)),
            current_game_player: Arc::new(RefCell::new(None)),
            current_user: Arc::new(RefCell::new(None)),
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
                Actions::ForUser(msg) => reduce_user_actions(&this, msg).await,
                Actions::ForSignIn(msg) => reduce_sign_in(&this, msg).await,
                Actions::RequestSnapshot => {
                    this.publish_snapshot().await;
                    Vec::new()
                }
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
