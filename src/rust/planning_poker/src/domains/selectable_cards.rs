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
            accum.push(v.clone())
        }
    }

    accum
}

fn is_valid_storypoints(vec: &[StoryPoint]) -> bool {
    let uniqued = unique_vec(vec);

    uniqued.len() > 0
}

impl SelectableCards {
    pub fn new(points: &[StoryPoint]) -> Self {
        if !is_valid_storypoints(points) {
            panic!("story points must be unique in list")
        }
        let points = unique_vec(points);
        let mut cards = points
            .iter()
            .map(|v| Card::storypoint(v.clone()))
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
}
