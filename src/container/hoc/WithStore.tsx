import { observer } from "mobx-react";
import React, { ComponentType } from "react";
import { useModule } from "..";
import type { StoreModules } from "../../lib/stores";

/**
 * POC: Higher order component to inject directly store props
 * @param storeKey
 * @param storeProps
 * @returns
 */
const withStore = <StoreKey extends keyof StoreModules>(
	storeKey: StoreKey,
	storeProps: Array<keyof StoreModules[StoreKey]>,
): (<P, _>(
	Component: ComponentType<P>,
) => React.FC<Omit<P, (typeof storeProps)[number]>>) => {
	type TInjectedPropsKeys = (typeof storeProps)[number];

	return <P,>(
		Component: ComponentType<P>,
	): React.FC<Omit<P, TInjectedPropsKeys>> => {
		const WrapperComponent: React.FC<Omit<P, TInjectedPropsKeys>> = (props) => {
			const modules = useModule();
			const store = modules[storeKey];

			const injectedProps = {};
			for (const key of storeProps) {
				Object.assign(injectedProps, { [key]: store[key] });
			}
			const ObservedComponent = observer(Component);
			return <ObservedComponent {...(props as P)} {...injectedProps} />;
		};

		const displayName = Component.displayName || Component.name || "Component";
		WrapperComponent.displayName = `withStore(${displayName})`;

		return WrapperComponent;
	};
};

export { withStore };
