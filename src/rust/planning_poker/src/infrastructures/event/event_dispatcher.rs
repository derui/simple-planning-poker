use crate::{
    domains::event::{DomainEvent, DomainEventKind},
    utils::types::LocalBoxFuture,
};

pub trait EventListener<'a> {
    fn handle(&self, event: &DomainEvent) -> LocalBoxFuture<'a, ()>;
}

pub trait EventDispatcher {
    fn dispatch(&self, event: &DomainEventKind);
}

pub trait HaveEventDispatcher {
    type T: EventDispatcher;

    fn get_event_dispatcher(&self) -> &Self::T;
}
