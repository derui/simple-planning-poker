import { createFacade } from "@spp/shared-hook-facade";
import { UseAuth, UseLogin } from "../atoms/atom.js";

type Hooks = {
  useAuth: UseAuth;
  useLogin: UseLogin;
};

const { hooks, ImplementationProvider } = createFacade<Hooks>();

export { hooks, ImplementationProvider };
