import "ignore-styles";
import register from "@babel/register";

register({
	ignore: [/(node_modules)/],
	presets: [
		"@babel/preset-env",
		"@babel/preset-react",
		"@babel/preset-typescript",
	],
	plugins: [
		"babel-plugin-transform-typescript-metadata",
		[
			"@babel/plugin-proposal-decorators",
			{
				legacy: true,
			},
		],
	],
});

import express from "express";
import path from "node:path";
import fs from "node:fs";

import "reflect-metadata";
import React from "react";
import ReactDomServer from "react-dom/server";
import {
	StaticHandlerContext,
	StaticRouterProvider,
	createStaticHandler,
	createStaticRouter,
} from "react-router-dom/server";

import { ContainerProvider, getContainer } from "../container";
import { startupOptions } from "../config";
import { routes } from "../routes/routes";
import { createFetchRequest } from "./create-fetch-request";

const port = 8080;

const handler = createStaticHandler(routes, {
	basename: startupOptions.basename,
});

const app = express();

const isStaticHandlerContext = (
	value: StaticHandlerContext | Response,
): value is StaticHandlerContext => "loaderData" in value;

app.use("^/$", async (req, res, next) => {
	fs.readFile(
		path.resolve(path.join(__dirname, "../../dist/index.html")),
		"utf8",
		async (err, data) => {
			if (err) {
				console.log(err);
				return res.status(500).send("Error");
			}

			const fetchRequest = createFetchRequest(req);
			const context = await handler.query(fetchRequest);

			if (!isStaticHandlerContext(context)) {
				return res.status(500).send("Not the correct type");
			}

			const router = createStaticRouter(handler.dataRoutes, context);

			return res.send(
				data.replace(
					'<div id="root"></div>',
					`<div id="root">${ReactDomServer.renderToString(
						<ContainerProvider container={getContainer(startupOptions)}>
							<div className="App">
								<StaticRouterProvider router={router} context={context} />
							</div>
						</ContainerProvider>,
					)}</div>`,
				),
			);
		},
	);
});

app.use(express.static(path.resolve(path.join(__dirname, "../../dist"))));

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
