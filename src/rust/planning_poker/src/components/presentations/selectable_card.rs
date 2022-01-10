use yew::{classes, function_component, html, Callback, Properties};

#[derive(Properties, PartialEq, Clone)]
pub struct Props {
    pub story_point: String,
    pub selected: bool,
    pub onclick: Callback<()>,
}

#[function_component(SelectableCard)]
pub fn selectable_card(props: &Props) -> Html {
    let classes = classes!(
        "app__game__selectable-card",
        props
            .selected
            .then(|| { Some("app__game__selectable-card--selected") })
    );

    html! {
    <div class={classes} onclick={props.onclick.reform(move |_| ())}>
      <span class="app__game__selectable-card__storypoint">{props.story_point.clone()}</span>
    </div>
    }
}
