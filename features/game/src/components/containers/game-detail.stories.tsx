import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, GameName, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { themeClass } from "@spp/ui-theme";
import { Provider } from "jotai";
import { useEffect } from "react";
import { useCurrentGame } from "../../atoms/use-current-game.js";
import { useGames } from "../../atoms/use-games.js";
import { useUserInfo } from "../../atoms/use-user-info.js";
import { GameDetail } from "./game-detail.js";

const meta: Meta<typeof GameDetail> = {
  title: "Container/Game Detail",
  component: GameDetail,
  tags: ["autodocs"],
  beforeEach: async () => {
    clearGame();
    clearUser();

    await UserRepository.save({
      user: User.create({
        id: User.createId("foo"),
        name: "foo",
      }),
    });

    await GameRepository.save({
      game: Game.create({
        id: Game.createId("game"),
        name: GameName.create("game"),
        points: ApplicablePoints.parse("1,2,3,8")!,
        owner: User.createId("foo"),
      })[0],
    });
  },
};

const Logined = ({ children }: React.PropsWithChildren) => {
  const { loadUser } = useUserInfo();
  const { select } = useCurrentGame();
  useGames();

  useEffect(() => {
    loadUser("foo");
    select(Game.createId("game"));
  }, []);

  return children;
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingPrepared: Story = {
  render() {
    return (
      <Provider>
        <div className={themeClass}>
          <GameDetail />
        </div>
      </Provider>
    );
  },
};

export const Default: Story = {
  render() {
    return (
      <Provider>
        <Logined>
          <div className={themeClass}>
            <GameDetail />
          </div>
        </Logined>
      </Provider>
    );
  },
};
