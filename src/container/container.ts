import type { IStartupOptions } from "../config";
import { servicesContainerModule } from "../lib/services";
import { storesContainerModule } from "../lib/stores";
import { Container, interfaces } from "inversify";
import { identifiers } from "./constants";

const getContainer = (options: IStartupOptions): interfaces.Container => {
	const container = new Container({ defaultScope: "Singleton" });
	container.load(storesContainerModule, servicesContainerModule);
	container
		.bind<IStartupOptions>(identifiers.IStartupOptions)
		.toConstantValue(options);
	return container;
};
export { getContainer };
