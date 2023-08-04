// Server
import express from "express";
import path from "node:path";
import webpackDevMiddleWare from "webpack-dev-middleware";
// import webpackHotMiddleware from "webpack-hot-middleware";
import { webpack } from "webpack";
import { serverConfig } from "../../webpack.config";
import serialize from "serialize-javascript";

// Application
import "reflect-metadata";
import React from "react";
import ReactDomServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchRoutes } from "react-router-dom";
import { routes } from "../routes/routes";
import { ContainerProvider, getContainer } from "../container";
import { startupOptions } from "../config";
import { buildRoutes } from "../routes/utils";
import { isServerSideFetcher } from "../routes/interfaces";
import { enableStaticRendering } from "mobx-react";
import { serverContainerModule } from "./services";
import { identifiers } from "../container/constants";
import { serverIdentifiers } from "./services/constants";
import { ITTLCache } from "./services/TtlCacheService";

const isDevelopment = process.env.NODE_ENV === "development";

const port = 8080;
const app = express();

enableStaticRendering(true);

if (isDevelopment) {
	// configure devServer
	const compiler = webpack(serverConfig);
	app.use(webpackDevMiddleWare(compiler));
	// app.use(webpackHotMiddleware(compiler));
	app.use(express.static(path.resolve(path.join(__dirname, "..", "client"))));
}

const container = getContainer(startupOptions);
container.unbind(identifiers.IHttpService);
container.load(serverContainerModule);

app.get("*", async (req, res, next) => {
	const matches = matchRoutes(routes, req.url, startupOptions.basename);
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
			serverIdentifiers.ITTLCache,
		);
		cacheData = serialize(cacheService.getAll(), { isJSON: true });

		const identifiers = activeRoute.route.fetchData
			.map((identifier) => identifier.description || "")
			.filter((value) => value !== "");

		cacheData = serialize(
			{
				identifiers,
				data: cacheService.getAll(),
			},
			{ isJSON: true },
		);
	}

	const markup = ReactDomServer.renderToString(
		<ContainerProvider container={container}>
			<div className="App">
				<StaticRouter basename={startupOptions.basename} location={req.url}>
					{buildRoutes(routes)}
				</StaticRouter>
			</div>
		</ContainerProvider>,
	);

	const headTags = isDevelopment
		? `
		<script defer="defer" src="/client.app.js"></script>
		<script defer="defer" src="/client.runtime.js"></script>
	`
		: {};

	return res.send(`
		<!doctype html>
		<html>
			<head>
				<title>SSR App</title>
				${headTags}
			</head>
			<body>
				<div id="root">${markup}</div>
				<script type="text/ssr-fetch-cache">${cacheData}</script>
			</body>
		</html>
	`);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
