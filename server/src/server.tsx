import "reflect-metadata";
// Server
import express from "express";
import path from "node:path";
import fs from "node:fs";
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

const scripts: string[] = [];
const css: string[] = [];

if (isDevelopment) {
	// configure devServer
	const compiler = webpack(serverConfig);
	app.use(webpackDevMiddleWare(compiler));
	// app.use(webpackHotMiddleware(compiler));
}

let manifest: Record<string, string> = {};

try {
	const fileContents = fs
		.readFileSync(
			path.resolve(path.join(__dirname, "../client/assets-manifest.json")),
		)
		.toString();
	manifest = JSON.parse(fileContents);
} catch (error) {
	throw new Error(error instanceof Error ? error.message : String(error));
}

// grab scripts and css
for (const file of Object.keys(manifest)) {
	if (file.endsWith(".js")) {
		scripts.push(manifest[file]);
	}
	if (file.endsWith(".css")) {
		css.push(manifest[file]);
	}
}

const { renderer } = bootstrapServer({
	app: <App />,
	isDevelopment,
	module: appModule,
	scripts,
	css,
	// move to environment / other
	startupOptions: {
		basename: "/",
		rootElement: "#root",
	},
});

app.use(express.static(path.resolve(path.join(__dirname, "..", "client"))));

app.get("*", async (req, res) => {
	const { status, html } = await renderer(req.url);

	res.status(status).send(html);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
