use crate::domains::story_point::StoryPoint;

#[test]
fn add_point() {
    // arrange
    let v1 = StoryPoint(3);
    let v2 = StoryPoint(4);

    // do
    let actual = v1 + v2;

    // verify
    assert_eq!(actual, StoryPoint(7))
}

#[test]
fn allow_to_convert_u32() {
    // arrange
    let v = StoryPoint(3);

    // do
    let actual = v.as_u32();

    // verify
    assert_eq!(actual, 3)
}

#[test]
fn allow_copy() {
    // arrange
    let v = StoryPoint(3);
    let reference = &v;

    // do
    let v2 = Some(*reference);

    // verify
    assert_eq!(v2, Some(StoryPoint(3)))
}
