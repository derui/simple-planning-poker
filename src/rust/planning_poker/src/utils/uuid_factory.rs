use uuid::Uuid;

pub trait UuidFactory {
    fn create(&self) -> Uuid;
}

pub struct DefaultUuidFactory;
impl DefaultUuidFactory {
    pub fn new() -> Self {
        Self {}
    }
}
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
