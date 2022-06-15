import { Component, createSignal, ParentProps, Show } from "solid-js";

interface Props {
  title: string;
  onSubmit: (email: string, password: string) => void;
  authenticating: boolean;
}

const Overlay: Component<{ authenticating: boolean }> = (props) => {
  return (
    <Show when={props.authenticating}>
      <div class="app__signin-overlay">Authenticating...</div>
    </Show>
  );
};

export const SignInComponent: Component<ParentProps<Props>> = (props) => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  return (
    <form
      class="app__signin-root"
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        props.onSubmit(email(), password());
      }}
    >
      <header class="app__signin-header">{props.title}</header>
      <main class="app__signin-main">
        <div class="app__signin-main__container">
          <Overlay authenticating={props.authenticating} />
          <ul class="app__signin-main__input-container">
            <li class="app__signin-main__input-item">
              <label class="app__signin-main__input-label">email</label>
              <input type="text" class="app__signin-main__input" oninput={(e) => setEmail(e.currentTarget.value)} />
            </li>
            <li class="app__signin-main__input-item">
              <label class="app__signin-main__input-label">password</label>
              <input
                type="password"
                minLength={6}
                class="app__signin-main__input"
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </li>
          </ul>
          {props.children}
        </div>
      </main>
      <footer class="app__signin-footer">
        <input type="submit" class="app__signin__submit" value="Submit" disabled={props.authenticating} />
      </footer>
    </form>
  );
};
