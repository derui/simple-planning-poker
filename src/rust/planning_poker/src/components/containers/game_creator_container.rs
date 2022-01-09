use wasm_bindgen::JsCast;
use web_sys::{HtmlInputElement, InputEvent};
use yew::{function_component, html, use_effect, use_state, Callback};
use yew_agent::{Bridged, Dispatched};
use yew_router::{history::History, hooks::use_history};

use crate::{
    agents::{
        global_bus::{Actions, GameActions, Response},
        global_status::{GlobalStatus, GlobalStatusProjection},
    },
    Route,
};

#[derive(PartialEq)]
struct State {
    name: String,
    cards: String,
}
const DEFAULT_CARDS: &[u32] = &[0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

fn default_cards() -> String {
    DEFAULT_CARDS
        .iter()
        .cloned()
        .map(|v| v.to_string())
        .collect::<Vec<String>>()
        .join(",")
}

#[function_component(GameCreatorContainer)]
pub fn game_creator_container() -> Html {
    let state = use_state(|| State {
        name: "".to_owned(),
        cards: DEFAULT_CARDS
            .iter()
            .cloned()
            .map(|v| v.to_string())
            .collect::<Vec<String>>()
            .join(","),
    });
    let history = use_history().unwrap();

    use_effect(|| {
        let bridge = GlobalStatus::bridge(Callback::from(move |msg| {
            if let Response::SnapshotUpdated(GlobalStatusProjection {
                current_game: Some(game),
                ..
            }) = msg
            {
                history.push(Route::Game { id: game.id });
            }
        }));

        || drop(bridge)
    });

    let on_name_input = {
        let state = state.clone();

        Callback::from(move |event: InputEvent| {
            let value = event
                .target()
                .expect("should be target")
                .unchecked_into::<HtmlInputElement>()
                .value();

            state.set(State {
                name: value,
                cards: state.cards.clone(),
            })
        })
    };

    let on_cards_input = {
        let state = state.clone();

        Callback::from(move |event: InputEvent| {
            let value = event
                .target()
                .expect("should be target")
                .unchecked_into::<HtmlInputElement>()
                .value();

            state.set(State {
                cards: value,
                name: state.name.clone(),
            })
        })
    };

    let on_submit = {
        let state = state;

        Callback::from(move |_| {
            let action = Actions::ForGame(GameActions::CreateGame {
                name: state.name.clone(),
                points: state.cards.split(',').map(|v| v.to_owned()).collect(),
            });
            GlobalStatus::dispatcher().send(action);
        })
    };

    html! {
        <div class="app__game-creator">
          <header class="app__game-creator__header">{ "Create game" }</header>
          <main class="app__game-creator__main">
            <div class="app__game-creator__main__input-container">
              <span class="app__game-creator__main__input-row">
                <label class="app__game-creator__main__input-label">{ "Name" }</label>
                <input type="text" class="app__game-creator__main__name" oninput={on_name_input} />
              </span>
              <span class="app__game-creator__main__input-row">
                <label class="app__game-creator__main__input-label">{ "Cards" }</label>
                <input
                  type="text"
                  class="app__game-creator__main__card"
                  value={default_cards()}
                  oninput={on_cards_input}
                />
              </span>
            </div>
          </main>
          <footer class="app__game-creator__footer">
            <button
              class="app__game-creator__submit"
                onclick={on_submit}
            >
              {"Submit"}
            </button>
          </footer>
        </div>
    }
}
