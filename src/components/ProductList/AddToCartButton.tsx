import React from "react";
import type { ICartStore } from "../../lib/stores/CartStore";
import type { Product } from "../../lib/services/ProductService";
import { withModule } from "../../container/hoc/WithModule";

type Props = {
	cartStore: ICartStore;
	product: Product;
};

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

const AddToCartButton = withModule(["cartStore"])(AddToCartButtonComponent);
export { AddToCartButton };
