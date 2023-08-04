import React from "react";
import { interfaces } from "inversify";
import ReactDomServer from "react-dom/server";
import { matchRoutes } from "react-router-dom";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "../../client/src/routes/interfaces";
import type { IStartupOptions } from "./interfaces";
import type { ITTLCache } from "./services";
import { identifiers as containerIdentifiers } from "./container/constants";
import serializeJavascript from "serialize-javascript";
import { commonContainerModule } from "./container";
import { HYDRATION_SELECTOR } from "./constants";

type Renderer = (
	app: React.ReactElement,
	requestUrl: string,
) => Promise<string>;

export function bootstrapServer(
	container: interfaces.Container,
	isDevelopment: boolean,
): { renderer: Renderer } {
	container.load(commonContainerModule);

	const startupOptions: IStartupOptions = {
		basename: "/",
		rootElement: "#root",
	};

	container
		.bind<IStartupOptions>(containerIdentifiers.IStartupOptions)
		.toConstantValue(startupOptions);

	const renderer: Renderer = async (app, requestUrl) => {
		const matches = matchRoutes(routes, requestUrl, startupOptions.basename);
		const activeRoute = matches ? matches.pop() : null;

		let cacheData = "";

		if (activeRoute && activeRoute.route.fetchData) {
			await Promise.all(
				activeRoute.route.fetchData.map((identifier) => {
					console.log(`Prefetch ${identifier.description}`);
					const store = container.get(identifier);
					if (isServerSideFetcher(store)) {
						return store.serverSideFetch(activeRoute);
					}
					return Promise.resolve(false);
				}),
			);

			const cacheService = container.get<ITTLCache<unknown>>(
				containerIdentifiers.ITTLCache,
			);

			const identifiers = activeRoute.route.fetchData
				.map((identifier) => identifier.description || "")
				.filter((value) => value !== "");

			cacheData = serializeJavascript(
				{
					identifiers,
					data: cacheService.getAll(),
				},
				{ isJSON: true },
			);
		}

		const markup = ReactDomServer.renderToString(app);

		const headTags = isDevelopment
			? `
			<script defer="defer" src="/client.app.js"></script>
			<script defer="defer" src="/client.runtime.js"></script>
		`
			: {};

		return `
			<!doctype html>
			<html>
				<head>
					<title>SSR App</title>
					${headTags}
				</head>
				<body>
					<div id="root">${markup}</div>
					<script type="${HYDRATION_SELECTOR}">${cacheData}</script>
				</body>
			</html>
		`;
	};

	return { renderer };
}
