use std::fmt::{Debug, Display};

use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

#[cfg(test)]
mod tests;

#[derive(PartialEq, Eq, Debug, Clone, Copy, Hash)]
pub struct Id<T: Eq + ToString = &'static str>(T);

impl Id {
    pub fn new<T>(value: T) -> Id<T>
    where
        T: Eq + ToString,
    {
        Id(value)
    }

    pub(crate) fn create<T>(factory: &dyn UuidFactory) -> T
    where
        T: DomainId,
    {
        T::new(factory.create())
    }
}

impl<T> Display for Id<T>
where
    T: Eq + ToString,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.0.to_string().as_str())
    }
}

pub trait DomainId {
    fn new(uuid: Uuid) -> Self
    where
        Self: Sized;
}
