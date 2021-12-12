use super::story_point::StoryPoint;

#[cfg(test)]
mod tests;

#[derive(Debug, PartialEq, Clone)]
enum CardInner {
    GiveUpCard,
    StoryPointCard(StoryPoint),
}

#[derive(Debug, PartialEq, Clone)]
pub struct Card(CardInner);

impl Card {
    pub fn giveup() -> Card {
        Card(CardInner::GiveUpCard)
    }

    pub fn storypoint(point: StoryPoint) -> Card {
        Card(CardInner::StoryPointCard(point))
    }

    pub fn as_story_point(&self) -> Option<StoryPoint> {
        match self.0 {
            CardInner::GiveUpCard => None,
            CardInner::StoryPointCard(s) => Some(s),
        }
    }
}
