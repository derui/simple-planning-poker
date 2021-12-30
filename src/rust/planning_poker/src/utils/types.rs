use std::{future::Future, pin::Pin};

pub type LocalBoxFuture<'a, T> = Pin<Box<dyn Future<Output = T> + 'a>>;
