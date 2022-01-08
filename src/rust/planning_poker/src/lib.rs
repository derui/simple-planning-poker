use components::containers::{
    game_container::GameContainer, game_creator_container::GameCreatorContainer,
    game_result_container::GameResultContainer, game_selector_container::GameSelectorContainer,
};
use wasm_bindgen::prelude::wasm_bindgen;
use yew::{function_component, html, Html};
use yew_router::{BrowserRouter, Routable, Switch};

use crate::components::containers::invitation_container::InvitationContainer;

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

fn switch(routes: &Route) -> Html {
    match routes {
        Route::Selector => html! { <GameSelectorContainer /> },
        Route::CreateGame => html! { <GameCreatorContainer /> },
        Route::Game { id } => html! {<GameContainer game_id={id.clone()} />},
        Route::GameResult { id } => html! {<GameResultContainer game_id={id.clone()} />},
        Route::Invitation { signature } => {
            html! {<InvitationContainer signature={signature.clone()} />}
        }
        _ => unimplemented!()
        // Route::SignIn => html! {<SignInContainer /> },
        // Route::SignUp => html! {<SignUpContainer /> },
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
pub fn run() {}
