import React, { useContext, ComponentType, useEffect } from "react";
import { ContainerProviderContext } from "./ContainerProvider";
import { matchRoutes, useLocation } from "react-router-dom";
import { useInjection } from "./UseInjection";
import { IStartupOptions } from "../../../common/src/interfaces";
import { identifiers } from "../../../common/src/container/constants";
import { routes } from "../routes/routes";
import { isServerSideFetcher } from "../routes/interfaces";

const withFetcher = (): (<P extends React.JSX.IntrinsicAttributes>(
	Component: ComponentType<P>,
) => ComponentType<P>) => {
	return <P extends React.JSX.IntrinsicAttributes>(
		Component: ComponentType<P>,
	): ComponentType<P> => {
		const WrapperComponent = (props: P): JSX.Element => {
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

			return <Component {...props} />;
		};

		const displayName = Component.displayName || Component.name || "Component";
		WrapperComponent.displayName = `withFetcher(${displayName})`;

		return WrapperComponent;
	};
};

export { withFetcher };
