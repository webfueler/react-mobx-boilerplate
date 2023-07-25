import { IStartupOptions } from "./interfaces";

class StartupOptions implements IStartupOptions {
	basename: string;
	rootElement: string;

	constructor(options: IStartupOptions) {
		this.basename = options.basename;
		this.rootElement = options.rootElement;
	}
}

export { StartupOptions };
