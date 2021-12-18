// base entity type. Entity's id must not be modifiable.
pub trait Entity<Id> {
    fn id(&self) -> Id;
}
