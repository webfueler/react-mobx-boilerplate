import { IInitialState } from "./InitialState";
import { IStartupOptions, isStartupOptions } from "./StartupOptions";

type HydrationData = Partial<IInitialState> & {
	startupOptions: IStartupOptions;
};

export const isHydrationData = (value: unknown): value is HydrationData =>
	value !== null &&
	value !== undefined &&
	typeof value === "object" &&
	"startupOptions" in value &&
	isStartupOptions(value.startupOptions);
