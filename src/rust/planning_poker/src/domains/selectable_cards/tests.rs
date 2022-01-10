use crate::domains::{card::Card, story_point::StoryPoint};

use super::SelectableCards;

#[test]
#[should_panic]
fn should_have_least_one_story_point() {
    // arrange
    let story_points = vec![];

    // do
    SelectableCards::new(&story_points);

    // verify
}

#[test]
fn always_add_giveup() {
    // arrange
    let story_points = [StoryPoint::new(1)];

    // do
    let cards = SelectableCards::new(&story_points);

    // verify
    assert_eq!(cards.giveup(), &Card::giveup());
}

#[test]
fn get_point_at() {
    // arrange
    let story_points = [StoryPoint::new(1), StoryPoint::new(3)];

    // do
    let cards = SelectableCards::new(&story_points);

    // verify
    assert_eq!(cards.at(0), Some(&Card::storypoint(StoryPoint::new(1))));
}

#[test]
fn do_not_get_out_outside() {
    // arrange
    let story_points = [StoryPoint::new(1), StoryPoint::new(3)];

    // do
    let cards = SelectableCards::new(&story_points);

    // verify
    assert_eq!(cards.at(3), None);
}

#[test]
fn contains_card() {
    // arrange
    let story_points = [StoryPoint::new(1), StoryPoint::new(3)];
    let card = Card::storypoint(StoryPoint::new(1));
    let not_contained_card = Card::storypoint(StoryPoint::new(2));

    // do
    let cards = SelectableCards::new(&story_points);

    // verify
    assert!(cards.contains(&card));
    assert!(!cards.contains(&not_contained_card));
}

#[test]
fn do_not_contains_same_story_point() {
    // arrange
    let story_points = [
        StoryPoint::new(1),
        StoryPoint::new(1),
        StoryPoint::new(3),
        StoryPoint::new(3),
    ];
    let card = Card::storypoint(StoryPoint::new(1));

    // do
    let cards = SelectableCards::new(&story_points);

    // verify
    assert!(cards.contains(&card));
    assert_eq!(cards.at(2), None);
}
