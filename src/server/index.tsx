import "reflect-metadata";
import express from "express";
import path from "node:path";
import webpackDevMiddleWare from "webpack-dev-middleware";

import React from "react";
import ReactDomServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchRoutes } from "react-router-dom";
import { routes } from "../routes/routes";

import { ContainerProvider, getContainer } from "../container";
import { startupOptions } from "../config";
import { buildRoutes } from "../routes/utils";
import { webpack } from "webpack";
import { serverConfig } from "../../webpack.config";

const isDevelopment = process.env.NODE_ENV === "development";

const port = 8080;
const compiler = webpack(serverConfig);
const app = express();

app.use(express.static(path.resolve("dist")));

app.use(
	webpackDevMiddleWare(compiler, {
		index: "/",
	}),
);

app.get("*", async (req, res, next) => {
	const matches = matchRoutes(routes, req.url, startupOptions.basename);
	const activeRoute = matches ? matches.pop() : null;
	console.log(activeRoute);

	const markup = ReactDomServer.renderToString(
		<ContainerProvider container={getContainer(startupOptions)}>
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
			</body>
		</html>
	`);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
