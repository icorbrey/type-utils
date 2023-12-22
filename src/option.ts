type Predicate<T> = (value: T) => boolean;

type Input<T> =
    | { isSome: true, value: T }
    | { isSome: false };

export type Option<T> = {
    /**
     * Returns `other` (if `Some`) or returns `None` (if `None`).
     * 
     * Arguments passed to this function are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * `Option.andThen`, which is lazily evaluated.
     */
    and: <U>(other: Option<U>) => Option<U>,

    /**
     * Calls the provided function with the contained value and returns the
     * result (if `Some`) or returns `None` (if `None`).
     */
    andThen: <U>(fn: (value: T) => Option<U>) => Option<U>,

    /**
     * Returns the contained `Some` value. Throws an error with a custom message
     * if the option is a `None` value.
     */
    expect: (message: string) => T,

    /**
     * Returns `None` if the option is `None`, otherwise calls the given
     * callback and returns `Some(value)` (where `value` is the contained `Some`
     * value) if `true` and `None` if `false`.
     */
    filter: (fn: (value: T) => boolean) => Option<T>,

    /**
     * Calls the provided closure with the contained value (if `Some`).
     */
    inspect: (fn: (value: T) => void) => Option<T>,

    /**
     * Returns `true` if the option is a `None` value.
     */
    isNone: () => boolean,

    /**
     * Returns `true` if the option is a `Some` value.
     */
    isSome: () => boolean,

    /**
     * Returns `true` if the option is a `Some` and the value inside of it
     * matches a predicate.
     */
    isSomeAnd: (fn: Predicate<T>) => boolean,

    /**
     * Maps an `Option<T>` to an `Option<U>` by applying a function to a
     * contained value (if `Some`) or returns `None` (if `None`).
     */
    map: <U>(fn: (value: T) => U) => Option<U>,

    /**
     * Applies a function to the contained value (if `Some`) or returns the
     * provided default value (if `None`).
     */
    mapOr: <U>(defaultValue: U, fn: (value: T) => U) => U,

    /**
     * Applies a function to the contained value (if `Some`) or computes a
     * default value from a closure.
     */
    mapOrElse: <U>(defaultFn: () => U, fn: (value: T) => U) => U,

    /**
     * Returns this option (if `Some`) or `other` (if `None`).
     * 
     * Arguments passed to this function are eagerly evaluated; if you are
     * passing the result of a function call, it is recommended to use
     * `Option.orElse`, which is lazily evaluated.
     */
    or: (other: Option<T>) => Option<T>,

    /**
     * Returns this option (if `Some`) or the result of the given function (if
     * `None`).
     */
    orElse: (fn: () => Option<T>) => Option<T>,

    /**
     * Returns the contained `Some` value. Throws an error if the option is a
     * `None` value.
     * 
     * Because this function may throw an error, its use is generally 
     * discouraged. Instead, call `Option.unwrapOr` or `Option.unwrapOrElse`.
     */
    unwrap: () => T,

    /**
     * Returns the contained `Some` value or a provided default.
     * 
     * Arguments passed to this function are eagerly evaluated; If you are
     * passing the result of a function call, it is recommended to use
     * `Option.unwrapOrElse`, which is lazily evaluated.
     */
    unwrapOr: (defaultValue: T) => T,

    /**
     * Returns the contained `Some` value or computes a default value from a
     * closure.
     */
    unwrapOrElse: (fn: () => T) => T,

    /**
     * Returns this option or `other` (if exactly one of them is `Some`) or
     * `None` (if neither or both is `Some`).
     */
    xor: (other: Option<T>) => Option<T>,

    /**
     * Zips this option with `other` to produce an option of a tuple. Returns
     * `None` if either option is `None`.
     */
    zip: <U>(other: Option<U>) => Option<[T, U]>,

    /**
     * Zips this option with `other` with the given function. Returns `None` if
     * either option is `None`.
     */
    zipWith: <U, R>(other: Option<U>, fn: (left: T, right: U) => R) => Option<R>,
};

const createOption = <T>(input: Input<T>): Option<T> => {
    let self: Option<T> = ({
        and: (other) =>
            input.isSome
                ? other
                : Option.None(),
        andThen: (fn) =>
            input.isSome
                ? fn(input.value)
                : Option.None(),
        expect: (message) => {
            if (input.isSome) {
                return input.value;
            }

            throw new Error(message);
        },
        filter: (fn) =>
            input.isSome && fn(input.value)
                ? Option.Some(input.value)
                : Option.None(),
        inspect: (fn) => {
            if (input.isSome) {
                fn(input.value);
            }

            return self;
        },
        isNone: () => !input.isSome,
        isSome: () => input.isSome,
        isSomeAnd: (fn) => input.isSome && fn(input.value),
        map: (fn) =>
            input.isSome
                ? Option.Some(fn(input.value))
                : Option.None(),
        mapOr: (defaultValue, fn) =>
            input.isSome
                ? fn(input.value)
                : defaultValue,
        mapOrElse: (defaultFn, fn) =>
            input.isSome
                ? fn(input.value)
                : defaultFn(),
        or: (other) =>
            input.isSome
                ? other
                : Option.None(),
        orElse: (fn) =>
            input.isSome
                ? fn()
                : Option.None(),
        unwrap: () => {
            if (input.isSome) {
                return input.value;
            }

            throw new Error();
        },
        unwrapOr: (defaultValue) =>
            input.isSome
                ? input.value
                : defaultValue,
        unwrapOrElse: (fn) =>
            input.isSome
                ? input.value
                : fn(),
        xor: (other) =>
            self.isSome() && other.isNone()
                ? self
                : self.isNone() && other.isSome()
                    ? other
                    : Option.None(),
        zip: (other) =>
            other.andThen((value) =>
                input.isSome
                    ? Option.Some([input.value, value])
                    : Option.None()),
        zipWith: (other, fn) =>
            other.andThen((value) =>
                input.isSome
                    ? Option.Some(fn(input.value, value))
                    : Option.None()),
    });

    return self;
}

export const Option = ({
    Some: <T>(value: T) => createOption<T>({
        isSome: true,
        value,
    }),
    None: <T>() => createOption<T>({
        isSome: false,
    }),
});
