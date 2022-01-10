use components::{
    containers::{
        game_container::GameContainer, game_creator_container::GameCreatorContainer,
        game_result_container::GameResultContainer, game_selector_container::GameSelectorContainer,
        sign_in_container::SignInContainer, sign_up_container::SignUpContainer,
    },
    hooks::use_authenticated,
    hooks::AuthenticatedStatus,
};
use wasm_bindgen::prelude::wasm_bindgen;
use yew::{function_component, html, use_effect_with_deps, Callback, Children, Html, Properties};
use yew_agent::Bridged;
use yew_router::{history::History, hooks::use_history, BrowserRouter, Routable, Switch};

use crate::{
    agents::game_observer::{GameObserver, GameObserverAction},
    components::containers::invitation_container::InvitationContainer,
};

pub mod agents;
pub mod components;
pub mod domains;
pub mod infrastructures;
pub mod usecases;
pub mod utils;

// routing
#[derive(Clone, Routable, PartialEq)]
enum Route {
    #[at("/")]
    Selector,
    #[at("/create")]
    CreateGame,
    #[at("/game/:id")]
    Game { id: String },
    #[at("/game/:id/result")]
    GameResult { id: String },
    #[at("/invitation/:signature")]
    Invitation { signature: String },
    #[at("/signin")]
    SignIn,
    #[at("/signup")]
    SignUp,
}

#[derive(Properties, PartialEq)]
pub struct SecureProps {
    children: Children,
}

#[function_component(Secure)]
pub fn secure(props: &SecureProps) -> Html {
    let history = use_history().unwrap();
    let authenticated = use_authenticated();

    if authenticated == AuthenticatedStatus::NotSignedIn {
        history.push(Route::SignIn);
    }

    if authenticated == AuthenticatedStatus::Checking {
        return html! {
            <div>{"Checking..."}</div>
        };
    }

    html! {
        <>
            {props.children.clone()}
        </>
    }
}

#[derive(Properties, PartialEq)]
pub struct GameObserverProps {
    game_id: String,
}

#[function_component(GameObserverWrapper)]
pub fn game_observer(props: &GameObserverProps) -> Html {
    use_effect_with_deps(
        |id| {
            let mut bridge = GameObserver::bridge(Callback::from(|_| {}));
            bridge.send(GameObserverAction::SubscribeTo(id.clone()));

            || drop(bridge)
        },
        props.game_id.clone(),
    );

    html! {}
}

fn switch(routes: &Route) -> Html {
    match routes {
        Route::Selector => html! { <Secure><GameSelectorContainer /></Secure> },
        Route::CreateGame => html! { <Secure><GameCreatorContainer /></Secure> },
        Route::Game { id } => html! {
        <Secure>
          <GameObserverWrapper game_id={id.clone()} />
          <GameContainer game_id={id.clone()} />
        </Secure>},
        Route::GameResult { id } => {
            html! {<Secure>
                              <GameObserverWrapper game_id={id.clone()} />
            <GameResultContainer game_id={id.clone()} />
            </Secure>}
        }
        Route::Invitation { signature } => {
            html! {<Secure><InvitationContainer signature={signature.clone()} /></Secure>}
        }
        Route::SignIn => html! {<SignInContainer /> },
        Route::SignUp => html! {<SignUpContainer /> },
    }
}

#[function_component(App)]
fn app() -> Html {
    html! {
        <BrowserRouter>
            <Switch<Route> render={Switch::render(switch)} />
            </BrowserRouter>
    }
}

#[wasm_bindgen(start)]
pub fn run() {
    yew::start_app::<App>();
}
