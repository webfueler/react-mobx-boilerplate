import React, { useContext, useEffect } from "react";
import { Outlet, matchRoutes, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { ContainerProviderContext, useInjection } from "../container";
import { identifiers } from "../container/constants";
import { routes } from "../routes/routes";
import { IStartupOptions } from "../config";
import { isServerSideFetcher } from "../routes/interfaces";

const Default = (): React.ReactElement => {
	const startupOptions = useInjection<IStartupOptions>(
		identifiers.IStartupOptions,
	);
	const { container } = useContext(ContainerProviderContext);
	const location = useLocation();

	useEffect(() => {
		const matches = matchRoutes(
			routes,
			window.location.href.replace(window.location.origin, ""),
			startupOptions.basename,
		);
		const activeRoute = matches ? matches.pop() : null;
		if (activeRoute && activeRoute.route.fetchData && container) {
			for (const identifier of activeRoute.route.fetchData) {
				const store = container.get(identifier);
				if (isServerSideFetcher(store)) {
					store.serverSideFetch(activeRoute);
				}
			}
		}
	}, [location, container, startupOptions.basename]);

	return (
		<>
			<Header />
			<main className="main">
				<Outlet />
			</main>
		</>
	);
};

export { Default };
