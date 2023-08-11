import React from "react";
import { interfaces } from "inversify";
import { ContainerProvider } from "../container/ContainerProvider";
import type { IStartupOptions } from "../interfaces";
import { identifiers } from "../container/constants";
import { StaticRouter } from "react-router-dom/server";
import { enableStaticRendering } from "mobx-react";

type ServerRootProps = {
	app: React.ReactNode;
	container: interfaces.Container;
	requestUrl: string;
};

enableStaticRendering(true);

const ServerRoot = ({
	app,
	container,
	requestUrl,
}: ServerRootProps): React.ReactNode => {
	const startupOptions = container.get<IStartupOptions>(
		identifiers.IStartupOptions,
	);

	return (
		<ContainerProvider container={container}>
			<StaticRouter basename={startupOptions.basename} location={requestUrl}>
				{app}
			</StaticRouter>
		</ContainerProvider>
	);
};

export { ServerRoot };
export type { ServerRootProps };
