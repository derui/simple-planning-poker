use crate::usecases::change_user_name::ChangeUserName;

use super::{
    global_bus::{GlobalStatusUpdateMessage, InnerMessage, UserActions},
    global_status::GlobalStatus,
};

mod internal {

    use crate::agents::global_status::GlobalStatus;

    use super::*;

    pub async fn change_user_name(
        this: &GlobalStatus,
        name: String,
    ) -> Option<GlobalStatusUpdateMessage> {
        let user = this.current_user.borrow();
        let user = match &*user {
            Some(v) => v,
            None => return None,
        };

        let result = ChangeUserName::execute(this, user.id(), &name).await;
        if let Ok(user) = result {
            this.publish_snapshot().await;
            Some(GlobalStatusUpdateMessage::new(vec![
                InnerMessage::UpdateUser(user),
            ]))
        } else {
            None
        }
    }
}

pub async fn reduce_user_actions(
    this: &GlobalStatus,
    msg: UserActions,
) -> Option<GlobalStatusUpdateMessage> {
    match msg {
        UserActions::ChangeUserName(name) => internal::change_user_name(this, name).await,
    }
}
