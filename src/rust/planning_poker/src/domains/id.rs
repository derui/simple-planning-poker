use std::fmt::{Debug, Display};

use crate::utils::uuid_factory::UuidFactory;

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug)]
pub struct Id<T: PartialEq + ToString = &'static str>(T);

impl Id {
    pub fn new<T>(value: T) -> Id<T>
    where
        T: PartialEq + ToString,
    {
        Id(value)
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

pub trait IdLike {
    fn new(uuid_factory: &UuidFactory) -> Self;
}
