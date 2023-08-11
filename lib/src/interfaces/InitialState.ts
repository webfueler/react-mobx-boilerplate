export type IInitialState = {
	identifiers: string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Record<string, any>;
};

export const isInitialState = (value: unknown): value is IInitialState =>
	value !== null &&
	value !== undefined &&
	typeof value === "object" &&
	"identifiers" in value &&
	"data" in value &&
	value.identifiers !== null &&
	value.identifiers !== undefined;
