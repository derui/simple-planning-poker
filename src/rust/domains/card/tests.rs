use crate::domains::{card::Card, story_point::StoryPoint};

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
