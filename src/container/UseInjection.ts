import { useContext } from "react";
import { interfaces } from "inversify";
import { ContainerProviderContext } from "./ContainerProvider/context";

const useInjection = <T>(identifier: interfaces.ServiceIdentifier<T>): T => {
	const { container } = useContext(ContainerProviderContext);
	if (!container) {
		throw new Error("container not found");
	}
	return container.get<T>(identifier);
};

export { useInjection };
