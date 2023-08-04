import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useInjection } from "../container";
import { identifiers } from "../../../common/src/container/constants";
import { routes } from "./routes";
import { buildRoutes } from "./utils";
import { IStartupOptions } from "../../../common/src/interfaces";

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
