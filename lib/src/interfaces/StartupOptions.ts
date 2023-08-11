export interface IStartupOptions {
	rootElement: string;
	basename: string;
}

export const isStartupOptions = (value: unknown): value is IStartupOptions =>
	value !== null &&
	value !== undefined &&
	typeof value === "object" &&
	"rootElement" in value &&
	"basename" in value;
