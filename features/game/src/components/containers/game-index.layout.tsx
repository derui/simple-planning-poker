import * as AppUrl from "@spp/shared-app-url";
import { Loader } from "@spp/ui-loader";
import { Link } from "react-router-dom";
import { GameDto } from "../../atoms/dto.js";
import { GameListItem } from "../presentations/game-list-item.js";
import * as styles from "./game-index.css.js";

interface Props {
  loading?: boolean;

  games?: GameDto[];
}

const Empty = () => {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyText}>You do not have games.</span>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.loadingRoot}>
      <div className={styles.loadingContainer}>
        <span className={styles.loadingText}>Loading...</span>
        <Loader size="l" shown />
      </div>
    </div>
  );
};

// eslint-disable-next-line func-style
export function GameIndexLayout(props: Props): JSX.Element {
  const { loading = false, games = [] } = props;

  if (loading) {
    return <Loading />;
  }

  const gameComponents = games.map((v) => {
    return <GameListItem gameId={v.id} name={v.name} owned={v.owned} />;
  });

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <header className={styles.header}>Select game you created</header>
        <main className={styles.mainRoot}>
          <ul className={styles.mainList}>{games.length > 0 ? gameComponents : <Empty />}</ul>
        </main>
        <footer className={styles.footer}>
          <Link className={styles.creator} to={AppUrl.gameCreatePage()} role="button">
            New Game
          </Link>
        </footer>
      </div>
    </div>
  );
}
