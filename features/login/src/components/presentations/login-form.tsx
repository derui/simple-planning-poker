import { Loader } from "@spp/ui-loader";
import { useState } from "react";
import * as styles from "./login-form.css.js";

interface Props {
  /**
   * Call hook after submit
   */
  onSubmit?: (email: string, password: string) => void;

  /**
   * Call hook after back
   */
  onBack?: () => void;

  /**
   * loading or not. Default is not loading
   */
  loading?: boolean;
}

// eslint-disable-next-line func-style
export function LoginForm(props: Props): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    props.onSubmit?.(email, password);
  };
  const handleBack = (event: React.MouseEvent) => {
    event.preventDefault();

    props.onBack?.();
  };
  const loading = props.loading ?? false;

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel}>Email</label>
        <input
          name="email"
          className={styles.input}
          value={email}
          placeholder="e.g. yourname@yourdomain.com"
          onChange={(e) => setEmail(e.target.value)}
          tabIndex={0}
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
          tabIndex={0}
        />
      </div>
      <div className={styles.submitContainer}>
        <button type="button" className={styles.back} onClick={handleBack}>
          <Loader size="s" shown={loading} />
          Back
        </button>
        <button type="submit" className={styles.submit}>
          <Loader size="s" shown={loading} />
          Submit
        </button>
      </div>
    </form>
  );
}
