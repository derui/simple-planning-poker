import clsx from "clsx";
import { UserRole } from "../types.js";
import { CardHolder } from "../presentations/card-holder.js";
import { SelectableCard } from "../presentations/selectable-card.js";
import { EstimationDto } from "../../atoms/dto.js";
import { PlayerEstimations } from "../presentations/player-estimations.js";
import { Inspectors } from "../presentations/inspectors.js";
import { Inspector } from "../presentations/inspector.js";
import { Header } from "../presentations/header.js";
import { Prettify } from "@spp/shared-type-util";

const styles = {
  container: clsx("grid", "w-full", "h-full", "grid-rows-4", "grid-cols-1", "gap-4", "place-items-center"),
  header: clsx("grid-row-1", "w-full"),
  estimations: clsx("grid-row-2", "w-3/4"),
  inspectors: clsx("grid-row-3", "", "w-3/4"),
  cardHolder: clsx("grid-row-4", "w-3/4"),
} as const;

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
}: {
  estimations: EstimationDto[];
  loading: boolean;
}) {
  return <PlayerEstimations loading={loading} total={estimations.length} estimations={estimations} />;
};

/**
 * Inspectors in voting
 */
const VotingInspectors = function VotingInspectors({ inspectors: _inspectors }: { inspectors: EstimationDto[] }) {
  const inspectors = _inspectors.map((v) => <Inspector name={v.name} />);

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
  /**
   * Handler to change theme
   */
  onChangeTheme?: (theme: string) => void;

  /**
   * Handler to change user role
   */
  onChangeRole?: (role: UserRole) => void;

  /**
   * text of points
   */
  points?: string[];
};

export const VotingAreaLayout = function VotingAreaLayout(props: Prettify<Props>) {
  const {
    loading = false,
    onSelect,
    selected,
    voters = [],
    inspectors = [],
    onChangeTheme,
    onChangeRole,
    points = [],
  } = props;
  const theme = props.theme ?? "";
  const userRole = props.userRole ?? "player";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header theme={theme} defaultRole={userRole} onChangeTheme={onChangeTheme} onChangeRole={onChangeRole} />
      </div>
      <div className={styles.estimations}>
        <VotingUserEstimations estimations={voters} loading={loading} />
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
