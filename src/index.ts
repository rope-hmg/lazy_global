type NonAsync<T> = T extends Promise<any> ? never : T;
type LazyGetterFn<T> = () => T;

export type InitialiserFn<T> = () => T;
export interface ILazy<T> {
    value: T;
}

function createLazyObject<T>(getterFn: LazyGetterFn<T>): ILazy<T> {
    const lazy = {};

    Object.defineProperty(lazy, "value", {
        configurable: true,
        get: getterFn,
    });

    return lazy as ILazy<T>;
}

function replaceGetterFn<T>(lazy: ILazy<T>, getterFn: () => T): void {
    Object.defineProperty(lazy, "value", {
        configurable: false,
        get: getterFn,
    });
}

export function lazy<T>(initialiser: InitialiserFn<NonAsync<T>>): ILazy<T> {
    let value: T;

    const lazy = createLazyObject(() => {
        value = initialiser();
        replaceGetterFn(lazy, () => value);
        return value;
    });

    return lazy;
}

export function lazyPromise<T>(initialiser: InitialiserFn<Promise<T>>): ILazy<Promise<T>> {
    let value: T;
    let promise: Promise<T> | undefined;

    const lazy = createLazyObject(async () => {
        if (!promise) {
            promise = initialiser();
        }

        try {
            value = await promise;
        } catch (error) {
            promise = undefined;
            throw error;
        }

        replaceGetterFn(lazy as any, async () => value);

        return value;
    });

    return lazy;
}
