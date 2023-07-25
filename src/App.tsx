import * as React from "react";
import { ModuleProvider, type ContainerModules } from "./container";
import { AppRouter } from "./routes/Router";

type AppProps = {
	modules: ContainerModules;
};

const App = ({ modules }: AppProps): React.ReactElement => {
	return (
		<React.StrictMode>
			<ModuleProvider {...modules}>
				<div className="App">
					<AppRouter />
				</div>
			</ModuleProvider>
		</React.StrictMode>
	);
};

export { App };
