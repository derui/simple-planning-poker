use js_sys::Object;
use wasm_bindgen::JsValue;

use crate::domains::game::{Game, GameId, GameRepository};
use crate::domains::game_player::GamePlayerId;
use crate::domains::invitation::InvitationSignature;
use crate::domains::selectable_cards::SelectableCards;
use crate::domains::story_point::StoryPoint;
use crate::utils::types::LocalBoxFuture;

use super::card_converter::deserialize;
use super::firebase::database::{child, get, reference, reference_with_key, update, val};
use super::firebase::Database;

fn js_value(s: &str) -> JsValue {
    JsValue::from_str(s)
}

mod resolver {
    use wasm_bindgen::JsValue;

    use crate::domains::{
        game::GameId,
        invitation::{Invitation, InvitationSignature},
    };

    use super::js_value;

    pub fn name(game: GameId) -> JsValue {
        js_value(&format!("/games/{}/name", game.to_string()))
    }
    pub fn user_hands(game: GameId) -> JsValue {
        js_value(&format!("/games/{}/userHands", game.to_string()))
    }
    pub fn cards(game: GameId) -> JsValue {
        js_value(&format!("/games/{}/cards", game.to_string()))
    }
    pub fn showed_down(game: GameId) -> JsValue {
        js_value(&format!("/games/{}/showedDown", game.to_string()))
    }
    pub fn users(game: GameId) -> JsValue {
        js_value(&format!("/games/{}/users", game.to_string()))
    }
    pub fn invitation(invitation: Invitation) -> JsValue {
        js_value(&format!(
            "/invitations/{}",
            invitation.signature().to_string()
        ))
    }

    pub fn invitation_by_signature(signature: InvitationSignature) -> JsValue {
        js_value(&format!("/invitations/{}", signature.to_string()))
    }
}

impl GameRepository for Database {
    fn save<'a>(&'a self, game: &'a Game) -> LocalBoxFuture<'a, ()> {
        let updates = js_sys::Map::new();

        updates.set(&resolver::name(game.id()), &js_value(game.name()));
        updates.set(
            &resolver::showed_down(game.id()),
            &JsValue::from_bool(game.showed_down()),
        );

        let cards = js_sys::Array::new();
        game.cards().storypoints().iter().for_each(|v| {
            cards.push(&JsValue::from_f64(v.as_u32() as f64));
        });
        let cards = JsValue::from(cards);
        updates.set(&resolver::cards(game.id()), &cards);
        updates.set(
            &resolver::invitation(game.make_invitation()),
            &js_value(&game.id().to_string()),
        );
        let updates = js_sys::Object::from_entries(&updates).unwrap();

        let reference = reference(&self.database);
        Box::pin(async move { update(&reference, &updates).await })
    }

    fn find_by<'a>(&'a self, id: GameId) -> LocalBoxFuture<'a, Option<Game>> {
        let db = self.clone();

        Box::pin(async move {
            let snapshot = get(&child(
                &reference_with_key(&db.database, "games"),
                &id.to_string(),
            ))
            .await;
            let val = val(&snapshot);
            if val.is_falsy() {
                return None;
            }

            let game = {
                let name = js_sys::Reflect::get(&val, &js_value("name")).expect("should be exists");
                let cards =
                    js_sys::Reflect::get(&val, &js_value("cards")).unwrap_or(JsValue::UNDEFINED);
                let players =
                    js_sys::Reflect::get(&val, &js_value("players")).unwrap_or(JsValue::UNDEFINED);
                let showed_down =
                    js_sys::Reflect::get(&val, &js_value("showedDown")).unwrap_or(JsValue::FALSE);
                let hands = js_sys::Reflect::get(&val, &js_value("userHands"))
                    .unwrap_or(JsValue::UNDEFINED);

                let selectable_cards = if cards.is_falsy() {
                    js_sys::Array::new()
                } else {
                    js_sys::Array::from(&cards)
                };
                let selectable_cards = selectable_cards
                    .iter()
                    .filter_map(|v| v.as_f64().map(|v| v as u32).map(|v| StoryPoint::new(v)))
                    .collect::<Vec<StoryPoint>>();
                let selectable_cards = SelectableCards::new(&selectable_cards);

                let players = if players.is_falsy() {
                    js_sys::Array::new()
                } else {
                    js_sys::Object::keys(&js_sys::Object::from(players))
                };
                let players = players
                    .iter()
                    .filter_map(|v| v.as_string().map(|v| GamePlayerId::from(v)))
                    .collect::<Vec<GamePlayerId>>();

                let mut tmp = Game::new(
                    id,
                    &name.as_string().unwrap_or("".to_owned()),
                    &players,
                    &selectable_cards,
                );

                let hands = if hands.is_falsy() {
                    js_sys::Array::new()
                } else {
                    Object::entries(&Object::from(hands))
                };
                if showed_down.is_truthy() {
                    tmp.show_down(|_| {});
                }
                apply_hands(&mut tmp, &hands);
                tmp
            };

            Some(game)
        })
    }

    fn find_by_invitation_signature<'a>(
        &'a self,
        signature: InvitationSignature,
    ) -> LocalBoxFuture<'a, Option<Game>> {
        let db_ref = child(
            &reference_with_key(&self.database, "signatures"),
            &signature.to_string(),
        );

        Box::pin(async move {
            let game_id = get(&db_ref).await.as_string().map(|v| GameId::from(v));

            match game_id {
                None => None,
                Some(game_id) => self.find_by(game_id).await,
            }
        })
    }
}

fn apply_hands(game: &mut Game, hands: &js_sys::Array) {
    hands.iter().for_each(|v| {
        let v = js_sys::Array::from(&v);
        let player_id = v.get(0).as_string().map(|v| GamePlayerId::from(v)).unwrap();
        let card = deserialize(&v.get(1));

        match card {
            Err(_) => return,
            Ok(card) => game.give_player_hand(player_id, &card),
        }
    })
}
