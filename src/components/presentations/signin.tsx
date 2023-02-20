import * as React from "react";
import { CSSTransition } from "react-transition-group";

interface Props {
  title: string;
  onSubmit: (email: string, password: string) => void;
  authenticating: boolean;
}

const Overlay = ({ authenticating }: { authenticating: boolean }) => {
  return (
    <CSSTransition in={authenticating} timeout={500} classNames="app__signin-overlay">
      <div className="app__signin-overlay">Authenticating...</div>
    </CSSTransition>
  );
};

export const SignInComponent: React.FunctionComponent<React.PropsWithChildren<Props>> = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { onSubmit } = props;

  return (
    <form
      className="app__signin-root"
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onSubmit(email, password);
      }}
    >
      <header className="app__signin-header">{props.title}</header>
      <main className="app__signin-main">
        <div className="app__signin-main__container">
          <Overlay authenticating={props.authenticating} />
          <ul className="app__signin-main__input-container">
            <li className="app__signin-main__input-item">
              <label className="app__signin-main__input-label">email</label>
              <input
                type="text"
                className="app__signin-main__input"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </li>
            <li className="app__signin-main__input-item">
              <label className="app__signin-main__input-label">password</label>
              <input
                type="password"
                minLength={6}
                className="app__signin-main__input"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>
          </ul>
          {props.children}
        </div>
      </main>
      <footer className="app__signin-footer">
        <input type="submit" className="app__signin__submit" value="Submit" disabled={props.authenticating} />
      </footer>
    </form>
  );
};
