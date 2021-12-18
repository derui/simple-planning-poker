use std::fmt::{Debug, Display};

use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug, Clone, Copy)]
pub struct Id<T: PartialEq + ToString = &'static str>(T);

impl Id {
    pub fn new<T>(value: T) -> Id<T>
    where
        T: PartialEq + ToString,
    {
        Id(value)
    }

    pub(crate) fn create<T>(factory: &UuidFactory) -> T
    where
        T: DomainId,
    {
        T::new(factory.create())
    }
}

impl<T> Display for Id<T>
where
    T: PartialEq + ToString,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(format!("{}", self.0.to_string()).as_str())
    }
}

pub trait DomainId {
    fn new(uuid: Uuid) -> Self
    where
        Self: Sized;
}
