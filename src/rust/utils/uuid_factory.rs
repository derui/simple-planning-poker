use uuid::Uuid;

pub struct UuidFactory<'a> {
    new: &'a dyn Fn() -> Uuid,
}

fn default_uuid_factory() -> Uuid {
    Uuid::new_v4()
}

impl<'a> UuidFactory<'a> {
    pub fn default() -> Self {
        UuidFactory {
            new: &default_uuid_factory,
        }
    }

    pub fn new(f: &'a dyn Fn() -> Uuid) -> Self {
        UuidFactory { new: f }
    }

    pub fn create(&self) -> Uuid {
        (*self.new)()
    }
}
