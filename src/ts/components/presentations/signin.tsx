import * as React from "react";
import { CSSTransition } from "react-transition-group";

interface Props {
  title: string;
  onSubmit: () => void;
  onUpdateEmail: (value: string) => void;
  onUpdatePassword: (value: string) => void;
  showOverlay: boolean;
}

const Overlay = ({ showOverlay }: { showOverlay: boolean }) => {
  return (
    <CSSTransition in={showOverlay} timeout={200} classNames="app__signin-overlay">
      <div className="app__signin-overlay"></div>
    </CSSTransition>
  );
};

export const SignInComponent: React.FunctionComponent<Props> = (props) => {
  const { onSubmit, onUpdateEmail, onUpdatePassword } = props;

  return (
    <React.Fragment>
      <Overlay showOverlay={props.showOverlay} />
      <form
        className="app__signin-root"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onSubmit();
        }}
      >
        <header className="app__signin-header">{props.title}</header>
        <main className="app__signin-main">
          <ul className="app__signin-main__input-container">
            <li className="app__signin-main__input-item">
              <label className="app__signin-main__input-label">email</label>
              <input type="text" className="app__signin-main__input" onChange={(e) => onUpdateEmail(e.target.value)} />
            </li>
            <li className="app__signin-main__input-item">
              <label className="app__signin-main__input-label">password</label>
              <input
                type="password"
                minLength={6}
                className="app__signin-main__input"
                onChange={(e) => onUpdatePassword(e.target.value)}
              />
            </li>
          </ul>
          {props.children}
        </main>
        <footer className="app__signin-footer">
          <input type="submit" className="app__signin__submit" value="Submit" />
        </footer>
      </form>
    </React.Fragment>
  );
};