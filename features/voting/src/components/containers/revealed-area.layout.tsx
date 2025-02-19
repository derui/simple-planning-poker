import { Prettify } from "@spp/shared-type-util";
import { EstimationDto } from "../../atoms/dto.js";
import { Header } from "../presentations/header.js";
import { Inspector } from "../presentations/inspector.js";
import { Inspectors } from "../presentations/inspectors.js";
import { RevealedEstimations } from "../presentations/revealed-estimations.js";
import { UserRole } from "../types.js";
import * as styles from "./revealed-area.css.js";

/**
 * Estimations of voting
 */
const RevealedUserEstimations = function RevealedUserEstimations({
  estimations,
  average,
  onReset,
}: {
  estimations: EstimationDto[];
  average: number;
  onReset?: () => void;
}) {
  return <RevealedEstimations estimations={estimations} average={average} onReset={onReset} />;
};

/**
 * Inspectors in voting
 */
const VotingInspectors = function VotingInspectors({ inspectors: _inspectors }: { inspectors: EstimationDto[] }) {
  const inspectors = _inspectors.map((v, index) => <Inspector key={index} name={v.name} />);

  return <Inspectors>{inspectors}</Inspectors>;
};

type Props = {
  theme?: string;
  userRole?: UserRole;
  voters?: EstimationDto[];
  inspectors?: EstimationDto[];
  average?: number;
  /**
   * Handler to change theme
   */
  onChangeTheme?: (theme: string) => void;

  /**
   * Handler to reset voting
   */
  onReset?: () => void;
};

export const RevealedAreaLayout = function RevealedAreaLayout(props: Prettify<Props>): JSX.Element {
  const { voters = [], inspectors = [], onChangeTheme, onReset, average = 0 } = props;
  const theme = props.theme ?? "";
  const userRole = props.userRole ?? "player";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header theme={theme} defaultRole={userRole} onChangeTheme={onChangeTheme} />
      </div>
      <div className={styles.estimations}>
        <RevealedUserEstimations estimations={voters} average={average} onReset={onReset} />
      </div>
      <div className={styles.inspectors}>
        <VotingInspectors inspectors={inspectors} />
      </div>
    </div>
  );
};
