use std::sync::Arc;

use super::firebase;

pub struct Database {
    pub database: Arc<firebase::database::Database>,
}

impl Database {
    pub fn new() -> Self {
        Self {
            database: Arc::new(firebase::database::new()),
        }
    }
}

impl Clone for Database {
    fn clone(&self) -> Self {
        Self {
            database: Arc::clone(&self.database),
        }
    }
}
