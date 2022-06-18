import { CurrentUserViewModel } from "../types";
import { createSignal } from "solid-js";

const [currentUserState, setCurrentUserState] = createSignal<CurrentUserViewModel>({
  id: null,
  name: "",
  joinedGames: [],
});

export { currentUserState, setCurrentUserState };
