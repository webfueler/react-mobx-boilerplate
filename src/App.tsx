import React, { useEffect } from "react";
import { AppRouter } from "./routes/Router";
import { interfaces } from "inversify";
import { ContainerProvider } from "./container/ContainerProvider";
import { matchRoutes, useLocation } from "react-router-dom";
import { routes } from "./routes/routes";
import { startupOptions } from "./config";
import { InitialState } from "./entry-client";
import { isServerSideFetcher } from "./routes/interfaces";

type AppProps = {
	container: interfaces.Container;
};

const App = ({ container }: AppProps): React.ReactElement => {
	return (
		<React.StrictMode>
			<ContainerProvider container={container}>
				<div className="App">
					<AppRouter />
				</div>
			</ContainerProvider>
		</React.StrictMode>
	);
};

export { App };
