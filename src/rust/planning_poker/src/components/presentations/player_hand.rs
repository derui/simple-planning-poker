use crate::{agents::global_status::CardProjection, domains::game_player::UserMode};
use yew::{classes, function_component, html, Properties};

use super::types::NamePosition;

#[derive(Properties, PartialEq, Clone)]
struct CardProps {
    card: Option<CardProjection>,
    mode: UserMode,
    showed_down: bool,
}

#[function_component(CardComponent)]
fn card(props: &CardProps) -> Html {
    let story_point = match props.card {
        None => "".to_owned(),
        Some(CardProjection::GiveUp) => "?".to_owned(),
        Some(CardProjection::StoryPoint(v)) => v.to_string(),
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
            props
                .card
                .is_some()
                .then(|| { Some("app__game__main__user-hand__user-card--handed") })
        );

        html! {
            <span class={class_name}></span>
        }
    }
}

#[derive(Properties, PartialEq)]
pub struct PlayerHandProps {
    pub name_position: NamePosition,
    pub name: String,
    pub mode: UserMode,
    pub card: Option<CardProjection>,
    pub showed_down: bool,
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
        <CardComponent showed_down={props.showed_down} card={props.card.clone()} mode={props.mode.clone()}  />
            {lower_position.clone()}
            </div>
            </div>
    }
}
