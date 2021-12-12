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
