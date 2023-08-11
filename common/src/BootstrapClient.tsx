import React from "react";
import { Container, interfaces } from "inversify";
import {
	type IInitialState,
	type IStartupOptions,
	isInitialState,
} from "./interfaces";
import { identifiers } from "./container/constants";
import { hydrateRoot } from "react-dom/client";
import { HYDRATION_SELECTOR } from "./constants";
import { matchRoutes } from "react-router-dom";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "./router/interfaces";
import { clientModule } from "./container";
import { ClientRoot } from "./components/ClientRoot";
import { isHydrationData } from "./interfaces/HydrationData";

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

	hydrateRoot(rootElement, <ClientRoot container={container} app={app} />);
};

type BootstrapClientOptions = {
	module: interfaces.ContainerModule;
	app: React.ReactNode;
};

export async function bootstrapClient(
	options: BootstrapClientOptions,
): Promise<void> {
	const { app, module } = options;

	const container = new Container({ defaultScope: "Singleton" });
	container.load(module, clientModule);

	const hydrationDataElement = document.querySelector(
		`script[type='${HYDRATION_SELECTOR}']`,
	);

	let hydrationData: boolean | IInitialState = false;
	try {
		hydrationData = hydrationDataElement
			? eval("(" + hydrationDataElement.innerHTML + ")")
			: false;
	} catch {
		hydrationData = false;
	}

	if (isHydrationData(hydrationData)) {
		const { startupOptions } = hydrationData;

		container
			.bind<IStartupOptions>(identifiers.IStartupOptions)
			.toConstantValue(startupOptions);

		if (isInitialState(hydrationData)) {
			const { data, identifiers: cachedIdentifiers } = hydrationData;

			container
				.bind<IInitialState>(identifiers.IInitialState)
				.toConstantValue({ data, identifiers: cachedIdentifiers });

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
				cachedIdentifiers.map((identifier) => {
					const store = container.get(Symbol.for(identifier));
					if (isServerSideFetcher(store)) {
						return store.serverSideFetch(activeRoute);
					}
					return Promise.resolve(false);
				}),
			);
		} else {
			container
				.bind<IInitialState>(identifiers.IInitialState)
				.toConstantValue({ data: {}, identifiers: [] });
		}

		renderApp(container, app);
	} else {
		throw new Error(
			"Can't bootstrap application. Missing initial state from server",
		);
	}
}
