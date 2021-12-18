use domain_macro::DomainId;
use uuid::Uuid;

use super::id::{DomainId, Id};

#[derive(PartialEq, Debug, DomainId, Clone, Copy)]
pub struct UserId(Id<Uuid>);
