import classNames from "classnames";
import * as React from "react";
import { Transition } from "react-transition-group";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  title: string;
  onSubmit: (param: { email: string; password: string }) => void;
  authenticating: boolean;
}

const styles = {
  root: classNames(
    "flex",
    "relative",
    "flex-col",
    "w-64",
    "m-auto",
    "border",
    "border-secondary1-400",
    "rounded",
    "shadow-md",
    "z-0"
  ),

  header: classNames(
    "flex-auto",
    "p-4",
    "text-lg",
    "font-bold",
    "rounded",
    "rounded-r-none",
    "rounded-b-none",
    "bg-primary-400",
    "text-secondary1-200"
  ),

  main: classNames("flex-auto", "bg-white", "relative", "p-4"),

  inputContainer: classNames("flex", "flex-col", "w-full", "mx-auto", "list-none", "py-0", "px-4"),

  inputTerm: classNames("flex", "flex-auto", "align-center", "mb-4", "last:mb-0"),

  inputLabel: classNames("flex-none", "w-20"),

  input: classNames("flex-auto", "h-8"),

  footer: classNames(
    "flex-auto",
    "p-3",
    "text-lg",
    "font-bold",
    "rounded",
    "rounded-t-none",
    "rounded-l-none",
    "text-right",
    "bg-primary-400",
    "text-secondary1-200"
  ),

  submit: classNames(
    "flex-auto",
    "outline-none",
    "border",
    "border-secondary1-500",
    "bg-secondary1-200",
    "text-secondary1-500",
    "px-4",
    "py-3",
    "cursor-pointer",
    "transition-color",
    "transition-shadow",
    "active:shadow-md",
    "hover:text-secondary1-200",
    "hover:bg-secondary1-500"
  ),

  signUpLink: classNames("text-center"),
};

const overlayStyles = {
  root: (state: string) =>
    classNames(
      "flex",
      "flex-auto",
      "align-center",
      "justify-center",
      "absolute",
      "left-0",
      "top-0",
      "w-full",
      "h-full",
      "bg-white",
      "z-10",
      "transition-opacity",
      {
        visible: state === "entering",
        "opacity-100": state === "entering",
      },
      {
        visible: state === "entering",
        "opacity-100": state === "entering",
      },
      {
        visible: state === "exiting",
        "opacity-0": state === "exiting",
      },
      {
        invisible: state === "exited",
        "opacity-0": state === "exited",
      }
    ),
} as const;

const Overlay = ({ authenticating, testid }: { authenticating: boolean; testid: string }) => {
  const ref = React.useRef(null);
  return (
    <Transition nodeRef={ref} in={authenticating} timeout={200}>
      {(state) => {
        return (
          <div ref={ref} className={overlayStyles.root(state)} data-testid={testid}>
            Authenticating...
          </div>
        );
      }}
    </Transition>
  );
};

// eslint-disable-next-line func-style
export function SignIn({ title, onSubmit, authenticating, children, testid }: React.PropsWithChildren<Props>) {
  const gen = generateTestId(testid);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <header className={styles.header} data-testid={gen("header")}>
        {title}
      </header>
      <main className={styles.main}>
        <Overlay testid={gen("overlay")} authenticating={authenticating} />
        <ul className={styles.inputContainer}>
          <li className={styles.inputTerm}>
            <label className={styles.inputLabel}>email</label>
            <input
              type="text"
              name="email"
              className={styles.input}
              value={email}
              placeholder="email"
              data-testid={gen("email")}
              onChange={(e) => setEmail(e.target.value)}
            />
          </li>
          <li className={styles.inputTerm}>
            <label className={styles.inputLabel}>password</label>
            <input
              type="password"
              name="password"
              minLength={6}
              className={styles.input}
              value={password}
              data-testid={gen("password")}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
        </ul>
        {children}
      </main>
      <footer className={styles.footer}>
        <input type="submit" className={styles.submit} value="Submit" disabled={authenticating} />
      </footer>
    </form>
  );
}
