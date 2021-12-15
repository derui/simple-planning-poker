use crate::utils::uuid_factory::UuidFactory;
use uuid::Uuid;

use super::id::Id;

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug)]
pub struct GameId(Id<Uuid>);

impl GameId {
    pub fn new(uuid_factory: UuidFactory) -> GameId {
        let v = uuid_factory.create();

        GameId(Id::new(v))
    }
}

impl ToString for GameId {
    fn to_string(&self) -> String {
        format!("{}", self.0.to_string())
    }
}
