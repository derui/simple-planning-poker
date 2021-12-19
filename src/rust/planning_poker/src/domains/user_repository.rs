use super::user::{User, UserId};

/// Repository interface for [User]
pub trait UserRepository {
    fn save(user: &User);

    fn find_by(id: UserId) -> Option<User>;
}
