import "reflect-metadata";
import React from "react";
import { buildRoutes } from "../../client/src/routes/utils";
import { routes } from "../../client/src/routes/routes";
import { interfaces } from "inversify";
import { ContainerProvider } from "../../client/src/container";
import { StaticRouter } from "react-router-dom/server";
import { IStartupOptions } from "../../common/src/interfaces";
import { identifiers } from "../../common/src/container/constants";
import { enableStaticRendering } from "mobx-react";

enableStaticRendering(true);

type AppProps = {
	container: interfaces.Container;
	requestUrl: string;
};

export const App = ({
	container,
	requestUrl,
}: AppProps): React.ReactElement => {
	const startupOptions = container.get<IStartupOptions>(
		identifiers.IStartupOptions,
	);

	return (
		<ContainerProvider container={container}>
			<div className="App">
				<StaticRouter basename={startupOptions.basename} location={requestUrl}>
					{buildRoutes(routes)}
				</StaticRouter>
			</div>
		</ContainerProvider>
	);
};
