use js_sys::Object;
use wasm_bindgen::JsValue;

use crate::{
    domains::{
        event::{DomainEvent, DomainEventKind},
        game_player::{GamePlayer, GamePlayerRepository, UserMode},
    },
    infrastructures::{
        database::Database,
        firebase::database::{child, reference_with_key, remove, set_value, update},
    },
    utils::types::LocalBoxFuture,
};

use super::event_dispatcher::EventListener;

pub struct GameShowedDownEventListener {
    database: Database,
}

impl GameShowedDownEventListener {
    pub fn new(database: &Database) -> Self {
        Self {
            database: database.clone(),
        }
    }
}

impl<'a> EventListener<'a> for GameShowedDownEventListener {
    fn handle(&self, event: &DomainEvent) -> LocalBoxFuture<'a, ()> {
        match event.kind() {
            &DomainEventKind::GameShowedDown { game_id } => {
                let key = format!("/games/{}/", game_id.to_string());
                let target = reference_with_key(&self.database.database, &key);
                let obj = Object::new();
                let key = JsValue::from_str("showedDown");
                js_sys::Reflect::set(&obj, &key, &JsValue::from_bool(true)).unwrap();

                Box::pin(async move { update(&target, &obj).await })
            }
            _ => Box::pin(async {}),
        }
    }
}

pub struct GameCreatedEventListener {
    database: Database,
}

impl GameCreatedEventListener {
    pub fn new(database: &Database) -> Self {
        Self {
            database: database.clone(),
        }
    }
}

impl<'a> EventListener<'a> for GameCreatedEventListener {
    fn handle(&self, event: &DomainEvent) -> LocalBoxFuture<'a, ()> {
        let event = event.kind();
        match event {
            DomainEventKind::GameCreated {
                game_id,
                created_game_player_id,
                created_user_id,
                selectable_cards,
                name: _,
            } => {
                let cards = selectable_cards.clone();
                let game_player = GamePlayer::new(
                    *created_game_player_id,
                    *game_id,
                    *created_user_id,
                    None,
                    &cards,
                    UserMode::Normal,
                );
                let database = self.database.clone();

                Box::pin(async move { GamePlayerRepository::save(&database, &game_player).await })
            }
            _ => Box::pin(async {}),
        }
    }
}

pub struct NewGameStartedEventListener {
    database: Database,
}

impl NewGameStartedEventListener {
    pub fn new(database: &Database) -> Self {
        Self {
            database: database.clone(),
        }
    }
}

impl<'a> EventListener<'a> for NewGameStartedEventListener {
    fn handle(&self, event: &DomainEvent) -> LocalBoxFuture<'a, ()> {
        let event = event.kind();
        match event {
            DomainEventKind::NewGameStarted { game_id } => {
                let key = format!("/games/{}", game_id.to_string());

                let database = self.database.clone();

                let fut = async move {
                    let base_ref = reference_with_key(&database.database, &key);
                    remove(&child(&base_ref, "userHands")).await;
                    set_value(&child(&base_ref, "showedDown"), &JsValue::from_bool(false)).await;
                };
                Box::pin(fut)
            }
            _ => Box::pin(async {}),
        }
    }
}
