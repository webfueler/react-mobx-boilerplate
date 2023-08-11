import React from "react";
import { withModule } from "../../../../lib/src/container/WithModule";
import { ProductList } from "../../products/components/ProductList";
import { ICartStore } from "../../cart";
import { identifiers } from "../../container/constants";

type Modules = {
	cartStore: ICartStore;
};

type Props = Modules;

const CartPageComponent = ({ cartStore }: Props): React.ReactElement => {
	const { products } = cartStore;

	return (
		<div className="cart-page">
			{products && <ProductList products={products} />}
		</div>
	);
};

const CartPage = withModule<Modules>({ cartStore: identifiers.ICartStore })(
	CartPageComponent,
);

export { CartPage };
