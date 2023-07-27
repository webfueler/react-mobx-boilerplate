interface IStartupOptions {
	rootElement: string;
	basename: string;
}

// props required for the application start
// can be injected with env, and other methods
const startupOptions: IStartupOptions = {
	basename: "/",
	rootElement: "#root",
};

export { startupOptions };
export type { IStartupOptions };
