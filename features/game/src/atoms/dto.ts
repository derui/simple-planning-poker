import { Game, User } from "@spp/shared-domain";

/**
 * Data transfer object for `Game.T`. This interface can be used only in this package.
 */
export interface GameDto {
  id: string;
  name: string;
}

/**
 * Conversion function from `Game.T` to `GameDto`
 */
export const toGameDto = function toGameDto(game: Game.T): GameDto {
  return {
    id: game.id,
    name: game.name,
  };
};

/**
 * Data transfer object for `User.T`. This interface can be used only in this package.
 */
export interface UserDto {
  id: string;
  name: string;
}

/**
 * Conversion function from `User.T` to `UserDto`
 */
export const toUserDto = function toUserDto(user: User.T): UserDto {
  return {
    id: user.id,
    name: user.name,
  };
};
