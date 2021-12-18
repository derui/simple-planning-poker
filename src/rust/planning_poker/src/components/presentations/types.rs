use crate::domains::story_point::StoryPoint;

#[derive(Debug, PartialEq)]
pub enum NamePosition {
    Upper,
    Lower,
}

#[derive(Debug, PartialEq, Clone)]
pub enum UserMode {
    Normal,
    Inspector,
}

#[derive(Debug, PartialEq, Clone)]
pub struct CardCount {
    pub story_point: StoryPoint,
    pub count: u32,
}
