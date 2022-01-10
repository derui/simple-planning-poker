use std::ops::Add;

#[cfg(test)]
mod tests;

#[derive(Debug, PartialEq, Copy, Eq, PartialOrd, Ord)]
pub struct StoryPoint(u32);

impl Clone for StoryPoint {
    fn clone(&self) -> Self {
        StoryPoint(self.0)
    }
}

impl Add for StoryPoint {
    type Output = Self;

    fn add(self, v: Self) -> Self::Output {
        StoryPoint(self.0 + v.0)
    }
}

impl StoryPoint {
    pub fn new(v: u32) -> StoryPoint {
        StoryPoint(v)
    }

    pub fn as_u32(&self) -> u32 {
        self.0
    }
}
