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

mod implement {
    use std::rc::Rc;

    use crate::{
        domains::event::{DomainEvent, DomainEventKind},
        utils::uuid_factory::UuidFactory,
    };

    use super::EventListener;

    pub struct EventDispatcher<'a> {
        listeners: Vec<Rc<dyn EventListener<'a>>>,
        factory: Box<dyn UuidFactory>,
    }

    impl<'a> EventDispatcher<'a> {
        pub fn new(
            listeners: &'a [Rc<dyn EventListener<'a>>],
            factory: Box<dyn UuidFactory>,
        ) -> Self {
            Self {
                listeners: Vec::from_iter(listeners.iter().map(Rc::clone)),
                factory,
            }
        }

        pub fn dispatch(&self, event: &DomainEventKind) {
            let event = DomainEvent::new(&*self.factory, event.clone());
            self.listeners.iter().for_each(move |v| {
                let v = Rc::clone(v);
                v.handle(&event);
            })
        }
    }
}
