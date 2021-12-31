use std::{cell::RefCell, collections::HashMap};

use crate::{
    domains::{
        id::Id,
        user::{HaveUserRepository, User, UserId, UserRepository},
    },
    usecases::change_user_name::ChangeUserNameOutput,
    utils::{types::LocalBoxFuture, uuid_factory::DefaultUuidFactory},
};

use super::{ChangeUserName, ChangeUserNameDependency};

struct Mock {
    map: RefCell<HashMap<UserId, User>>,
}
impl Mock {
    fn new() -> Self {
        Self {
            map: RefCell::new(HashMap::new()),
        }
    }
}

impl UserRepository for Mock {
    fn save<'a>(&'a self, user: &'a User) -> LocalBoxFuture<'a, ()> {
        let mut map = self.map.borrow_mut();
        map.insert(user.id(), user.clone());

        Box::pin(async {})
    }

    fn find_by(&'_ self, id: UserId) -> LocalBoxFuture<'_, Option<User>> {
        let result = self.map.borrow().get(&id).cloned();

        Box::pin(async move { result })
    }
}

impl HaveUserRepository for Mock {
    type T = Mock;

    fn get_user_repository(&self) -> &Self::T {
        self
    }
}

impl ChangeUserNameDependency for Mock {}

#[tokio::test]
async fn should_return_error_if_not_found() {
    // arrange
    let mock = Mock::new();
    let uuid_factory = DefaultUuidFactory::default();
    let user_id = Id::create(&uuid_factory);

    // do
    let output = mock.execute(user_id, "a").await;

    // verify
    assert_eq!(output, Err(ChangeUserNameOutput::NotFound))
}

#[tokio::test]
async fn should_return_error_if_new_name_is_invalid() {
    // arrange
    let mock = Mock::new();
    let uuid_factory = DefaultUuidFactory::default();
    let user_id = Id::create(&uuid_factory);
    let user = User::new(user_id, "name", &[]);
    mock.save(&user).await;

    // do
    let output = mock.execute(user.id(), "").await;

    // verify
    assert_eq!(output, Err(ChangeUserNameOutput::CanNotChangeName))
}

#[tokio::test]
async fn should_be_change_name() {
    // arrange
    let mock = Mock::new();
    let uuid_factory = DefaultUuidFactory::default();
    let user_id = Id::create(&uuid_factory);
    let user = User::new(user_id, "name", &[]);
    mock.save(&user).await;

    // do
    let output = mock.execute(user_id, "foobar").await;

    // verify
    assert_eq!(*output.unwrap().name(), "foobar".to_owned())
}
