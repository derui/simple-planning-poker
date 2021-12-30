use super::story_point::StoryPoint;

use super::card::Card;

#[cfg(test)]
mod tests;

#[derive(Debug, PartialEq, Clone)]
pub struct SelectableCards {
    cards: Vec<Card>,
}

fn unique_vec(vec: &[StoryPoint]) -> Vec<StoryPoint> {
    let mut accum = vec![];

    for v in vec.iter() {
        if !accum.contains(v) {
            accum.push(*v)
        }
    }

    accum
}

impl SelectableCards {
    pub fn is_valid_storypoints(vec: &[StoryPoint]) -> bool {
        let uniqued = unique_vec(vec);

        !uniqued.is_empty()
    }

    pub fn new(points: &[StoryPoint]) -> Self {
        if !SelectableCards::is_valid_storypoints(points) {
            panic!("story points must be unique in list")
        }
        let points = unique_vec(points);
        let mut cards = points
            .iter()
            .map(|v| Card::storypoint(*v))
            .collect::<Vec<Card>>();
        cards.push(Card::giveup());

        Self { cards }
    }

    pub fn at(&self, index: usize) -> Option<&Card> {
        if index >= self.cards.len() - 1 {
            None
        } else {
            self.cards.get(index)
        }
    }

    pub fn contains(&self, card: &Card) -> bool {
        self.cards.contains(card)
    }

    pub fn giveup(&self) -> &Card {
        &self.cards[self.cards.len() - 1]
    }

    pub fn storypoints(&self) -> Vec<StoryPoint> {
        self.cards
            .iter()
            .filter_map(|v| v.as_story_point())
            .collect::<Vec<StoryPoint>>()
    }
}
