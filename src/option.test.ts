import { Option } from './option';

describe('Option<T>', () => {
	it('.and', () => {
		const x1 = Option.Some(2);
		const y1 = Option.None<string>();

		expect(x1.and(y1).isNone()).toBe(true);

		const x2 = Option.None<number>();
		const y2 = Option.Some('foo');

		expect(x2.and(y2).isNone()).toBe(true);

		const x3 = Option.Some(2);
		const y3 = Option.Some('foo');

		expect(x3.and(y3).unwrap()).toBe('foo');

		const x4 = Option.None<number>();
		const y4 = Option.None<string>();

		expect(x4.and(y4).isNone()).toBe(true)
	});

	it('.andThen', () => {
		const square = (x: number): Option<number> =>
			x < 200000
				? Option.Some(x * x)
				: Option.None();

		const x = Option.Some(2);
		expect(x.andThen(square).unwrap()).toBe(4);

		const y = Option.Some(1000000);
		expect(y.andThen(square).isNone()).toBe(true);

		const z = Option.None<number>();
		expect(z.andThen(square).isNone()).toBe(true);
	});

	it('.expect', () => {
		const message = "Nothing to see";

		const x = Option.Some('value');
		expect(x.expect(message)).toBe('value');

		const y = Option.None();
		expect(() => y.expect(message)).toThrow(new Error(message));
	});

	it('.filter', () => {
		const isEven = (x: number) => x % 2 == 0;

		const x = Option.Some(4);
		expect(x.filter(isEven).unwrap()).toBe(4);

		const y = Option.Some(3);
		expect(y.filter(isEven).isNone()).toBe(true);

		const z = Option.None<number>();
		expect(z.filter(isEven).isNone()).toBe(true);
	});

	it('.inspect', () => {
		const x = Option.Some(1);
		const inspectX = jest.fn();

		x.inspect(inspectX);

		expect(inspectX).toHaveBeenCalledWith(x.unwrap())

		const y = Option.None();
		const inspectY = jest.fn();

		y.inspect(inspectY);

		expect(inspectY).not.toHaveBeenCalled();
	});

	it('.isNone', () => {
		const x = Option.Some(2);
		expect(x.isNone()).toBe(false);

		const y = Option.None();
		expect(y.isNone()).toBe(true);
	});

	it('.isSome', () => {
		const x = Option.Some(2);
		expect(x.isSome()).toBe(true);

		const y = Option.None();
		expect(y.isSome()).toBe(false);
	});

	it('.isSomeAnd', () => {
		const x = Option.Some(2);
		expect(x.isSomeAnd(x => 1 < x)).toBe(true);

		const y = Option.Some(1);
		expect(y.isSomeAnd(x => 1 < x)).toBe(false);

		const z = Option.None<number>();
		expect(z.isSomeAnd(x => 1 < x)).toBe(false);
	});

	it('.map', () => {
		const maybeString = Option.Some("Hello, world!");
		const maybeLength = maybeString.map(s => s.length);

		expect(maybeLength.unwrap()).toBe(13);

		const probablyString = Option.None<string>();
		const probablyLength = probablyString.map(s => s.length)

		expect(probablyLength.isNone()).toBe(true);
	});

	it('.mapOr', () => {
		const x = Option.Some('foo');
		expect(x.mapOr(42, x => x.length)).toBe(3);

		const y = Option.None<string>();
		expect(y.mapOr(42, x => x.length)).toBe(42);
	});

	it('.mapOrElse', () => {
		const k = 21;

		const x = Option.Some('foo');
		expect(x.mapOrElse(() => 2 * k, x => x.length)).toBe(3);

		const y = Option.None<string>();
		expect(y.mapOrElse(() => 2 * k, x => x.length)).toBe(42);
	});

	it('.or', () => {
		const x1 = Option.Some(2);
		const y1 = Option.None<number>();

		expect(x1.or(y1).unwrap()).toBe(2);

		const x2 = Option.None<number>();
		const y2 = Option.Some(100);

		expect(x2.or(y2).unwrap()).toBe(100);

		const x3 = Option.Some(2);
		const y3 = Option.Some(100);

		expect(x3.or(y3).unwrap()).toBe(2);

		const x4 = Option.None<number>();
		const y4 = Option.None<number>();

		expect(x4.or(y4).isNone()).toBe(true);
	});

	it('.orElse', () => {
		const nobody = () => Option.None<string>();
		const vikings = () => Option.Some('vikings');

		const x = Option.Some('barbarians');
		expect(x.orElse(vikings).unwrap()).toBe('barbarians');

		const y = Option.None<string>();
		expect(y.orElse(vikings).unwrap()).toBe('vikings');

		const z = Option.None<string>();
		expect(z.orElse(nobody).isNone()).toBe(true);
	});

	it('.unwrap', () => {
		const x = Option.Some('air');
		expect(x.unwrap()).toBe('air');

		const y = Option.None();
		expect(() => y.unwrap()).toThrow();
	});

	it('.unwrapOr', () => {
		const x = Option.Some('car');
		expect(x.unwrapOr('bike')).toBe('car');

		const y = Option.None<string>();
		expect(y.unwrapOr('bike')).toBe('bike')
	});

	it('.unwrapOrElse', () => {
		const k = 10;

		const x = Option.Some(4);
		expect(x.unwrapOrElse(() => 2 * k)).toBe(4);

		const y = Option.None<number>();
		expect(y.unwrapOrElse(() => 2 * k)).toBe(20);
	});

	it('.xor', () => {
		const x1 = Option.Some(2);
		const y1 = Option.None<number>();

		expect(x1.xor(y1).unwrap()).toBe(2);

		const x2 = Option.None<number>();
		const y2 = Option.Some(2);

		expect(x2.xor(y2).unwrap()).toBe(2);

		const x3 = Option.Some(2);
		const y3 = Option.Some(2);

		expect(x3.xor(y3).isNone()).toBe(true);

		const x4 = Option.None<number>();
		const y4 = Option.None<number>();

		expect(x4.xor(y4).isNone()).toBe(true);
	});

	it('.zip', () => {
		const x = Option.Some(1);
		const y = Option.Some('hello');
		const z = Option.None<number>();

		expect(x.zip(y).unwrap()).toStrictEqual([1, 'hello']);
		expect(x.zip(z).isNone()).toBe(true);
	});

	it('.zipWith', () => {
		const createPoint = (x: number, y: number) => ({ x, y });

		const x = Option.Some(12.3);
		const y = Option.Some(45.6);
		const z = Option.None<number>();

		expect(x.zipWith(y, createPoint).unwrap()).toStrictEqual({ x: 12.3, y: 45.6 });
		expect(x.zipWith(z, createPoint).isNone()).toBe(true);
	});
})
