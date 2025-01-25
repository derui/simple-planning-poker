import { createContext, useContext } from "react";

export type ImplementationProvider<T> = React.ComponentType<React.PropsWithChildren<{ implementation: T }>>;

/**
 * Create facade with type `Hooks`
 */
export const createFacade = function createFacade<Hooks extends Record<string, () => unknown>>(): {
  hooks: Readonly<Hooks>;
  ImplementationProvider: ImplementationProvider<Hooks>;
} {
  const providerNotFound: unique symbol = Symbol();

  const Context = createContext<Hooks | typeof providerNotFound>(providerNotFound);

  const implementationHandler: ProxyHandler<Hooks> = {
    get(_target, prop, _receiver) {
      // eslint-disable-next-line
      const obj = useContext(Context);

      if (obj === providerNotFound) {
        throw new Error("Provider not found");
      }

      if (typeof prop == "symbol") {
        throw new Error("Can not use symbol as hook key");
      }

      return obj[prop];
    },
    has() {
      return false;
    },
    ownKeys() {
      return [];
    },
    getOwnPropertyDescriptor() {
      return undefined;
    },
    getPrototypeOf() {
      return null;
    },
    preventExtensions() {
      return true;
    },
    isExtensible() {
      return false;
    },
    set() {
      return false;
    },
    deleteProperty() {
      return false;
    },
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const proxy = new Proxy<Hooks>({} as Hooks, implementationHandler);

  const ImplementationProvider: ImplementationProvider<Hooks> = ({ implementation, children }) => {
    const consumed = useContext(Context);

    if (consumed !== providerNotFound) {
      throw new Error("Provider already defined");
    }

    return <Context.Provider value={implementation}>{children}</Context.Provider>;
  };

  return { hooks: proxy, ImplementationProvider };
};
