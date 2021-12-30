use super::selectable_card::SelectableCard;
use yew::{function_component, html, virtual_dom::VNode, Callback, Properties};

#[derive(Properties, PartialEq)]
pub struct Props {
    story_points: Vec<String>,
    selected_index: Option<u32>,
    onclickcard: Callback<u32>,
}

#[function_component(CardHolder)]
pub fn card_holder(props: &Props) -> Html {
    let cards = make_cards(props);

    html! {
      <div class="app__game__card-holder">
        {cards}
      </div>
    }
}

fn make_cards(props: &Props) -> Vec<VNode> {
    props
        .story_points
        .iter()
        .enumerate()
        .map(|(index, v)| -> VNode {
            let selected = if let Some(v) = props.selected_index {
                v == index as u32
            } else {
                false
            };

            let onclick = {
                let index = index as u32;
                props.onclickcard.reform(move |_| index)
            };

            html! {
                <SelectableCard story_point={v.clone()} {selected} {onclick} />
            }
        })
        .collect()
}
