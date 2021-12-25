use wasm_bindgen::JsCast;
use web_sys::Event;
use yew::{html, virtual_dom::VNode, FunctionComponent, FunctionProvider, Html, Properties};

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
pub fn obtain_element_by_class<T: wasm_bindgen::JsCast>(class_name: &str) -> T {
    let elements = gloo_utils::document().get_elements_by_class_name(class_name);

    elements
        .item(0)
        .expect("No result found. Most likely, the application crashed and burned")
        .unchecked_into::<T>()
}

pub fn mount(vnode: &VNode) {
    struct TemporaryFunction {}
    #[derive(Properties, PartialEq)]
    struct TProps {
        node: VNode,
    }

    impl FunctionProvider for TemporaryFunction {
        type TProps = TProps;

        fn run(p: &Self::TProps) -> Html {
            // No race conditions will be caused since its only used in one place

            return html! {
                <div id="output">
            { p.node.clone() }
                </div>
            };
        }
    }

    type UseComponent = FunctionComponent<TemporaryFunction>;

    yew::start_app_with_props_in_element::<UseComponent>(
        gloo_utils::document().get_element_by_id("output").unwrap(),
        TProps {
            node: vnode.clone(),
        },
    );
}

pub fn emit(class: &str, event: &Event) {
    let element = gloo_utils::document().get_elements_by_class_name(class);

    element
        .item(0)
        .unwrap()
        .dispatch_event(event)
        .expect(format!("Should not emit event {}, {:?}", class, event).as_str());
}
