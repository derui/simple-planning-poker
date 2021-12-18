use crate::utils::uuid_factory::UuidFactory;
use domain_id::IdLike;
use uuid::Uuid;

use super::id::{Id, IdLike};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug, IdLike)]
pub struct GameId(Id<Uuid>);
