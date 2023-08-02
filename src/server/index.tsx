// Server
import express from "express";
import path from "node:path";
import webpackDevMiddleWare from "webpack-dev-middleware";
// import webpackHotMiddleware from "webpack-hot-middleware";
import { webpack } from "webpack";
import { serverConfig } from "../../webpack.config";

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

const isDevelopment = true;
const port = 8080;
const app = express();

if (isDevelopment) {
	// configure devServer
	const compiler = webpack(serverConfig);
	app.use(webpackDevMiddleWare(compiler));
	// app.use(webpackHotMiddleware(compiler));
	app.use(express.static(path.resolve(path.join(__dirname, "..", "client"))));
}

app.get("*", async (req, res, next) => {
	const matches = matchRoutes(routes, req.url, startupOptions.basename);
	const activeRoute = matches ? matches.pop() : null;

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
