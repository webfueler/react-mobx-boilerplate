import { injectable } from "inversify";

export interface ITTLCache<T> {
	get: (key: string) => T | undefined;
	put: (key: string, value: T) => void;
	setTTL: (value: number) => void;
	getAll: () => Record<string, T>;
}

interface CachedData<T> {
	data: T;
	time: number;
}

const NUMBERS = {
	milliseconds: 1000,
};

@injectable()
export class TTLCache<T> implements ITTLCache<T> {
	private values: Map<string, CachedData<T>> = new Map<string, CachedData<T>>();
	private seconds = 0;

	public get(key: string): T | undefined {
		const date = new Date();
		const value = this.values.get(key);

		if (!value) {
			return undefined;
		}

		if (
			this.seconds !== 0 &&
			date.getTime() - value.time > this.seconds * NUMBERS.milliseconds
		) {
			this.values.delete(key);
			return undefined;
		}

		return value.data;
	}

	public setTTL(value: number): void {
		this.seconds = value;
	}

	public put(key: string, value: T): void {
		const date = new Date();
		this.values.delete(key);
		this.values.set(key, {
			data: value,
			time: date.getTime(),
		});
	}

	public getAll(): Record<string, T> {
		const result: Record<string, T> = {};

		for (const [key] of this.values.entries()) {
			Object.assign(result, { [key]: this.get(key) });
		}

		return result;
	}
}
