import "./index.scss";
import "reflect-metadata";

import React from "react";
import { bootstrapClient } from "../../lib/src/bootstrapClient";
import { appModule } from "./container";
import { App } from "./App";

bootstrapClient({
	app: <App />,
	module: appModule,
});
