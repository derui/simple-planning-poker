use js_sys::Object;
use wasm_bindgen::JsValue;

use crate::{
    domains::{
        game::{GameId, GameRepository},
        game_player::{GamePlayer, GamePlayerId, GamePlayerRepository, UserMode},
        user::UserId,
    },
    utils::types::LocalBoxFuture,
};

use super::{
    card_converter,
    database::Database,
    firebase::database::{self, child, reference, reference_with_key, update, val},
};

struct S(String);

impl Into<JsValue> for S {
    fn into(self) -> JsValue {
        JsValue::from_str(self.0.as_str())
    }
}

impl GamePlayerRepository for Database {
    fn save<'a>(&'a self, player: &'a GamePlayer) -> LocalBoxFuture<'a, ()> {
        let updates = js_sys::Map::new();

        let game = player.game();
        let key = format!(
            "/games/{}/users/{}",
            game.to_string(),
            player.id().to_string()
        );
        updates.set(&S(key).into(), &S(player.mode().to_string()).into());

        if let Some(hand) = player.hand() {
            let card = card_converter::serialize(hand);

            let key = format!(
                "/games/{}/userHands/{}",
                game.to_string(),
                player.id().to_string()
            );
            updates.set(&S(key).into(), &card);
        }
        let key = format!("/gamePlayers/{}/user", player.id().to_string());
        updates.set(&S(key).into(), &S(player.user().to_string()).into());

        let key = format!("/gamePlayers/{}/game", player.id().to_string());
        updates.set(&S(key).into(), &S(player.game().to_string()).into());

        let key = format!(
            "/users/{}/joinedGames/{}/playerId",
            player.user().to_string(),
            player.game().to_string()
        );
        updates.set(&S(key).into(), &S(player.id().to_string()).into());

        let reference = reference(&self.database);
        let fut = async move { update(&reference, &Object::from_entries(&updates).unwrap()).await };
        Box::pin(fut)
    }

    fn find_by<'a>(&'a self, id: GamePlayerId) -> LocalBoxFuture<'a, Option<GamePlayer>> {
        let database = self.clone();

        Box::pin(async move {
            let id = id.clone();
            let reference = child(
                &reference_with_key(&database.database, "gamePlayers"),
                id.to_string().as_str(),
            );
            let snapshot = database::get(&reference).await;
            let v = val(&snapshot);

            if v.is_falsy() {
                return None;
            }

            let game_id = js_sys::Reflect::get(&v, &S("game".to_owned()).into())
                .map(|v| v.as_string().unwrap())
                .unwrap();
            let user_id = js_sys::Reflect::get(&v, &S("user".to_owned()).into())
                .map(|v| v.as_string().unwrap())
                .unwrap();

            let reference = child(
                &child(&reference_with_key(&database.database, "games"), &game_id),
                "users",
            );
            let snapshot = database::get(&reference).await;
            let v = val(&snapshot);
            if v.is_falsy() {
                return None;
            }

            let mode = js_sys::Reflect::get(&v, &S(user_id.clone()).into())
                .map(|v| UserMode::from(v.as_string().unwrap()))
                .unwrap();
            let game = GameRepository::find_by(self, GameId::from(game_id)).await;

            game.map(|game| {
                let hand = game.player_hand(id).map(|v| v.clone());
                let cards = game.cards().clone();

                GamePlayer::new(id, game.id(), UserId::from(user_id), hand, &cards, mode)
            })
        })
    }

    fn find_by_user_and_game<'a>(
        &'a self,
        user_id: UserId,
        game_id: GameId,
    ) -> LocalBoxFuture<'a, Option<GamePlayer>> {
        let database = self.clone();
        let fut = async move {
            let reference = format!(
                "/users/{}/joinedGames/{}",
                user_id.to_string(),
                game_id.to_string()
            );
            let snapshot = database::get(&reference_with_key(&database.database, &reference)).await;

            let v = val(&snapshot);
            let v = js_sys::Reflect::get(&v, &key("playerId"));

            match v {
                Err(_) => None,
                Ok(v) => {
                    let game_player_id = GamePlayerId::from(v.as_string().unwrap());

                    GamePlayerRepository::find_by(self, game_player_id).await
                }
            }
        };
        Box::pin(fut)
    }

    fn delete<'a>(&'a self, player: &'a GamePlayer) -> LocalBoxFuture<'a, ()> {
        let v = js_sys::Map::new();
        let player_id = player.id();
        let game = player.game();
        let user = player.user();
        v.set(
            &key(&format!(
                "/games/{}/users/{}",
                game.to_string(),
                player_id.to_string()
            )),
            &JsValue::NULL,
        );
        v.set(
            &key(&format!(
                "/games/{}/userHands/{}",
                game.to_string(),
                player_id.to_string()
            )),
            &JsValue::NULL,
        );
        v.set(
            &key(&format!("/gamePlayers/{}", player_id.to_string())),
            &JsValue::NULL,
        );
        v.set(
            &key(&format!(
                "/users/{}/joinedGames/{}",
                user.to_string(),
                game.to_string()
            )),
            &JsValue::NULL,
        );

        let reference = reference(&self.database);
        let fut = async move { update(&reference, &Object::from_entries(&v).unwrap()).await };
        Box::pin(fut)
    }
}

fn key(k: &str) -> JsValue {
    JsValue::from_str(k)
}
