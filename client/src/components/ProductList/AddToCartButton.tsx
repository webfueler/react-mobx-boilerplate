import React from "react";
import type { ICartStore } from "../../lib/stores/CartStore";
import type { Product } from "../../lib/services/ProductService";
import { withModule } from "../../container/WithModule";
import { identifiers } from "../../container/constants";

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
