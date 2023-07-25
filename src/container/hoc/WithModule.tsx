import { observer } from "mobx-react";
import React, { ComponentType } from "react";
import { ContainerModules, useModule } from "..";

/**
 * Higher Order Component to inject modules as props into components
 * @param modulesToInject - array of module keys to inject
 * @param hasStores - when `true` will add `observer` mobx hoc
 * @returns
 */
const withModule = (
	modulesToInject: Array<keyof ContainerModules>,
	hasStores = true,
): (<P, _>(
	Component: ComponentType<P>,
) => React.FC<Omit<P, (typeof modulesToInject)[number]>>) => {
	type TInjectedPropsKeys = (typeof modulesToInject)[number];

	return <P,>(
		Component: ComponentType<P>,
	): React.FC<Omit<P, TInjectedPropsKeys>> => {
		const WrapperComponent: React.FC<Omit<P, TInjectedPropsKeys>> = (props) => {
			const modules = useModule();

			const injectedProps: Partial<ContainerModules> = {};
			for (const key of modulesToInject) {
				Object.assign(injectedProps, { [key]: modules[key] });
			}

			const ObservedComponent = observer(Component);
			return hasStores ? (
				<ObservedComponent {...(props as P)} {...injectedProps} />
			) : (
				<Component {...(props as P)} {...injectedProps} />
			);
		};

		const displayName = Component.displayName || Component.name || "Component";
		WrapperComponent.displayName = `injectModule(${displayName})`;

		return WrapperComponent;
	};
};

export { withModule };
