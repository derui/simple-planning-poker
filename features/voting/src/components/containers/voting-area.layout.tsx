import { Prettify } from "@spp/shared-type-util";
import { EstimationDto } from "../../atoms/dto.js";
import { CardHolder } from "../presentations/card-holder.js";
import { Header } from "../presentations/header.js";
import { Inspector } from "../presentations/inspector.js";
import { Inspectors } from "../presentations/inspectors.js";
import { PlayerEstimations } from "../presentations/player-estimations.js";
import { SelectableCard } from "../presentations/selectable-card.js";
import { UserRole } from "../types.js";
import * as styles from "./voting-area.css.js";

/**
 * Displaying selectable card holders
 */
const SelectableCardHolder = function SelectableCardHolder({
  type,
  points,
  onSelect,
  selected,
}: {
  type: UserRole;
  points: string[];
  onSelect?: (point: string) => void;
  selected?: string;
}) {
  const cards = points.map((v) => (
    <SelectableCard key={v} selected={v == selected} onSelect={() => onSelect?.(v)}>
      {v}
    </SelectableCard>
  ));

  return <CardHolder type={type}>{cards}</CardHolder>;
};

/**
 * Estimations of voting
 */
const VotingUserEstimations = function VotingUserEstimations({
  estimations,
  loading,
  revealable,
  onReveal,
}: {
  estimations: EstimationDto[];
  loading: boolean;
  revealable: boolean;
  onReveal?: () => void;
}) {
  return (
    <PlayerEstimations
      onReveal={onReveal}
      loading={loading}
      total={estimations.length}
      estimations={estimations}
      revealable={revealable}
    />
  );
};

/**
 * Inspectors in voting
 */
const VotingInspectors = function VotingInspectors({ inspectors: _inspectors }: { inspectors: EstimationDto[] }) {
  const inspectors = _inspectors.map((v, index) => <Inspector key={index} name={v.name} />);

  return <Inspectors>{inspectors}</Inspectors>;
};

type Props = {
  loading?: boolean;
  theme?: string;
  userRole?: UserRole;
  onSelect?: (point: string) => void;
  selected?: string;
  voters?: EstimationDto[];
  inspectors?: EstimationDto[];
  revealable?: boolean;
  /**
   * Handler to change theme
   */
  onChangeTheme?: (theme: string) => void;

  /**
   * Handler to change user role
   */
  onToggleRole?: () => void;

  /**
   * text of points
   */
  points?: string[];

  /**
   * Handler to reveal the vote
   */
  onReveal?: () => void;
};

export const VotingAreaLayout = function VotingAreaLayout(props: Prettify<Props>): JSX.Element {
  const {
    loading = false,
    onSelect,
    selected,
    voters = [],
    inspectors = [],
    onChangeTheme,
    onToggleRole,
    points = [],
    revealable = true,
    onReveal,
  } = props;
  const theme = props.theme ?? "";
  const userRole = props.userRole ?? "player";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header theme={theme} defaultRole={userRole} onChangeTheme={onChangeTheme} onToggleRole={onToggleRole} />
      </div>
      <div className={styles.estimations}>
        <VotingUserEstimations estimations={voters} loading={loading} revealable={revealable} onReveal={onReveal} />
      </div>
      <div className={styles.inspectors}>
        <VotingInspectors inspectors={inspectors} />
      </div>
      <div className={styles.cardHolder}>
        <SelectableCardHolder type={userRole} points={points} selected={selected} onSelect={onSelect} />
      </div>
    </div>
  );
};
