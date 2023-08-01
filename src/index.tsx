import "./index.scss";
import "reflect-metadata";

import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { getContainer } from "./container";
// application options
import { startupOptions } from "./config";

const rootElement = document.querySelector(startupOptions.rootElement);
if (!rootElement) {
	throw new Error(
		`Unable to mount React application. '${startupOptions.rootElement}' not found`,
	);
}

hydrateRoot(rootElement, <App container={getContainer(startupOptions)} />);
// root.render(<App container={getContainer(startupOptions)} />);
