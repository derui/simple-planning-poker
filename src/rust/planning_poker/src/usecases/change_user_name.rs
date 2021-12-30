use crate::{
    domains::user::{HaveUserRepository, User, UserId, UserRepository},
    utils::types::LocalBoxFuture,
};

pub trait ChangeUserNameDependency: HaveUserRepository {}

pub enum ChangeUserNameOutput {
    NotFound,
    CanNotChangeName,
}

pub trait ChangeUserName {
    fn execute<'a>(
        &'a self,
        user_id: UserId,
        name: &str,
    ) -> LocalBoxFuture<'a, Result<User, ChangeUserNameOutput>>;
}

impl<T: ChangeUserNameDependency> ChangeUserName for T {
    fn execute<'a>(
        &'a self,
        user_id: UserId,
        name: &str,
    ) -> LocalBoxFuture<'a, Result<User, ChangeUserNameOutput>> {
        let repository = self.get_user_repository();
        let name = name.to_owned();

        Box::pin(execute(repository, user_id, name))
    }
}

// internal implementation
async fn execute(
    repository: &dyn UserRepository,
    user_id: UserId,
    name: String,
) -> Result<User, ChangeUserNameOutput> {
    let user = repository.find_by(user_id).await;

    match user {
        None => Err(ChangeUserNameOutput::NotFound),
        Some(mut user) => {
            if !User::can_change_name(&name) {
                return Err(ChangeUserNameOutput::CanNotChangeName);
            }

            user.change_name(&name);
            repository.save(&user).await;

            Ok(user)
        }
    }
}
