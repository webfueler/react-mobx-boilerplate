import React from "react";
import { Container, interfaces } from "inversify";
import ReactDomServer from "react-dom/server";
import { matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "./router/interfaces";
import type { IStartupOptions } from "./interfaces";
import { TTLCache, type ITTLCache, ServerHttpService } from "./services";
import {
	identifiers as containerIdentifiers,
	identifiers,
} from "./container/constants";
import serializeJavascript from "serialize-javascript";
import { commonContainerModule } from "./container";
import { HYDRATION_SELECTOR } from "./constants";
import { ContainerProvider } from "./container/ContainerProvider";
import { enableStaticRendering } from "mobx-react";

enableStaticRendering(true);

type Renderer = (requestUrl: string) => Promise<string>;

type ServerRootProps = {
	app: React.ReactNode;
	container: interfaces.Container;
	requestUrl: string;
};

const ServerRoot = ({
	app,
	container,
	requestUrl,
}: ServerRootProps): React.ReactNode => {
	const startupOptions = container.get<IStartupOptions>(
		containerIdentifiers.IStartupOptions,
	);

	return (
		<ContainerProvider container={container}>
			<StaticRouter basename={startupOptions.basename} location={requestUrl}>
				{app}
			</StaticRouter>
		</ContainerProvider>
	);
};

type BootstrapServerOptions = {
	module: interfaces.ContainerModule;
	app: React.ReactNode;
	isDevelopment: boolean;
};

export function bootstrapServer(options: BootstrapServerOptions): {
	renderer: Renderer;
} {
	const { app, isDevelopment, module } = options;

	// create application container
	const container = new Container({ defaultScope: "Singleton" });
	// container.load(module, commonContainerModule);
	container.load(module, commonContainerModule);

	const startupOptions: IStartupOptions = {
		basename: "/",
		rootElement: "#root",
	};

	// bind startup options
	container
		.bind<IStartupOptions>(containerIdentifiers.IStartupOptions)
		.toConstantValue(startupOptions);

	const renderer: Renderer = async (requestUrl) => {
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

		const markup = ReactDomServer.renderToString(
			<ServerRoot container={container} requestUrl={requestUrl} app={app} />,
		);

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
