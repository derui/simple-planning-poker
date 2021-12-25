use wasm_bindgen::JsValue;

use crate::domains::{card::Card, story_point::StoryPoint};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug)]
pub enum SerializedCard {
    Giveup,
    StoryPoint(u32),
}

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
    JsValue::from(map)
}

pub fn deserialize(object: &JsValue) -> Result<Card, JsValue> {
    let kind = js_sys::Reflect::get(object, &JsValue::from_str("kind"))?.as_string();
    let storypoint = js_sys::Reflect::get(object, &JsValue::from_str("storypoint"));

    match kind.as_deref() {
        Some("giveup") => Ok(Card::giveup()),
        Some("storypoint") => {
            let v = storypoint?;
            let v: u32 = v.as_f64().map(|v| v as u32).unwrap();
            Ok(Card::storypoint(StoryPoint::new(v)))
        }
        Some(_) | None => Err(JsValue::from_str("error")),
    }
}
