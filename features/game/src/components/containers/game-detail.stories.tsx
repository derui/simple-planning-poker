import type { Meta, StoryObj } from "@storybook/react";

import { ApplicablePoints, Game, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newDeleteGameUseCase } from "@spp/shared-use-case";
import { themeClass } from "@spp/ui-theme";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { gamesAtom, selectedGameAtom } from "../../atoms/game-atom.js";
import { createUseGameDetail } from "../../atoms/game-detail.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { GameDetail } from "./game-detail.js";
import { GameIndex } from "./game-index.js";

const meta: Meta<typeof GameIndex> = {
  title: "Container/Game Detail",
  component: GameDetail,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingPrepared: Story = {
  render() {
    const store = createStore();
    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      useListGames: sinon.fake(),
      useUserHeader: sinon.fake(),
      useGameDetail: createUseGameDetail({
        gameRepository: newMemoryGameRepository(),
        useLoginUser: () => ({ userId: User.createId("foo") }),
        deleteGameUseCase: sinon.fake(),
      }),
    };

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
    const game = Game.create({
      id: Game.createId(),
      name: "game",
      points: ApplicablePoints.parse("1,2,3,8")!,
      owner: User.createId("foo"),
    })[0];
    const store = createStore();
    store.set(selectedGameAtom, game);
    store.set(gamesAtom, [game]);
    const repository = newMemoryGameRepository([game]);

    const hooks: Hooks = {
      useCreateGame: sinon.fake(),
      useListGames: sinon.fake(),
      useUserHeader: sinon.fake(),
      useGameDetail: createUseGameDetail({
        gameRepository: repository,
        useLoginUser: () => ({ userId: User.createId("foo") }),
        deleteGameUseCase: newDeleteGameUseCase(repository),
      }),
    };

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
