import React from "react";
import { withModule } from "../container/hoc/WithModule";
import { ProductList } from "../components/ProductList";
import { ICartStore } from "../lib/stores/CartStore";

type Props = {
	cartStore: ICartStore;
};

const CartPageComponent = ({ cartStore }: Props): React.ReactElement => {
	const { products } = cartStore;

	return (
		<div className="cart-page">
			{products && <ProductList products={products} />}
		</div>
	);
};

const CartPage = withModule(["cartStore"])(CartPageComponent);

export { CartPage };
