import { Game, User, VoterType } from "@spp/shared-domain";
import { VoterMode } from "../components/type.js";

/**
 * Data transfer object for `Game.T`. This interface can be used only in this package.
 */
export interface GameDto {
  id: string;
  name: string;
  points: string;
}

/**
 * Conversion function from `Game.T` to `GameDto`
 */
export const toGameDto = function toGameDto(game: Game.T): GameDto {
  return {
    id: game.id,
    name: game.name,
    points: game.points.map((v) => v.toString()).join(","),
  };
};

/**
 * Data transfer object for `User.T`. This interface can be used only in this package.
 */
export interface UserDto {
  id: string;
  name: string;
  defaultVoterMode: VoterMode;
}

/**
 * Conversion function from `User.T` to `UserDto`
 */
export const toUserDto = function toUserDto(user: User.T): UserDto {
  let voterMode: VoterMode;
  if (user.defaultVoterType == VoterType.Normal) {
    voterMode = VoterMode.Normal;
  } else {
    voterMode = VoterMode.Inspector;
  }

  return {
    id: user.id,
    name: user.name,
    defaultVoterMode: voterMode,
  };
};
