import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { useInjection } from "../container";
import type { IStartupOptions } from "../config";
import { identifiers } from "../container/constants";
import { routes } from "./routes";
import { buildRoutes } from "./utils";

const AppRouter = (): React.ReactElement => {
	const startupOptions = useInjection<IStartupOptions>(
		identifiers.IStartupOptions,
	);

	return (
		<BrowserRouter basename={startupOptions.basename}>
			{buildRoutes(routes)}
		</BrowserRouter>
	);
};

export { AppRouter };
