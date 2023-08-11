import React, { useContext, useEffect, useRef } from "react";
import { interfaces } from "inversify";
import {
	ContainerProvider,
	ContainerProviderContext,
} from "../container/ContainerProvider";
import { BrowserRouter, matchRoutes, useLocation } from "react-router-dom";
import type { IStartupOptions } from "../interfaces";
import { identifiers } from "../container/constants";
import { useInjection } from "../container/UseInjection";
import { routes } from "../../../client/src/routes/routes";
import { isServerSideFetcher } from "../router/interfaces";

type ClientRootProps = {
	container: interfaces.Container;
	app: React.ReactNode;
};

const ServerSideFetcher = ({
	app,
}: {
	app: React.ReactNode;
}): React.ReactNode => {
	const startupOptions = useInjection<IStartupOptions>(
		identifiers.IStartupOptions,
	);
	const { container } = useContext(ContainerProviderContext);
	const location = useLocation();
	const firstLoad = useRef(true);

	useEffect(() => {
		const matches = matchRoutes(
			routes,
			window.location.href.replace(window.location.origin, ""),
			startupOptions.basename,
		);
		const activeRoute = matches ? matches.pop() : null;
		if (
			!firstLoad.current &&
			activeRoute &&
			activeRoute.route.fetchData &&
			container
		) {
			for (const identifier of activeRoute.route.fetchData) {
				const store = container.get(identifier);
				if (isServerSideFetcher(store)) {
					store.serverSideFetch(activeRoute);
				}
			}
		} else {
			firstLoad.current = false;
		}
	}, [location, container, startupOptions.basename]);

	useEffect(() => {
		return () => {
			firstLoad.current = true;
		};
	}, []);

	return app;
};

const ClientRoot = ({ container, app }: ClientRootProps): React.ReactNode => {
	const startupOptions = container.get<IStartupOptions>(
		identifiers.IStartupOptions,
	);

	return (
		<React.StrictMode>
			<ContainerProvider container={container}>
				<BrowserRouter basename={startupOptions.basename}>
					<ServerSideFetcher app={app} />
				</BrowserRouter>
			</ContainerProvider>
		</React.StrictMode>
	);
};

export { ClientRoot };
