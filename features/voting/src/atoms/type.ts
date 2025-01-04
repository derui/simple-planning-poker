import { UserRole } from "../components/types.js";
import { EstimationDto } from "./dto.js";

/**
 * Hook to get common attributes at polling place
 */
export type PollingPlace = {
  /**
   * ID of current voting
   */
  id: string;

  /**
   * Estimations in voting.
   */
  estimations: EstimationDto[];

  /**
   * inspectors in voting
   */
  inspectors: EstimationDto[];

  /**
   * theme of current joining voting
   */
  theme: string;

  /**
   * role of login user.
   */
  userRole: UserRole;

  /**
   * applicable points in this voting
   */
  points: string[];
};
