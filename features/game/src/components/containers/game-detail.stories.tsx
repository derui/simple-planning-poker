import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, GameName, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import { hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameDetail } from "./game-detail.js";

const meta: Meta<typeof GameDetail> = {
  title: "Container/Game Detail",
  component: GameDetail,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <div className={themeClass}>
            <GameDetail />
          </div>
        </Provider>
      </ImplementationProvider>
    );
  },
};

export const Default: Story = {
  render() {
    GameRepository.save({
      game: Game.create({
        id: Game.createId(),
        name: GameName.create("game"),
        points: ApplicablePoints.parse("1,2,3,8")!,
        owner: User.createId("foo"),
      })[0],
    });
    const store = createStore();

    return (
      <ImplementationProvider implementation={hooks}>
        <Provider store={store}>
          <div className={themeClass}>
            <GameDetail />
          </div>
        </Provider>
      </ImplementationProvider>
    );
  },
};
