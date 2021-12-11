use std::ops::Add;

#[derive(Debug, PartialEq, Copy)]
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

#[cfg(test)]
mod test {
    use super::*;

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
}
