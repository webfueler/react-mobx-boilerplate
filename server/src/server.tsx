// Server
import express from "express";
import path from "node:path";
import webpackDevMiddleWare from "webpack-dev-middleware";
// import webpackHotMiddleware from "webpack-hot-middleware";
import { webpack } from "webpack";
import serverConfig from "../webpack.config";

// Application
import React from "react";
import { App } from "./entry-server";
import { container } from "../../client/src/container";
import { bootstrapServer } from "../../common/src/BootstrapServer";

const isDevelopment = process.env.NODE_ENV === "development";

const port = 8080;
const app = express();

if (isDevelopment) {
	// configure devServer
	const compiler = webpack(serverConfig);
	app.use(webpackDevMiddleWare(compiler));
	// app.use(webpackHotMiddleware(compiler));
	app.use(express.static(path.resolve(path.join(__dirname, "..", "client"))));
}

const { renderer } = bootstrapServer(container, isDevelopment);

app.get("*", async (req, res) => {
	const response = await renderer(
		<App container={container} requestUrl={req.url} />,
		req.url,
	);

	res.send(response);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
