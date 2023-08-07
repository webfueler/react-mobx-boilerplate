import React from "react";
import { Container, interfaces } from "inversify";
import ReactDomServer from "react-dom/server";
import { matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "./router/interfaces";
import type { IStartupOptions } from "./interfaces";
import { type ITTLCache } from "./services";
import { identifiers as containerIdentifiers } from "./container/constants";
import serializeJavascript from "serialize-javascript";
import { serverModule } from "./container";
import { HYDRATION_SELECTOR, HEAD_SELECTOR } from "./constants";
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
	startupOptions: IStartupOptions;
};

export function bootstrapServer(options: BootstrapServerOptions): {
	renderer: Renderer;
} {
	const { app, isDevelopment, module, startupOptions } = options;

	// create application container
	const container = new Container({ defaultScope: "Singleton" });

	// bind startup options
	container
		.bind<IStartupOptions>(containerIdentifiers.IStartupOptions)
		.toConstantValue(startupOptions);

	const renderer: Renderer = async (requestUrl) => {
		const matches = matchRoutes(routes, requestUrl, startupOptions.basename);
		const activeRoute = matches ? matches.pop() : null;

		let cacheData = "";

		// load modules on each request
		container.load(module, serverModule);

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

		let markup = ReactDomServer.renderToString(
			<ServerRoot container={container} requestUrl={requestUrl} app={app} />,
		);
		let customHeadTags = "";

		const matchedTag = new RegExp(
			`<div id="${HEAD_SELECTOR}">(.*?)</div>`,
		).exec(markup);

		if (matchedTag && matchedTag[0] && matchedTag[1]) {
			customHeadTags = matchedTag[1];
			markup = markup.replace(matchedTag[0], "");
		}

		// unload modules on each request
		container.unload(module, serverModule);

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
					${customHeadTags}
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
