use std::{collections::HashSet, rc::Rc};

use futures::future::join_all;
use serde::{Deserialize, Serialize};
use wasm_bindgen_futures::spawn_local;
use yew_agent::{Agent, AgentLink, Context, HandlerId};

use crate::{
    domains::{
        event::{DomainEvent, DomainEventKind},
        game::{Game, HaveGameRepository},
        game_player::{GamePlayer, GamePlayerRepository, HaveGamePlayerRepository, UserMode},
        invitation::InvitationSignature,
        user::UserRepository,
    },
    infrastructures::{
        event::event_dispatcher::{EventDispatcher, HaveEventDispatcher},
        firebase::Database,
    },
    usecases::{
        change_user_mode::{ChangeUserMode, ChangeUserModeDependency},
        hand_card::{HandCard, HandCardDependency},
    },
    utils::uuid_factory::DefaultUuidFactory,
};

use super::{domain_event_listener::DomainEventListener, global_status::Actions};

type UserModeProjection = String;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CardProjection {
    is_giveup: bool,
    storypoint: u32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserHandProjection {
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
    hands: Vec<UserHandProjection>,
    showed_down: bool,
    average: Option<f32>,
    invitation_signature: String,
}

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

pub enum GameMessage {
    UpdateGame(Game),
    UpdateGamePlayer(GamePlayer),
}

#[derive(Clone)]
pub enum GameOutput {
    GameUpdated(GameProjection),
}

pub struct GameBus {
    link: AgentLink<GameBus>,
    subscribers: HashSet<HandlerId>,
    listener: Rc<DomainEventListener>,
    database: Database,
    current_game: Option<Game>,
    current_game_player: Option<GamePlayer>,
}

impl Clone for GameBus {
    fn clone(&self) -> Self {
        Self {
            link: self.link.clone(),
            subscribers: self.subscribers.clone(),
            listener: Rc::clone(&self.listener),
            database: self.database.clone(),
            current_game: self.current_game.clone(),
            current_game_player: self.current_game_player.clone(),
        }
    }
}

impl EventDispatcher for GameBus {
    fn dispatch(&self, event: &DomainEventKind) {
        let event = DomainEvent::new(&DefaultUuidFactory::default(), event.clone());
        let this = self.clone();

        let fut = async move { this.listener.handle(&event).await };
        spawn_local(fut)
    }
}

impl HaveGameRepository for GameBus {
    type T = Database;

    fn get_game_repository(&self) -> &Self::T {
        &self.database
    }
}

impl HaveGamePlayerRepository for GameBus {
    type T = Database;

    fn get_game_player_repository(&self) -> &Self::T {
        &self.database
    }
}

impl HaveEventDispatcher for GameBus {
    type T = GameBus;

    fn get_event_dispatcher(&self) -> &Self::T {
        self
    }
}

// use case wiring
impl HandCardDependency for GameBus {}
impl ChangeUserModeDependency for GameBus {}

// implementation
impl GameBus {
    fn publish(&self, output: GameOutput) {
        for sub in self.subscribers.iter() {
            self.link.respond(*sub, output.clone());
        }
    }

    async fn renew_game_projection(&self, game: &Game) -> GameProjection {
        let database = self.database.clone();
        let hands = game.players().iter().map(|player| async {
            let player = GamePlayerRepository::find_by(&database, *player)
                .await
                .expect("should be found player");
            let user = UserRepository::find_by(&database, *player.user())
                .await
                .expect("should be found user");

            UserHandProjection {
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

    fn change_mode(&self, mode: String) {
        let this = self.clone();

        let fut = async move {
            if let Some(player) = &this.current_game_player {
                let mode = UserMode::from(mode);

                let player = ChangeUserMode::execute(&this, player.id(), mode).await;
                if let Ok(player) = player {
                    this.link
                        .send_message(GameMessage::UpdateGamePlayer(player))
                }
            }

            publish_response(this).await
        };

        spawn_local(fut)
    }

    fn select_card(&self, card_index: u32) {
        let this = self.clone();
        let game = self.current_game.clone();
        let game_player = self.current_game_player.clone();

        let fut = async move {
            if let (Some(game), Some(player)) = (game, game_player) {
                let card = game.cards().at(card_index as usize);
                if let Some(card) = card {
                    let player = HandCard::execute(&this, player.id(), card).await;
                    if let Ok(player) = player {
                        this.link
                            .send_message(GameMessage::UpdateGamePlayer(player))
                    }
                }
            }

            publish_response(this).await;
        };

        spawn_local(fut)
    }
}

async fn publish_response(this: GameBus) {
    if let Some(game) = &this.current_game {
        let game = this.renew_game_projection(game).await;
        this.publish(GameOutput::GameUpdated(game))
    }
}

impl Agent for GameBus {
    type Reach = Context<Self>;

    type Message = GameMessage;

    type Input = Actions;

    type Output = GameOutput;

    fn create(link: AgentLink<Self>) -> Self {
        Self {
            link,
            subscribers: HashSet::new(),
            database: Database::new(),
            listener: Rc::new(DomainEventListener::new()),
            current_game: None,
            current_game_player: None,
        }
    }

    fn update(&mut self, msg: Self::Message) {
        match msg {
            GameMessage::UpdateGamePlayer(player) => self.current_game_player = Some(player),
            GameMessage::UpdateGame(game) => self.current_game = Some(game),
        }
    }

    fn handle_input(&mut self, msg: Self::Input, _id: HandlerId) {
        match msg {
            Actions::ForGame(GameActions::ChangeMode(mode)) => self.change_mode(mode),
            _ => unimplemented!(""),
        }
    }
}
