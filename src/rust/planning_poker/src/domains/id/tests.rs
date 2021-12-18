use super::Id;

#[test]
fn create_with_string() {
    // arrange

    // do
    let id = Id::new("test");

    // verify
    assert_eq!(id.to_string(), "test")
}

#[test]
fn create_with_u32() {
    // arrange

    // do
    let id = Id::new(12 as u32);

    // verify
    assert_eq!(id.to_string(), "12")
}

#[test]
fn same_id_is_same() {
    // arrange
    let id1 = Id::new(12 as u32);
    let id2 = Id::new(12 as u32);

    // do

    // verify
    assert!(id1 == id2);
}
