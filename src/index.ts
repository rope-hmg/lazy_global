export type OnSuccessFn = () => void;
export type InitialiserFn<T> = () => T;
export type WithRetryInitialiserFn<T> = (onSuccess: OnSuccessFn) => T;
export type LazyGetterFn<T> = () => T;

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

function replaceGetterFn<T>(lazy: ILazy<T>, value: T): void {
    Object.defineProperty(lazy, "value", {
        configurable: false,
        get: () => value,
    });
}

export function lazy<T>(initialiser: InitialiserFn<T>): ILazy<T> {
    let value: T;

    const lazy = createLazyObject(() => {
        value = initialiser();
        replaceGetterFn(lazy, value);
        return value;
    });

    return lazy;
}

export function lazyWithRetry<T>(initialiser: WithRetryInitialiserFn<T>): ILazy<T> {
    let value: T;
    let initialisedSuccessfully = false;

    const onSuccess: OnSuccessFn = () => {
        initialisedSuccessfully = true;
    };

    const lazy = createLazyObject(() => {
        value = initialiser(onSuccess);
        if (initialisedSuccessfully) {
            replaceGetterFn(lazy, value);
        }
        return value;
    });

    return lazy;
}
