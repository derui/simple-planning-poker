use uuid::Uuid;

use crate::utils::uuid_factory::UuidFactory;

use super::id::Id;

#[derive(PartialEq, Debug)]
pub struct UserId(Id<Uuid>);

impl UserId {
    pub fn new(uuid_factory: UuidFactory) -> Self {
        let v = uuid_factory.create();

        Self(Id::new(v))
    }
}

impl ToString for UserId {
    fn to_string(&self) -> String {
        format!("{}", self.0.to_string())
    }
}
