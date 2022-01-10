use crate::{
    domains::event::DomainEvent,
    infrastructures::{
        event::{
            event_dispatcher::EventListener,
            event_listeners::{
                GameCreatedEventListener, GameShowedDownEventListener, NewGameStartedEventListener,
            },
        },
        firebase::Database,
    },
};

pub struct DomainEventListener {
    listeners: Vec<Box<dyn EventListener>>,
}

impl DomainEventListener {
    pub fn new() -> Self {
        let database = Database::new();
        let listeners: Vec<Box<dyn EventListener>> = vec![
            Box::new(GameShowedDownEventListener::new(&database)),
            Box::new(GameCreatedEventListener::new(&database)),
            Box::new(NewGameStartedEventListener::new(&database)),
        ];
        Self { listeners }
    }

    pub async fn handle(&self, event: &DomainEvent) {
        for ele in &self.listeners {
            ele.handle(event).await
        }
    }
}

impl Default for DomainEventListener {
    fn default() -> Self {
        Self::new()
    }
}
