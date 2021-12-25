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
        let fut = async move { update(&reference, updates).await };
        Box::pin(fut)
    }

    fn find_by(&self, id: GamePlayerId) -> LocalBoxFuture<'static, Option<GamePlayer>> {
        let database = self.clone();
        Box::pin(async move { internal::find_by(&database, id).await })
    }

    fn find_by_user_and_game(
        &self,
        _user_id: UserId,
        _game_id: GameId,
    ) -> LocalBoxFuture<'static, Option<GamePlayer>> {
        todo!()
    }

    fn delete<'a>(&'a self, player: &'a GamePlayer) -> LocalBoxFuture<'a, ()> {
        let v = js_sys::Map::new();
        let player_id = player.id();
        let game = player.game();
        let user = player.user();
        v.set(
            &key(format!(
                "/games/{}/users/{}",
                game.to_string(),
                player_id.to_string()
            )),
            &JsValue::NULL,
        );
        v.set(
            &key(format!(
                "/games/{}/userHands/{}",
                game.to_string(),
                player_id.to_string()
            )),
            &JsValue::NULL,
        );
        v.set(
            &key(format!("/gamePlayers/{}", player_id.to_string())),
            &JsValue::NULL,
        );
        v.set(
            &key(format!(
                "/users/{}/joinedGames/{}",
                user.to_string(),
                game.to_string()
            )),
            &JsValue::NULL,
        );

        let reference = reference(&self.database);
        let fut = async move { update(&reference, v).await };
        Box::pin(fut)
    }
}

fn key(k: String) -> JsValue {
    JsValue::from_str(k.as_str())
}

mod internal {
    use super::*;

    pub async fn save(database: &Database, player: &GamePlayer) {
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

        let reference = reference(&database.database);
        update(&reference, updates).await
    }

    pub async fn find_by(database: &Database, id: GamePlayerId) -> Option<GamePlayer> {
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
        let game = GameRepository::find_by(database, GameId::from(game_id)).await;

        game.map(|game| {
            let hand = game.player_hand(id).map(|v| v.clone());
            let cards = game.cards().clone();

            GamePlayer::new(id, game.id(), UserId::from(user_id), hand, &cards, mode)
        })
    }

    pub async fn find_by_user_and_game(
        _database: &Database,
        _user_id: UserId,
        _game_id: GameId,
    ) -> Option<GamePlayer> {
        todo!()
    }

    pub async fn delete(database: &Database, player: &GamePlayer) {
        let v = js_sys::Map::new();
        let player_id = player.id();
        let game = player.game();
        let user = player.user();
        v.set(
            &key(format!(
                "/games/{}/users/{}",
                game.to_string(),
                player_id.to_string()
            )),
            &JsValue::NULL,
        );
        v.set(
            &key(format!(
                "/games/{}/userHands/{}",
                game.to_string(),
                player_id.to_string()
            )),
            &JsValue::NULL,
        );
        v.set(
            &key(format!("/gamePlayers/{}", player_id.to_string())),
            &JsValue::NULL,
        );
        v.set(
            &key(format!(
                "/users/{}/joinedGames/{}",
                user.to_string(),
                game.to_string()
            )),
            &JsValue::NULL,
        );

        let reference = reference(&database.database);
        update(&reference, v).await
    }
}
