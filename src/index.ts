type NonAsync<T> = T extends Promise<any> ? never : T;

export type InitialiserFn<T> = () => T;

export interface Lazy<T> {
    value(): T;
}

export function lazy<T>(initialiser: InitialiserFn<NonAsync<T>>): Lazy<T> {
    let value: T;

    const lazy: Lazy<T> = {
        value() {
            value = initialiser();
            lazy.value = () => value;
            return value;
        },
    };

    return lazy;
}

export function lazyPromise<T>(initialiser: InitialiserFn<Promise<T>>): Lazy<Promise<T>> {
    let value: T;
    let promise: Promise<T> | undefined;

    const lazy: Lazy<Promise<T>> = {
        async value() {
            if (!promise) {
                promise = initialiser();
            }

            try {
                value = await promise;
            } catch (error) {
                promise = undefined;
                throw error;
            }

            lazy.value = async () => value;

            return value;
        },
    };

    return lazy;
}
