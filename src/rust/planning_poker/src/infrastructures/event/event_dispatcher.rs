use std::rc::Rc;

use crate::{domains::event::DomainEvent, utils::types::LocalBoxFuture};

pub trait EventListener<'a> {
    fn handle(&self, event: &DomainEvent) -> LocalBoxFuture<'a, ()>;
}

pub struct EventDispatcher<'a> {
    listeners: Vec<Rc<dyn EventListener<'a>>>,
}

impl<'a> EventDispatcher<'a> {
    pub fn new(listeners: &'a [Rc<dyn EventListener<'a>>]) -> Self {
        Self {
            listeners: Vec::from_iter(listeners.iter().map(|v| Rc::clone(v))),
        }
    }

    pub fn dispatch(&mut self, event: &DomainEvent) {
        self.listeners.iter().for_each(move |v| {
            let v = Rc::clone(v);
            v.handle(event);
        })
    }
}