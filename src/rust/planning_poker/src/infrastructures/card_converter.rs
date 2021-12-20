use crate::domains::{card::Card, story_point::StoryPoint};

#[cfg(test)]
mod tests;

#[derive(PartialEq, Debug)]
pub enum SerializedCard {
    Giveup,
    StoryPoint(u32),
}

impl SerializedCard {
    pub fn serialize(card: &Card) -> Self {
        match card.as_story_point() {
            None => Self::Giveup,
            Some(v) => Self::StoryPoint(v.as_u32()),
        }
    }

    pub fn deserialize(card: &Self) -> Card {
        match *card {
            Self::Giveup => Card::giveup(),
            Self::StoryPoint(v) => Card::storypoint(StoryPoint::new(v)),
        }
    }
}
