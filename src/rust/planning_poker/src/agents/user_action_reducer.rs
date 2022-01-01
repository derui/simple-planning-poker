use crate::usecases::change_user_name::ChangeUserName;

use super::global_bus::{GlobalStatus, InnerMessage, UserActions};

mod internal {

    use super::*;

    pub async fn change_user_name(this: &GlobalStatus, name: String) -> Vec<InnerMessage> {
        let user = match this.current_user.clone() {
            Some(v) => v,
            None => return vec![],
        };

        let result = ChangeUserName::execute(this, user.id(), &name).await;
        if let Ok(user) = result {
            vec![InnerMessage::UpdateUser(user)]
        } else {
            vec![]
        }
    }
}

pub async fn reduce_sign_in(this: &GlobalStatus, msg: UserActions) -> Vec<InnerMessage> {
    match msg {
        UserActions::ChangeUserName(name) => internal::change_user_name(this, name).await,
    }
}
