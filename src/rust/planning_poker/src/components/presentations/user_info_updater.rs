use wasm_bindgen::JsCast;
use web_sys::{HtmlInputElement, InputEvent, MouseEvent};
use yew::{
    classes, function_component, html, html::onchange::Event, use_node_ref, use_state, Callback,
    Html, Properties, UseStateHandle,
};

use super::types::UserMode;

#[derive(Properties, PartialEq)]
pub struct UserInfoProps {
    pub name: String,
    pub mode: UserMode,
    pub onchangename: Callback<String>,
    pub onchangemode: Callback<UserMode>,
}

fn name_editor(name_state: &UseStateHandle<String>) -> Html {
    let oninput = {
        let name_state = name_state.clone();

        move |v: InputEvent| {
            let value = v.data().unwrap();
            name_state.set(value)
        }
    };

    let name = (**name_state).clone();

    html! {
      <input
        class="app__game__user-info-updater__name-editor__input"
        type="text"
       value={String::from(name)}
       oninput={oninput}
      />
    }
}

fn mode_changer(mode_state: &UseStateHandle<UserMode>) -> Html {
    let input_ref = use_node_ref();
    let onchange = {
        let state = mode_state.clone();
        move |v: Event| {
            let value = v
                .target()
                .map(|v| v.unchecked_into::<HtmlInputElement>())
                .unwrap();
            let new_value = if value.checked() {
                UserMode::Inspector
            } else {
                UserMode::Normal
            };
            state.set(new_value)
        }
    };
    let onclick = {
        let input_ref = input_ref.clone();

        move |_| {
            if let Some(v) = input_ref.cast::<HtmlInputElement>() {
                v.click()
            }
        }
    };

    let checked = (**mode_state) == UserMode::Inspector;

    let rail_classes = classes!(
        "app__game__user-info-updater__mode-changer__switch__rail",
        checked.then(|| "app__game__user-info-updater__mode-changer__switch__rail--checked")
    );

    let box_classes = classes!(
        "app__game__user-info-updater__mode-changer__switch__box",
        checked.then(|| "app__game__user-info-updater__mode-changer__switch__box--checked"),
    );

    html! {
    <div class="app__game__user-info-updater__mode-changer">
      <label class="app__game__user-info-updater__mode-changer__label">{ "Inspector Mode" }</label>
      <div class="app__game__user-info-updater__mode-changer__switch-container">
        <span class="app__game__user-info-updater__mode-changer__switch-label">{"Off"}</span>
        <span class="app__game__user-info-updater__mode-changer__switch">
          <span class={rail_classes} {onclick}>
            <span class={box_classes}></span>
          </span>
          <input
            ref={input_ref}
            class="app__game__user-info-updater__mode-changer__switch__input"
            type="checkbox"
            {checked}
            {onchange}
          />
        </span>
        <span class="app__game__user-info-updater__mode-changer__switch-label">{"On"}</span>
      </div>
    </div>

    }
}

fn update_applyer(allow_applying: bool, submit: Callback<()>) -> Html {
    html! {
        <div class="app__game__user-info-updater__applyer">
          <button
            disabled={!allow_applying}
            class="app__game__user-info-updater__name-editor__submit"
            onclick={submit.reform(|_| ())}
          >
            {"update"}
          </button>
        </div>
    }
}

#[function_component(UserInfoUpdater)]
pub fn user_info_updater(props: &UserInfoProps) -> Html {
    let name = use_state(|| props.name.clone());
    let mode = use_state(|| props.mode.clone());

    let onclick = |e: MouseEvent| {
        e.stop_propagation();
        e.prevent_default()
    };

    let submit = {
        let name = name.clone();
        let mode = mode.clone();
        let onchangename = props.onchangename.clone();
        let onchangemode = props.onchangemode.clone();

        Callback::from(move |_| {
            onchangename.emit((*name).clone());
            onchangemode.emit((*mode).clone());
        })
    };

    html! {
    <div
      class="app__game__user-info-updater"
      {onclick}
    >
      {name_editor(&name)}
      {mode_changer(&mode)}
      {update_applyer(!(*name).is_empty(), submit)}
    </div>
    }
}
