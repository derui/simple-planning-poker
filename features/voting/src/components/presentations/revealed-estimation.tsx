import { PropsWithChildren, useEffect, useState } from "react";
import * as styles from "./revealed-estimation.css.js";

interface Props {
  name: string;
}

// eslint-disable-next-line func-style
export function RevealedEstimation(props: PropsWithChildren<Props>) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpened(true), 200);
  }, []);

  return (
    <div className={styles.root}>
      <span>{props.name}</span>
      <span className={opened ? styles.cardOpened : styles.cardNotOpened} data-opened={opened}>
        {opened ? props.children : null}
      </span>
    </div>
  );
}
