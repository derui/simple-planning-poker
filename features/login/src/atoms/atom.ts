import { atom, useAtom } from "jotai";

/**
 * login state of the user
 */
const loginedAtom = atom(false);

export const useMessage = () => {
  const [logined, setLogined] = useAtom(loginedAtom);

  return {
    logined: logined,
    login: () => {},
    logout: () => setLogined(false),
  };
};
