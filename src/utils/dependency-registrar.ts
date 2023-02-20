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
  register<K extends keyof S>(name: K, bean: S[K]): void;

  resolve<K extends keyof S>(name: K): S[K];
}

class DependencyRegistrarImpl<S> implements DependencyRegistrar<S> {
  constructor(private beans: Bean<any>[] = []) {}

  register<K extends keyof S>(name: K, bean: S[K]) {
    const registeredBean = this.beans.find((v) => v.name === name);

    if (registeredBean) {
      return;
    }

    this.beans.push({
      name: name as string,
      bean,
      type: {
        _holder: undefined,
      } as Phantom<S[K]>,
    });
  }

  resolve<K extends keyof S>(name: K): S[K] {
    const bean = this.beans.find((v) => v.name === name)?.bean;

    if (!bean) {
      throw Error(`Not found bean that is name of ${name}`);
    }

    return bean as S[K];
  }
}

export const createDependencyRegistrar: <T>() => DependencyRegistrar<T> = () => {
  return new DependencyRegistrarImpl();
};
