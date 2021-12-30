use uuid::Uuid;

pub trait UuidFactory {
    fn create(&self) -> Uuid;
}

#[derive(Default)]
pub struct DefaultUuidFactory;

impl UuidFactory for DefaultUuidFactory {
    fn create(&self) -> Uuid {
        Uuid::new_v4()
    }
}

pub struct FunctionUuidFactory<'a> {
    function: &'a dyn Fn() -> Uuid,
}
impl<'a> FunctionUuidFactory<'a> {
    pub fn new<F>(f: &'a F) -> Self
    where
        F: Fn() -> Uuid,
    {
        Self { function: f }
    }
}

impl UuidFactory for FunctionUuidFactory<'static> {
    fn create(&self) -> Uuid {
        let f = self.function;
        f()
    }
}

pub trait HaveUuidFactory {
    type T: UuidFactory;

    fn get_uuid_factory(&self) -> &Self::T;
}
