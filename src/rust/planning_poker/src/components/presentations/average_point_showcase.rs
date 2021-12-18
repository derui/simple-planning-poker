use yew::{function_component, html, virtual_dom::VNode, Properties};

use super::types::CardCount;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub card_counts: Vec<CardCount>,
    pub average_point: f32,
}

#[function_component(AveragePointShowcase)]
pub fn average_point_showcase(props: &Props) -> Html {
    let results = props
        .card_counts
        .iter()
        .enumerate()
        .map(|(index, v)| result_display(index, v))
        .collect::<VNode>();

    html! {
    <div class="app__game__average-point-showcase">
      <div class="app__game__average-point-showcase__results">
            {results}
      </div>

      <div class="app__game__average-point-showcase__equal" />
      <div class="app__game__average-point-showcase__average">
        <span class="app__game__average-point-showcase__average-label">{"Score"}</span>
        <span class="app__game__average-point-showcase__average-value">{props.average_point}</span>
      </div>
    </div>
    }
}

fn result_display(index: usize, card_count: &CardCount) -> VNode {
    html! {
            <div class="app__game__result-display" key={index}>
          <span class="app__game__result-display__card">{card_count.story_point.as_u32()}</span>
          <span class="app__game__result-display__count">{card_count.count} {" votes"}</span>
        </div>
    }
}
