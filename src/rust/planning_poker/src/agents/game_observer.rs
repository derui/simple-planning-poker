use std::collections::HashSet;

use wasm_bindgen::{prelude::Closure, JsValue};
use yew_agent::{Agent, AgentLink, Context, Dispatched, HandlerId};

use crate::infrastructures::firebase::{
    database::{on_value, reference_with_key},
    Database,
};

use super::{global_bus::Actions, global_status::GlobalStatus};

pub struct GameObserver {
    link: AgentLink<GameObserver>,
    subscribers: HashSet<HandlerId>,
    game_subscriber: Option<Closure<dyn FnMut()>>,
    game_unsubscriber: Option<js_sys::Function>,
    database: Database,
}

pub enum GameObserverAction {
    SubscribeTo(String),
}

impl Agent for GameObserver {
    type Reach = Context<Self>;

    type Message = ();

    type Input = GameObserverAction;

    type Output = ();

    fn connected(&mut self, id: yew_agent::HandlerId) {
        self.subscribers.insert(id);
    }

    fn disconnected(&mut self, id: yew_agent::HandlerId) {
        self.subscribers.remove(&id);
    }

    fn create(link: AgentLink<Self>) -> Self {
        GameObserver {
            link,
            subscribers: HashSet::new(),
            game_unsubscriber: None,
            game_subscriber: None,
            database: Database::new(),
        }
    }

    fn update(&mut self, _msg: Self::Message) {}

    fn handle_input(&mut self, msg: Self::Input, _id: HandlerId) {
        match msg {
            GameObserverAction::SubscribeTo(game_id) => {
                if let Some(unsubscribe) = &self.game_unsubscriber {
                    unsubscribe
                        .call0(&JsValue::null())
                        .expect("should remove subscription");
                }

                let mut dispatcher = GlobalStatus::dispatcher();
                let key = format!("games/{}", game_id);
                let reference = reference_with_key(&*self.database.database, &key);
                let callback = Closure::wrap(Box::new(move || {
                    dispatcher.send(Actions::RequestSnapshot);
                }) as Box<dyn FnMut()>);
                let unsubscribe = on_value(&reference, &callback);
                self.game_unsubscriber = Some(unsubscribe);
                self.game_subscriber = Some(callback);
            }
        }
    }

    fn destroy(&mut self) {
        if let Some(unsubscribe) = &self.game_unsubscriber {
            unsubscribe
                .call0(&JsValue::null())
                .expect("should be able to call");
        }
    }
}
