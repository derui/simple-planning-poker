use crate::domains::card::Card;
use yew::{classes, function_component, html, Properties};

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

#[derive(Properties, PartialEq)]
pub struct PlayerHandProps {
    pub name_position: NamePosition,
    pub name: String,
    pub mode: UserMode,
    pub card: Card,
    pub selected: bool,
    pub showed_down: bool,
}

#[derive(Properties, PartialEq, Clone)]
struct CardProps {
    card: Card,
    mode: UserMode,
    showed_down: bool,
    selected: bool,
}

#[function_component(CardComponent)]
fn card(props: &CardProps) -> Html {
    let story_point = match props.card.as_story_point() {
        None => String::from("?"),
        Some(v) => format!("{}", v.as_u32()),
    };

    if let UserMode::Inspector = props.mode {
        html! {
            <span class="app__game__main__user-hand__user-card--inspector">
                <span class="app__game__main__user-hand__user-card__eye"></span>
                </span>
        }
    } else if props.showed_down {
        html! {
            <span class="app__game__main__user-hand__user-card">{story_point}</span>
        }
    } else {
        let class_name = classes!(
            "app__game__main__user-hand__user-card",
            if props.selected {
                Some("app__game__main__user-hand__user-card--handed")
            } else {
                None
            }
        );

        html! {
            <span class={class_name}></span>
        }
    }
}

#[function_component(PlayerHand)]
pub fn player_hand(props: &PlayerHandProps) -> Html {
    let name =
        html! {<span class="app__game__main__user-hand__user-name">{props.name.clone()}</span>};
    let empty = html! {};
    let upper_position = if props.name_position == NamePosition::Upper {
        &name
    } else {
        &empty
    };
    let lower_position = if props.name_position == NamePosition::Lower {
        &name
    } else {
        &empty
    };

    html! {
        <div class="app__game__main__user-hand">
            <div class="app__game__main__user-hand-container">
            {upper_position.clone()}
        <CardComponent showed_down={props.showed_down} card={props.card.clone()} selected={props.selected} mode={props.mode.clone()}  />
            {lower_position.clone()}

            </div>
            </div>
    }
}
