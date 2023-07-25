import "./index.scss";

import React from "react";
import type { Product } from "../../lib/services/ProductService";
import type { ICartStore } from "../../lib/stores/CartStore";
import { withModule } from "../../container/hoc/WithModule";

type Props = {
	products: Product[];
	cartStore: ICartStore;
} & React.HTMLAttributes<HTMLUListElement>;

const ProductListComponent = ({
	products,
	cartStore,
	className,
	...nativeProps
}: Props): React.ReactElement => {
	const { productIds } = cartStore;

	return (
		<ul className={`product-list ${className}`} {...nativeProps}>
			{products?.map((product) => (
				<li key={product.id} className="product-list__item">
					<h3 className="product-list__item-name">{product.title}</h3>
					<img
						className="product-list__item-image"
						src={product.image}
						alt={product.title}
					/>
					<p className="product-list__item-description">
						{product.description}
					</p>
					<p className="product-list__item-price">
						${product.price.toFixed(2)}
					</p>
					<button
						type="button"
						onClick={(): void => {
							cartStore.add(product.id);
						}}
						disabled={productIds.includes(product.id)}
					>
						Add to cart
					</button>
				</li>
			))}
		</ul>
	);
};

const ProductList = withModule(["cartStore"])(ProductListComponent);

export { ProductList };
