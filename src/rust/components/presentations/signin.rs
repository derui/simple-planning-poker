use wasm_bindgen::JsCast;
use web_sys::HtmlInputElement;
use yew::{function_component, html, Callback, Children, Html, Properties};

#[derive(Properties, PartialEq)]
pub struct Props {
    pub title: String,
    pub onsubmit: Callback<()>,
    pub onupdateemail: Callback<String>,
    pub onupdatepassword: Callback<String>,
    pub show_overlay: bool,
    pub children: Children,
}

#[function_component(Signin)]
pub fn signin(props: &Props) -> Html {
    let Props {
        show_overlay,
        title,
        ..
    } = props;
    let onsubmit = {
        let onsubmit = props.onsubmit.clone();
        Callback::from(move |e: yew::html::onsubmit::Event| {
            e.stop_propagation();
            e.prevent_default();
            onsubmit.emit(());
        })
    };
    let onchangeemail = {
        let update_email = props.onupdateemail.clone();

        Callback::from(move |v: yew::html::onchange::Event| {
            let target = v
                .target()
                .map(|v| v.unchecked_into::<HtmlInputElement>())
                .unwrap();

            update_email.emit(target.value())
        })
    };
    let onchangepassword = {
        let update_password = props.onupdatepassword.clone();

        Callback::from(move |v: yew::html::onchange::Event| {
            let target = v
                .target()
                .map(|v| v.unchecked_into::<HtmlInputElement>())
                .unwrap();
            update_password.emit(target.value())
        })
    };

    html! {
    <>
            {overlay(show_overlay)}
      <form
        class="app__signin-root"
        onsubmit={onsubmit}
      >
        <header class="app__signin-header">{title.clone()}</header>
        <main class="app__signin-main">
          <ul class="app__signin-main__input-container">
            <li class="app__signin-main__input-item">
              <label class="app__signin-main__input-label">{"email"}</label>
              <input type="text" class="app__signin-main__input" onchange={onchangeemail} />
            </li>
            <li class="app__signin-main__input-item">
              <label class="app__signin-main__input-label">{"password"}</label>
              <input
                type="password"
                minLength={6}
                class="app__signin-main__input"
                onchange={onchangepassword}
              />
            </li>
          </ul>
          {props.children.clone()}
        </main>
        <footer class="app__signin-footer">
          <input type="submit" class="app__signin__submit" value="Submit" />
        </footer>
      </form>
    </>
    }
}

fn overlay(show_overlay: &bool) -> Html {
    if *show_overlay {
        html! {
          <div class="app__signin-overlay"></div>
        }
    } else {
        html! {}
    }
}
