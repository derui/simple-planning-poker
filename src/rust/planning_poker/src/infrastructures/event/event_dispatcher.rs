use std::rc::Rc;

use crate::{domains::event::DomainEvent, utils::types::LocalBoxFuture};

pub trait EventListener<'a> {
    fn handle(&self, event: &DomainEvent) -> LocalBoxFuture<'a, ()>;
}

pub struct EventDispatcher<'a> {
    listeners: Vec<Rc<dyn EventListener<'a>>>,
}

pub trait HaveEventDispatcher {
    fn get_event_dispatcher(&self) -> &EventDispatcher;
}

impl<'a> EventDispatcher<'a> {
    pub fn new(listeners: &'a [Rc<dyn EventListener<'a>>]) -> Self {
        Self {
            listeners: Vec::from_iter(listeners.iter().map(Rc::clone)),
        }
    }

    pub fn dispatch(&self, event: &DomainEvent) {
        self.listeners.iter().for_each(move |v| {
            let v = Rc::clone(v);
            v.handle(event);
        })
    }
}
