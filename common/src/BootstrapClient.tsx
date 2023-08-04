import React from "react";
import { interfaces } from "inversify";
import { IInitialState, IStartupOptions, isInitialState } from "./interfaces";
import { identifiers } from "./container/constants";
import { hydrateRoot } from "react-dom/client";
import { HYDRATION_SELECTOR } from "./constants";
import { matchRoutes } from "react-router-dom";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "../../client/src/routes/interfaces";
import { commonContainerModule } from "./container";

const renderApp = (
	container: interfaces.Container,
	app: React.ReactNode,
): void => {
	const startupOptions = container.get<IStartupOptions>(
		identifiers.IStartupOptions,
	);

	const rootElement = document.querySelector(startupOptions.rootElement);
	if (!rootElement) {
		throw new Error(
			`Unable to mount React application. '${startupOptions.rootElement}' not found`,
		);
	}

	hydrateRoot(rootElement, app);
};

export async function bootstrapClient(
	container: interfaces.Container,
	app: React.ReactNode,
): Promise<void> {
	container.load(commonContainerModule);

	const startupOptions: IStartupOptions = {
		basename: "/",
		rootElement: "#root",
	};

	container
		.bind<IStartupOptions>(identifiers.IStartupOptions)
		.toConstantValue(startupOptions);

	const hydrationData = document.querySelector(
		`script[type='${HYDRATION_SELECTOR}']`,
	);

	let initialState: boolean | IInitialState = false;
	try {
		initialState = hydrationData
			? eval("(" + hydrationData.innerHTML + ")")
			: false;
	} catch {
		initialState = false;
	}

	if (isInitialState(initialState)) {
		container
			.bind<IInitialState>(identifiers.IInitialState)
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
		renderApp(container, app);
	} else {
		console.error("Initial State not found! Error during SSR?!?");
		container
			.bind<IInitialState>(identifiers.IInitialState)
			.toConstantValue({ data: {}, identifiers: [] });
		renderApp(container, app);
	}
}
