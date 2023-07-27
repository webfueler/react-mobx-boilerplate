import * as React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useInjection } from "../container";
import type { IStartupOptions } from "../config";
import { identifiers } from "../container/constants";
import { routes } from "./routes";

const AppRouter = (): React.ReactElement => {
	const startupOptions = useInjection<IStartupOptions>(
		identifiers.IStartupOptions,
	);

	const router = createBrowserRouter(routes, {
		basename: startupOptions.basename,
	});

	return <RouterProvider router={router} />;
};

export { AppRouter };
