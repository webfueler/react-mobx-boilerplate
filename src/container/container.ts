import { getServiceModules, type ServiceModules } from "../lib/services";
import { getStoreModules, type StoreModules } from "../lib/stores";
import { getConfigModules, type ConfigModules } from "../lib/config";
import type { IStartupOptions } from "../lib/config/StartupOptions";

type ContainerModules = ServiceModules & StoreModules & ConfigModules;

const getContainerModules = (options: IStartupOptions): ContainerModules => {
	const services = getServiceModules();
	const stores = getStoreModules({
		userService: services.userService,
		productService: services.productService,
	});
	const configs = getConfigModules(options);

	return {
		...stores,
		...services,
		...configs,
	};
};

export { getContainerModules };
export type { ContainerModules };
