use std::{collections::HashMap, future::Future, pin::Pin};

use js_sys::{Array, Object};
use uuid::Uuid;
use wasm_bindgen::JsValue;

use crate::domains::{
    game::GameId,
    game_player::GamePlayerId,
    id::DomainId,
    user::{JoinedGame, User, UserId, UserRepository},
};

use super::firebase::{
    self,
    database::{self, reference, update, val},
};

pub struct Impl {
    database: firebase::database::Database,
}

impl UserRepository for Impl {
    type SaveOutput = Pin<Box<dyn Future<Output = ()>>>;
    type FindByOutput = Pin<Box<dyn Future<Output = Option<User>>>>;

    fn save(&self, user: &User) -> Self::SaveOutput {
        let reference = reference(&self.database);
        let mut updates = HashMap::new();

        let key = format!("users/{}/name", user.id().to_string());
        updates.insert(key, user.name());

        user.joined_games().iter().for_each(|v| {
            let key = format!(
                "games/{}/users/{}/name",
                v.game.to_string(),
                v.game_player.to_string()
            );
            updates.insert(key, user.name());
        });

        let v = match JsValue::from_serde(&updates) {
            Ok(it) => it,
            Err(err) => panic!("get error {}", err),
        };
        let v = js_sys::Map::from(v);

        let fut = async move { update(&reference, v).await };
        Box::pin(fut)
    }

    fn find_by(&self, id: UserId) -> Self::FindByOutput {
        let reference = reference(&self.database);

        let fut = async move {
            let v = database::get(&reference).await;
            let v = val(&v);

            if v.is_falsy() {
                return None;
            }

            let name = js_sys::Reflect::get(&v, &JsValue::from_str("name"))
                .map(|v| v.as_string().unwrap())
                .unwrap();
            let joined_games = js_sys::Reflect::get(&v, &JsValue::from_str("joinedGames"))
                .unwrap_or(JsValue::undefined());

            let joined_games = if joined_games.is_falsy() {
                vec![]
            } else {
                js_sys::Object::entries(&Object::from(v))
                    .iter()
                    .map(|v| {
                        let v = Array::from(&v);
                        let id = js_sys::Array::get(&v, 0)
                            .as_string()
                            .map(|v| Uuid::parse_str(v.as_str()).unwrap())
                            .unwrap();
                        let info = js_sys::Array::get(&v, 1);
                        let player_id = js_sys::Reflect::get(&info, &JsValue::from_str("playerId"))
                            .map(|v| v.as_string().unwrap_or(String::from("")))
                            .map(|v| uuid::Uuid::parse_str(v.as_str()).unwrap())
                            .unwrap();
                        JoinedGame {
                            game: GameId::new(id),
                            game_player: GamePlayerId::new(player_id),
                        }
                    })
                    .collect::<Vec<JoinedGame>>()
            };
            Some(User::new(id, &name, &joined_games))

            // const name = val["name"] as string;
            // const rawJoinedGames = (val.joinedGames as { [k: string]: { playerId: string } } | undefined) ?? {};
            // const joinedGames: JoinedGame[] = Object.entries(rawJoinedGames).map(([gameId, gameInfo]) => {
            //   return { gameId: gameId as GameId, playerId: gameInfo.playerId as GamePlayerId };
            // });

            // return createUser({ id, name, joinedGames });
        };

        Box::pin(fut)
    }
}
