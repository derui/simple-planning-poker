/**
 * DTO for user estimation
 */
export type EstimationDto = {
  name: string;
  estimated: boolean;
};

/**
 * DTO for user estimation at revealed
 */
export type RevealedEstimationDto = {
  name: string;
  estimated: string;
};
