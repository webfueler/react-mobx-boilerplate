import React from "react";
import { ContainerProviderContext } from "./context";
import { ContainerProviderContextProps } from "./interfaces";

const ContainerProvider = (
	props: React.PropsWithChildren<ContainerProviderContextProps>,
): React.ReactElement => {
	const { children, container } = props;
	return (
		<ContainerProviderContext.Provider value={{ container }}>
			{children}
		</ContainerProviderContext.Provider>
	);
};

export { ContainerProvider };
