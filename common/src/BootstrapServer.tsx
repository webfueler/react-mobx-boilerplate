import React from "react";
import { Container, interfaces } from "inversify";
import ReactDomServer from "react-dom/server";
import { matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "./router/interfaces";
import type { IStartupOptions } from "./interfaces";
import { TTLCache, type ITTLCache } from "./services";
import {
	identifiers as containerIdentifiers,
	identifiers,
} from "./container/constants";
import serializeJavascript from "serialize-javascript";
import { serverModule } from "./container";
import { HYDRATION_SELECTOR, HEAD_SELECTOR } from "./constants";
import { ContainerProvider } from "./container/ContainerProvider";
import { enableStaticRendering } from "mobx-react";
import { HttpErrorStatusCode } from "./components/HttpError";
import { IHttpErrorService } from "./services/HttpErrorService";

enableStaticRendering(true);

type RenderResult = {
	html: string;
	status: HttpErrorStatusCode | 200;
};

type Renderer = (requestUrl: string) => Promise<RenderResult>;

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
	scripts?: string[];
	css?: string[];
};

export function bootstrapServer(options: BootstrapServerOptions): {
	renderer: Renderer;
} {
	const { app, module, startupOptions, scripts, css } = options;

	const renderer: Renderer = async (requestUrl) => {
		// create application container
		const container = new Container({ defaultScope: "Singleton" });

		// bind startup options
		container
			.bind<IStartupOptions>(containerIdentifiers.IStartupOptions)
			.toConstantValue(startupOptions);

		// load modules
		container.load(module, serverModule);

		const matches = matchRoutes(routes, requestUrl, startupOptions.basename);
		const activeRoute = matches ? matches.pop() : null;

		let cacheData = "";

		if (activeRoute && activeRoute.route.fetchData) {
			await Promise.all(
				activeRoute.route.fetchData.map((identifier) => {
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

		// render html
		let markup = ReactDomServer.renderToString(
			<ServerRoot container={container} requestUrl={requestUrl} app={app} />,
		);
		let customHeadTags = "";

		// extract <Head> html
		const matchedTag = new RegExp(
			`<div id="${HEAD_SELECTOR}">(.*?)</div>`,
		).exec(markup);

		if (matchedTag && matchedTag[0] && matchedTag[1]) {
			customHeadTags = matchedTag[1];
			markup = markup.replace(matchedTag[0], "");
		}

		// get status during render
		const errorStatus = container.get<IHttpErrorService>(
			containerIdentifiers.IHttpErrorService,
		);

		const headTags = [
			...(scripts
				? scripts.map((url) => `<script defer="defer" src="${url}"/></script>`)
				: []),
			...(css
				? css.map((url) => [`<link rel="stylesheet" href="${url}" />`])
				: []),
		].join("");

		// load modules
		container.unload(module, serverModule);

		return {
			status: errorStatus.getErrorCode() || 200,
			html: `
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
		`,
		};
	};

	return { renderer };
}
