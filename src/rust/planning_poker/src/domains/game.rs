use domain_macro::DomainId;
use uuid::Uuid;

use super::id::{DomainId, Id};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug, DomainId, Clone, Copy)]
pub struct GameId(Id<Uuid>);
