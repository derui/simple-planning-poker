import { createFacade } from "@spp/shared-hook-facade";
import { UseAuth, UseLogin } from "../atoms/atom.js";

export type Hooks = {
  useAuth: UseAuth;
  useLogin: UseLogin;
};

const facade: ReturnType<typeof createFacade<Hooks>> = createFacade<Hooks>();

export const hooks: Readonly<Hooks> = facade.hooks;
export const ImplementationProvider: typeof facade.ImplementationProvider = facade.ImplementationProvider;
