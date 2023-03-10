import classNames from "classnames";
import * as React from "react";
import { BaseProps, generateTestId } from "../base";

interface Props extends BaseProps {
  title: string;
  onSubmit: (param: { email: string; password: string }) => void;
  authenticating: boolean;
}

const styles = {
  root: classNames(
    "flex",
    "absolute",
    "flex-col",
    "min-w-fit",
    "max-w-md",
    "m-auto",
    "border",
    "border-primary-400",
    "rounded",
    "shadow-md",
    "z-0",
    "top-1/2",
    "left-1/2",
    "[transform:translate(-50%,-50%)]"
  ),

  header: classNames(
    "flex-auto",
    "p-2",
    "text-lg",
    "font-bold",
    "rounded",
    "rounded-r-none",
    "rounded-b-none",
    "bg-primary-400",
    "text-secondary1-200"
  ),

  main: classNames("flex-auto", "bg-white", "relative", "p-4"),

  inputContainer: classNames("flex", "flex-col", "w-full", "mx-auto", "list-none", "py-0", "px-3"),

  inputTerm: classNames("flex", "flex-auto", "items-center", "mb-4", "last:mb-0"),

  inputLabel: classNames("flex-[0_0_auto]", "w-24"),

  input: classNames(
    "flex-auto",
    "w-full",
    "p-2",
    "outline-none",
    "rounded",
    "border",
    "border-lightgray/40",
    "bg-lightgray/20",
    "transition-colors",
    "focus:border-secondary2-500",
    "focus:bg-white"
  ),

  footer: classNames(
    "flex-auto",
    "p-2",
    "text-lg",
    "font-bold",
    "rounded-b",
    "text-right",
    "border",
    "border-t-primary-400",
    "text-secondary1-200"
  ),

  submit: classNames(
    "flex-auto",
    "outline-none",
    "border",
    "border-secondary1-500",
    "bg-secondary1-200",
    "text-secondary1-500",
    "px-3",
    "py-2",
    "rounded",
    "cursor-pointer",
    "transition-all",
    "active:shadow-md",
    "hover:text-secondary1-200",
    "hover:bg-secondary1-500"
  ),

  signUpLink: classNames("text-center"),
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
    <form className={styles.root} onSubmit={handleSubmit} data-testid={gen("root")}>
      <header className={styles.header} data-testid={gen("header")}>
        {title}
      </header>
      <main className={styles.main}>
        <ul className={styles.inputContainer}>
          <li className={styles.inputTerm}>
            <label className={styles.inputLabel}>email</label>
            <input
              type="text"
              name="email"
              className={styles.input}
              value={email}
              placeholder="e.g. yourname@yourdomain.com"
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
              placeholder="Password"
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
