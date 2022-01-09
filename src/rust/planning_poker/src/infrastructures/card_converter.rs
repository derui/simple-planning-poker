use wasm_bindgen::JsValue;

use crate::domains::{card::Card, story_point::StoryPoint};

fn value(v: &str) -> JsValue {
    JsValue::from_str(v)
}

pub fn serialize(card: &Card) -> JsValue {
    let map = js_sys::Map::new();
    let card = card.as_story_point();
    match card {
        None => map.set(&value("kind"), &value("giveup")),
        Some(v) => {
            map.set(&value("kind"), &value("storypoint"));
            map.set(&value("storypoint"), &value(&v.as_u32().to_string()))
        }
    };

    // no throw error
    JsValue::from(js_sys::Object::from_entries(&map).unwrap())
}

pub fn deserialize(object: &JsValue) -> Result<Card, JsValue> {
    let kind = js_sys::Reflect::get(object, &JsValue::from_str("kind"))?.as_string();
    let storypoint = js_sys::Reflect::get(object, &JsValue::from_str("storypoint"));

    match kind.as_deref() {
        Some("giveup") => Ok(Card::giveup()),
        Some("storypoint") => {
            let v = storypoint?;
            let v: u32 = v.as_string().map_or(0, |v| v.parse::<u32>().unwrap_or(0));
            Ok(Card::storypoint(StoryPoint::new(v)))
        }
        Some(_) | None => Err(JsValue::from_str("error")),
    }
}
