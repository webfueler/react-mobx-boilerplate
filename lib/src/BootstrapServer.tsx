import React from "react";
import { Container, interfaces } from "inversify";
import ReactDomServer from "react-dom/server";
import { matchRoutes } from "react-router-dom";
import { routes } from "../../client/src/routes/routes";
import { isServerSideFetcher } from "./router/interfaces";
import type { IStartupOptions } from "./interfaces";
import type { ITTLCache } from "./services";
import { identifiers as containerIdentifiers } from "./container/constants";
import serializeJavascript from "serialize-javascript";
import { serverModule } from "./container";
import { HYDRATION_SELECTOR, HEAD_SELECTOR } from "./constants";
import { HttpErrorStatusCode } from "./components/HttpError";
import { IHttpErrorService } from "./services/HttpErrorService";
import { ServerRoot } from "./components/ServerRoot";

type RenderResult = {
	html: string;
	status: HttpErrorStatusCode | 200;
};

export type Renderer = (options: {
	requestUrl: string;
	scripts: string[];
	css: string[];
}) => Promise<RenderResult>;

type BootstrapServerOptions = {
	module: interfaces.ContainerModule;
	app: React.ReactNode;
	startupOptions: IStartupOptions;
};

export function bootstrapServer(options: BootstrapServerOptions): {
	renderer: Renderer;
} {
	const { app, module, startupOptions } = options;

	const renderer: Renderer = async ({ requestUrl, css, scripts }) => {
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

		const cacheData = {
			startupOptions,
		};

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

			Object.assign(cacheData, {
				identifiers,
				data: cacheService.getAll(),
			});
		}

		// render html
		let markup = ReactDomServer.renderToString(
			<ServerRoot container={container} requestUrl={requestUrl} app={app} />,
		);

		// these are tags sent by `<Head>` component
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
			...scripts.map((url) => `<script defer="defer" src="${url}"/></script>`),
			...css.map((url) => [`<link rel="stylesheet" href="${url}" />`]),
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
					<script type="${HYDRATION_SELECTOR}">${serializeJavascript(cacheData, {
						isJSON: true,
					})}</script>
				</body>
			</html>
		`,
		};
	};

	return { renderer };
}
