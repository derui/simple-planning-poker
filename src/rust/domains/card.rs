use crate::domains::story_point::StoryPoint;

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

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn should_return_none_if_giveup_card() {
        // arrange
        let v = Card::giveup();

        // do
        let actual = v.as_story_point();

        // arrange
        assert_eq!(actual, None)
    }

    #[test]
    fn should_return_point_if_storypoint_card() {
        // arrange
        let v = Card::storypoint(StoryPoint::new(4));

        // do
        let actual = v.as_story_point();

        // arrange
        assert_eq!(actual, Some(StoryPoint::new(4)))
    }
}
