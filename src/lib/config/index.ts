import { StartupOptions, type IStartupOptions } from "./StartupOptions";

type ConfigModules = {
	startupOptions: IStartupOptions;
};

const getConfigModules = (options: IStartupOptions): ConfigModules => ({
	startupOptions: new StartupOptions(options),
});

export { getConfigModules };
export type { ConfigModules };
