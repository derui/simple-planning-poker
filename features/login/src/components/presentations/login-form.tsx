import { clsx } from "clsx";
import { useState } from "react";

interface Props {
  /**
   * Call hook after submit
   */
  onSubmit?: (email: string, password: string) => void;
}

const styles = {
  root: clsx("h-full", "w-full", "grid-rows-3", "grid-cols-4"),
  dialogText: clsx("ml-3"),
  inputContainer: clsx("flex", "flex-col", "w-full", "mx-auto", "list-none", "py-0", "px-3"),

  inputTerm: clsx("flex", "flex-auto", "items-center", "mb-4", "last:mb-0"),

  inputLabel: clsx("flex-[0_0_auto]", "w-24"),

  input: clsx(
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

  submit: clsx("col-start-3", "col-end-4", "rounded"),
};

// eslint-disable-next-line func-style
export function LoginForm(props: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    props.onSubmit?.(email, password);
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel}>email</label>
        <input
          type="text"
          name="email"
          className={styles.input}
          value={email}
          placeholder="e.g. yourname@yourdomain.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel}>password</label>
        <input
          type="password"
          name="password"
          minLength={6}
          className={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.submit}>
        Submit
      </button>
    </form>
  );
}
