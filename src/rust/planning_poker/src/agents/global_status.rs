use std::collections::HashSet;

use serde::{Deserialize, Serialize};
use yew_agent::{Agent, AgentLink, Context, HandlerId};

use super::sign_in_status::{SignInActions, UserActions};

pub struct GlobalStatus {
    link: AgentLink<GlobalStatus>,
    subscribers: HashSet<HandlerId>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Actions {
    ForSignIn(SignInActions),
    ForUser(UserActions),
}

impl Agent for GlobalStatus {
    type Reach = Context<Self>;

    type Message = ();

    type Input = Actions;

    type Output = Actions;

    fn create(link: AgentLink<Self>) -> Self {
        Self {
            link,
            subscribers: HashSet::new(),
        }
    }

    fn update(&mut self, _msg: Self::Message) {}

    fn handle_input(&mut self, msg: Self::Input, _id: yew_agent::HandlerId) {
        for sub in self.subscribers.iter() {
            self.link.respond(*sub, msg.clone());
        }
    }

    fn connected(&mut self, id: HandlerId) {
        self.subscribers.insert(id);
    }

    fn disconnected(&mut self, id: HandlerId) {
        self.subscribers.remove(&id);
    }
}
