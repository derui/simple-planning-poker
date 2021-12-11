pub fn obtain_result() -> String {
    gloo_utils::document()
        .get_element_by_id("result")
        .expect("No result found. Most likely, the application crashed and burned")
        .inner_html()
}

pub fn obtain_result_by_class(class_name: &str) -> String {
    let elements = gloo_utils::document().get_elements_by_class_name(class_name);

    elements
        .item(0)
        .expect("No result found. Most likely, the application crashed and burned")
        .inner_html()
}
