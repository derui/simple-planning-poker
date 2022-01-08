use yew::{classes, function_component, html, Properties};

use crate::{
    agents::global_status::CardProjection, components::presentations::player_hand::PlayerHand,
    domains::game_player::UserMode,
};

use super::types::NamePosition;

#[derive(PartialEq, Debug)]
pub enum Position {
    Upper,
    Lower,
}

#[derive(PartialEq)]
pub struct PlayerHandProps {
    pub name: String,
    pub mode: UserMode,
    pub card: Option<CardProjection>,
    pub showed_down: bool,
}

#[derive(Properties, PartialEq)]
pub struct Props {
    pub position: Position,
    pub user_hands: Vec<PlayerHandProps>,
}

#[function_component(PlayerHands)]
pub fn player_hands(props: &Props) -> Html {
    let user_hands = make_user_hands(props);

    let classes = classes!(
        (props.position == Position::Upper).then(|| Some("app__game__main__users-in-upper")),
        (props.position == Position::Lower).then(|| Some("app__game__main__users-in-lower")),
    );

    html! {
        <div class={classes}>
            {user_hands}
            </div>
    }
}

fn make_user_hands(props: &Props) -> Vec<yew::virtual_dom::VNode> {
    props
        .user_hands
        .iter()
        .enumerate()
        .map(|(index, v)| {
            let name_position = match props.position {
                Position::Upper => NamePosition::Upper,
                Position::Lower => NamePosition::Lower,
            };

            html! {
                <PlayerHand key={index} name_position={name_position} name={v.name.clone()}
            mode={v.mode.clone()} card={v.card.clone()} showed_down={v.showed_down}/>
            }
        })
        .collect::<Vec<_>>()
}
