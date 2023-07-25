import * as React from "react";
import type { ContainerModules } from "./container";

type ModuleProviderContextProps = Partial<ContainerModules>;

const ModuleProviderContext = React.createContext<ModuleProviderContextProps>(
	{},
);

const ModuleProvider = ({
	children,
	...modules
}: React.PropsWithChildren<ContainerModules>): React.ReactElement => {
	return (
		<ModuleProviderContext.Provider value={modules}>
			{children}
		</ModuleProviderContext.Provider>
	);
};

// TODO: need a scalable way to deal with this
const isProvidedModules = (
	value: Partial<ContainerModules>,
): value is ContainerModules => {
	return (
		value.startupOptions !== undefined &&
		value.productService !== undefined &&
		value.productStore !== undefined &&
		value.userService !== undefined &&
		value.userStore !== undefined
	);
};

const useModule = (): ContainerModules => {
	const modules = React.useContext(ModuleProviderContext);

	if (!isProvidedModules(modules))
		throw new Error("Missing modules in 'ModuleProvider'");

	return {
		...modules,
	};
};

export { ModuleProvider, useModule };
