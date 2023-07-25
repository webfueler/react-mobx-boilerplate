import "./index.scss";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { getContainerModules } from "./container";
import { App } from "./App";
import type { IStartupOptions } from "./lib/config/StartupOptions";

// microfrontend / app required startup options
const options: IStartupOptions = {
	basename: "/",
	rootElement: "#root",
};
// modules to be available in our app
const modules = getContainerModules(options);

const container = document.querySelector(options.rootElement);
if (!container) {
	throw new Error(
		`Unable to mount React application. '${options.rootElement}' not found`,
	);
}
const root = createRoot(container);
root.render(<App modules={modules} />);
