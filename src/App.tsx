import * as React from "react";
import { AppRouter } from "./routes/Router";
import { interfaces } from "inversify";
import { ContainerProvider } from "./container/ContainerProvider";

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
