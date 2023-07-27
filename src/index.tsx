import "./index.scss";
import "reflect-metadata";

import * as React from "react";
import { createRoot } from "react-dom/client";
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
const root = createRoot(rootElement);
root.render(<App container={getContainer(startupOptions)} />);
