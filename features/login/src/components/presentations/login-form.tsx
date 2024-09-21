import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { clsx } from "clsx";
import { useState } from "react";

interface Props {
  /**
   * Call hook after submit
   */
  onSubmit?: (email: string, password: string) => void;
}

const styles = {
  root: clsx("h-full", "w-full", "grid", "grid-rows-3", "grid-cols-4", "gap-4"),
  dialogText: clsx("ml-3"),
  inputContainer: clsx(
    "grid",
    "grid-rows-2",
    "grid-cols-1",
    "w-full",
    "mx-auto",
    "list-none",
    "py-0",
    "px-3",
    "col-span-4"
  ),

  inputTerm: clsx("grid", "place-content-center"),

  inputLabel: clsx("grid", "place-content-start", "w-24"),

  input: clsx(
    "w-full",
    "p-2",
    "outline-none",
    "rounded",
    "border",
    "border-emerald-800",
    "bg-gray-100",
    "transition-colors",
    "focus:border-emerald-600",
    "focus:bg-white"
  ),

  submitContainer: clsx("col-start-4", "col-end-4", "grid", "place-content-center"),
  submit: clsx(buttonStyle({ variant: Variant.emerald })),
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
        <label className={styles.inputLabel}>Email</label>
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
        <label className={styles.inputLabel}>Password</label>
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
      <div className={styles.submitContainer}>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </div>
    </form>
  );
}
