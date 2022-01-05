use components::containers::{
    game_creator_container::GameCreatorContainer, game_selector_container::GameSelectorContainer,
};
use wasm_bindgen::prelude::wasm_bindgen;
use yew::{function_component, html, Html};
use yew_router::{BrowserRouter, Routable, Switch};

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
        _ => unimplemented!()
        // Route::Game { id } => html! {<GameContainer id={id.clone()} />},
        // Route::Invitation { signature } => {
        //     html! {<InvitationContainer signature={signature.clone()} />}
        // }
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
