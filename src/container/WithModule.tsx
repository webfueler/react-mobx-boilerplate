import { interfaces } from "inversify";
import React, { useContext, ComponentType } from "react";
import { ContainerProviderContext } from "./ContainerProvider";
import { observer } from "mobx-react";

type TIdentifiers<K> = {
	[Property in keyof K]: interfaces.ServiceIdentifier<unknown>;
};

const withModule = <TInjectedProps,>(
	mappedIdentifiers: TIdentifiers<TInjectedProps>,
	hasStores = true,
): (<P, _>(
	Component: ComponentType<P>,
) => React.FC<Omit<P, keyof TInjectedProps>>) => {
	type TInjectedPropsKeys = keyof TInjectedProps;
	type TProp = {
		[P in TInjectedPropsKeys]: unknown;
	};

	return <P,>(
		Component: ComponentType<P>,
	): React.FC<Omit<P, TInjectedPropsKeys>> => {
		const WrapperComponent: React.FC<Omit<P, TInjectedPropsKeys>> = (props) => {
			const { container } = useContext(ContainerProviderContext);

			if (!container) {
				throw new Error("Container not found!");
			}

			const injectedProps = {} as TProp;
			for (const key of Object.keys(mappedIdentifiers)) {
				const propToInject = key as TInjectedPropsKeys;
				injectedProps[propToInject] = container.get(
					mappedIdentifiers[propToInject],
				);
			}

			const ObservedComponent = observer(Component);
			return hasStores ? (
				<ObservedComponent {...(props as P)} {...injectedProps} />
			) : (
				<Component {...(props as P)} {...injectedProps} />
			);
		};

		const displayName = Component.displayName || Component.name || "Component";
		WrapperComponent.displayName = `withModule(${displayName})`;

		return WrapperComponent;
	};
};

export { withModule };
