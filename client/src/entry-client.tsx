import "./index.scss";
import "reflect-metadata";
import React from "react";
import { AppRouter } from "./routes/Router";
import { interfaces } from "inversify";
import { ContainerProvider } from "./container/ContainerProvider";
import { container } from "./container";
import { bootstrapClient } from "../../common/src/bootstrapClient";

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

bootstrapClient(container, <App container={container} />);
