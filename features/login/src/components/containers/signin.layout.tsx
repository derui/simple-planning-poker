import { Dialog } from "@spp/ui-dialog";
import { Loader } from "@spp/ui-loader";
import { Overlay } from "@spp/ui-overlay";
import { LoginForm } from "../presentations/login-form.js";
import * as styles from "./signin.css.js";

interface Props {
  title: string;

  onSubmit?: (email: string, password: string) => void;

  loading?: boolean;
}

// eslint-disable-next-line func-style
export function SignInLayout(props: Props): JSX.Element {
  const { title, loading = false, onSubmit } = props;

  const handleSubmit = (email: string, password: string) => {
    onSubmit?.(email, password);
  };

  return (
    <main className={styles.root}>
      <Overlay show={loading}>
        <div className={styles.overlayDialog}>
          <Loader size="m" shown={true} />
          <span className={styles.dialogText}>Authenticating...</span>
        </div>
      </Overlay>
      <Dialog title={title}>
        <div className={styles.dialogContent}>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </Dialog>
    </main>
  );
}
