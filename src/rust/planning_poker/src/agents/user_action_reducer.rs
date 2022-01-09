use crate::usecases::change_user_name::ChangeUserName;

use super::{
    global_bus::{InnerMessage, UserActions},
    global_status::GlobalStatus,
};

mod internal {

    use crate::agents::global_status::GlobalStatus;

    use super::*;

    pub async fn change_user_name(this: &GlobalStatus, name: String) -> Vec<InnerMessage> {
        let user = this.current_user.borrow();
        let user = match &*user {
            Some(v) => v,
            None => return vec![],
        };

        let result = ChangeUserName::execute(this, user.id(), &name).await;
        if let Ok(user) = result {
            this.publish_snapshot().await;
            vec![InnerMessage::UpdateUser(user)]
        } else {
            vec![]
        }
    }
}

pub async fn reduce_user_actions(this: &GlobalStatus, msg: UserActions) -> Vec<InnerMessage> {
    match msg {
        UserActions::ChangeUserName(name) => internal::change_user_name(this, name).await,
    }
}
