import React from "react";
import type { ICartStore } from "../../../cart";
import type { Product } from "../../services";
import { withModule } from "../../../../../lib/src/container/WithModule";
import { identifiers } from "../../../container";

type Modules = {
	cartStore: ICartStore;
};

type Props = {
	product: Product;
} & Modules;

const AddToCartButtonComponent = ({
	cartStore,
	product,
}: Props): React.ReactElement => (
	<button
		type="button"
		onClick={(): void => {
			cartStore.add(product.id);
		}}
		disabled={cartStore.productIds.includes(product.id)}
	>
		Add to cart
	</button>
);

const AddToCartButton = withModule<Modules>({
	cartStore: identifiers.ICartStore,
})(AddToCartButtonComponent);
export { AddToCartButton };
