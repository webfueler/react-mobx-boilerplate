import "reflect-metadata";
// Server
import express from "express";
import path from "node:path";
import webpackDevMiddleWare from "webpack-dev-middleware";
// import webpackHotMiddleware from "webpack-hot-middleware";
import { webpack } from "webpack";
import serverConfig from "../webpack.config";

// Application
import React from "react";
import { appModule } from "../../client/src/container";
import { App } from "../../client/src/App";
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

const { renderer } = bootstrapServer({
	app: <App />,
	isDevelopment,
	module: appModule,
	// move to environment / other
	startupOptions: {
		basename: "/",
		rootElement: "#root",
	},
});

app.get("*", async (req, res) => {
	const response = await renderer(req.url);

	res.send(response);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
