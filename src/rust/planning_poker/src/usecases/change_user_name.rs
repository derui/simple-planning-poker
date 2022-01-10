use crate::{
    domains::user::{HaveUserRepository, User, UserId, UserRepository},
    utils::types::LocalBoxFuture,
};

#[cfg(test)]
mod tests;

pub trait ChangeUserNameDependency: HaveUserRepository {}

#[derive(PartialEq, Debug)]
pub enum ChangeUserNameOutput {
    NotFound,
    CanNotChangeName,
}

pub trait ChangeUserName {
    fn execute(
        &self,
        user_id: UserId,
        name: &str,
    ) -> LocalBoxFuture<'_, Result<User, ChangeUserNameOutput>>;
}

impl<T: ChangeUserNameDependency> ChangeUserName for T {
    fn execute<'a>(
        &'a self,
        user_id: UserId,
        name: &str,
    ) -> LocalBoxFuture<'a, Result<User, ChangeUserNameOutput>> {
        let repository = self.get_user_repository();
        let name = name.to_owned();

        let fut = async move {
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
        };

        Box::pin(fut)
    }
}
