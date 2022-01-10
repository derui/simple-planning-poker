use yew::{function_component, html, use_state, Callback};

use crate::components::{
    hooks::{use_authenticating, use_sign_up},
    presentations::signin::Signin,
};

#[function_component(SignUpContainer)]
pub fn sign_up_container() -> Html {
    let authenticating = use_authenticating();
    let sign_up = use_sign_up();
    let email_state = use_state(|| "".to_owned());
    let password_state = use_state(|| "".to_owned());

    let on_submit = {
        let email = email_state.clone();
        let password = password_state.clone();
        Callback::from(move |_| sign_up.emit(((*email).clone(), (*password).clone())))
    };

    let on_update_email = {
        let state = email_state;

        Callback::from(move |v| state.set(v))
    };

    let on_update_password = {
        let state = password_state;

        Callback::from(move |v| state.set(v))
    };

    html! {
            <Signin
      title="Sign Up"
      onupdateemail={on_update_email}
      onupdatepassword={on_update_password}
             onsubmit={on_submit}
      show_overlay={authenticating}
    > <></>
    </Signin>
    }
}
