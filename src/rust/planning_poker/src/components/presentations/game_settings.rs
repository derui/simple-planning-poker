use yew::{classes, function_component, html, use_state, Callback, Properties};

#[derive(Properties, PartialEq)]
pub struct Props {
    pub origin: String,
    pub invitation_signature: String,
}

#[function_component(GameSettings)]
pub fn game_settings(props: &Props) -> Html {
    let url = format!("{}/invitation/{}", props.origin, props.invitation_signature);
    let open = use_state(|| false);
    let container_class = classes!(
        "app__game__game-settings__container",
        (*open).then(|| "app__game__game-settings__container--opened")
    );

    let opener_class = classes!(
        "app__game__game-settings__opener",
        (*open).then(|| "app__game__game-settings__opener--opened"),
    );
    let onclick = {
        Callback::from(move |_| {
            open.set(!(*open));
        })
    };

    html! {
    <div class="app__game__game-settings">
      <button class={opener_class} {onclick}></button>
      <div class={container_class}>
        <div class="app__game__game-settings__item">
          <span class="app__game__game-settings__label">{ "Invitation Link" }</span>
          <input type="text" class="app__game__game-settings__url" readonly={true} value={url.clone()} />
        </div>
      </div>
    </div>
    }
}
