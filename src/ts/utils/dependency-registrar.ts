type Phantom<T> = {
  __phantom: never;
  _holder: T | undefined;
};

type Bean<T> = {
  name: string;
  bean: T;
  type: Phantom<T>;
};

export interface DependencyRegistrar<S = { [k: string]: any }> {
  register<T>(name: keyof S, bean: T): void;

  resolve<K extends keyof S>(name: K): S[K];
}

class DependencyRegistrarImpl<S> implements DependencyRegistrar<S> {
  constructor(private beans: Bean<any>[] = []) {}

  register<T>(name: keyof S, bean: T) {
    const registeredBean = this.beans.find((v) => v.name === name);

    if (registeredBean) {
      return;
    }

    this.beans.push({
      name: name as string,
      bean,
      type: {
        _holder: undefined,
      } as Phantom<T>,
    });
  }

  resolve<T = S[keyof S]>(name: keyof S): T {
    const bean = this.beans.find((v) => v.name === name)?.bean;

    if (!bean) {
      throw Error(`Not found bean that is name of ${name}`);
    }

    return bean as T;
  }
}

export const createDependencyRegistrar: <T>() => DependencyRegistrar<T> = () => {
  return new DependencyRegistrarImpl();
};
