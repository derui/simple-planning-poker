use super::user_info_updater::UserInfoUpdater;
use yew::{classes, function_component, html, use_state, Callback, Properties};

use super::types::UserMode;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub name: String,
    pub mode: UserMode,
    pub onchangename: Callback<String>,
    pub onchangemode: Callback<UserMode>,
}

#[function_component(UserInfo)]
pub fn user_info(props: &Props) -> Html {
    let show_updater = use_state(|| false);

    let classes = classes!(
        "app__game__user-info__indicator",
        (*show_updater).then(|| "app__game__user-info__indicator--opened")
    );
    let onclick = {
        let show_updater = show_updater.clone();
        Callback::from(move |_| show_updater.set(!(*show_updater)))
    };
    let onchangename = {
        let show_updater = show_updater.clone();
        let onchangename = props.onchangename.clone();

        Callback::from(move |v| {
            show_updater.set(false);
            onchangename.emit(v);
        })
    };
    let onchangemode = {
        let show_updater = show_updater.clone();
        let onchangemode = props.onchangemode.clone();

        Callback::from(move |v| {
            show_updater.set(false);
            onchangemode.emit(v);
        })
    };

    let updater = if *show_updater {
        html! {
        <UserInfoUpdater
          name={props.name.clone()}
          mode={props.mode.clone()}
         onchangemode={onchangemode}
         onchangename={onchangename}
        />
        }
    } else {
        html! {}
    };

    html! {
    <div class="app__game__user-info" onclick={onclick}>
      <span class="app__game__user-info__icon"></span>
      <span class="app__game__user-info__name">{props.name.clone()}</span>
      <span class={classes} />
      {updater}
    </div>
    }
}
