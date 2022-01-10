use yew::{function_component, html};

#[function_component(EmptyCardHolder)]
pub fn empty_card_holder() -> Html {
    html! {
        <div class="app__game__card-holder" />
    }
}
