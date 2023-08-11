import "reflect-metadata";

import React from "react";
import { bootstrapServer } from "../../lib/src/BootstrapServer";
import { App } from "../../client/src/App";
import { appModule } from "../../client/src/container";
import { config } from "dotenv";
import { server } from "./server";

config();

const isDevelopment = process.env.NODE_ENV === "development";
const port = process.env.PORT || "8080";

const { renderer } = bootstrapServer({
	app: <App />,
	module: appModule,
	// move to environment / other
	startupOptions: {
		basename: "/",
		rootElement: "#root",
	},
});

server({
	isDevelopment,
	port: Number.parseInt(port),
	applicationRenderer: renderer,
}).serve();
