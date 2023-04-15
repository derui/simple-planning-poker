import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as Loadable from "@/utils/loadable";

const selectSelf = (state: RootState) => state;
const selectRound = createDraftSafeSelector(selectSelf, (state) => state.round.instance);

interface RoundInformation {
  finished: boolean;
  theme: string | undefined;
}

export const selectRoundInformation = function selectRoundInformation() {
  return createDraftSafeSelector(selectRound, (round): Loadable.T<RoundInformation> => {
    if (!round) {
      return Loadable.loading();
    }

    const ret = {
      finished: round.state === "Finished",
      theme: undefined,
    };

    return Loadable.finished(ret);
  });
};
