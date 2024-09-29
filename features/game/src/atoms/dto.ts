import { Game, User } from "@spp/shared-domain";

/**
 * Data transfer object for `Game.T`. This interface can be used only in this package.
 */
export interface GameDto {
  id: string;
  name: string;
  owned: boolean;
}

/**
 * Conversion function from `Game.T` to `GameDto`
 */
export const toGameDto = function toGameDto(game: Game.T, currentUserId: User.Id): GameDto {
  return {
    id: game.id,
    name: game.name,
    owned: game.owner == currentUserId,
  };
};
