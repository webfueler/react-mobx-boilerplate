import "./index.scss";
import "reflect-metadata";

import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { getContainer } from "./container";
// application options
import { startupOptions } from "./config";
import { isServerSideFetcher } from "./routes/interfaces";
import type { interfaces } from "inversify";
import { matchRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { identifiers } from "./container/constants";

const renderApp = (container: interfaces.Container): void => {
	const rootElement = document.querySelector(startupOptions.rootElement);
	if (!rootElement) {
		throw new Error(
			`Unable to mount React application. '${startupOptions.rootElement}' not found`,
		);
	}

	hydrateRoot(rootElement, <App container={container} />);
};

export type InitialState = {
	identifiers: string[];
	data: Record<string, any>;
};

export const isInitialState = (value: unknown): value is InitialState =>
	value !== null &&
	value !== undefined &&
	typeof value === "object" &&
	"identifiers" in value &&
	"data" in value &&
	value.identifiers !== null &&
	value.identifiers !== undefined;

async function bootstrap(): Promise<void> {
	const container = getContainer(startupOptions);

	const hydrationData = document.querySelector(
		"script[type='text/ssr-fetch-cache']",
	);

	let initialState: boolean | InitialState = false;
	try {
		initialState = hydrationData
			? eval("(" + hydrationData.innerHTML + ")")
			: false;
	} catch {
		initialState = false;
	}

	if (isInitialState(initialState)) {
		container
			.bind<InitialState>(identifiers.IInitialState)
			.toConstantValue(initialState);

		const matches = matchRoutes(
			routes,
			window.location.href.replace(window.location.origin, ""),
			startupOptions.basename,
		);
		const activeRoute = matches ? matches.pop() : null;
		if (!activeRoute)
			throw new Error(
				`Something is wrong. Couldn't find the route. Got ${activeRoute}`,
			);

		await Promise.all(
			initialState.identifiers.map((identifier) => {
				const store = container.get(Symbol.for(identifier));
				if (isServerSideFetcher(store)) {
					return store.serverSideFetch(activeRoute);
				}
				return Promise.resolve(false);
			}),
		);
		renderApp(container);
	} else {
		container
			.bind<InitialState>(identifiers.IInitialState)
			.toConstantValue({ data: {}, identifiers: [] });
		renderApp(container);
	}
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
