import React from "react";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "../../services";

type Props = {
	products: Product[];
} & React.HTMLAttributes<HTMLUListElement>;

const ProductList = ({
	products,
	className,
	...nativeProps
}: Props): React.ReactElement => {
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
					<AddToCartButton product={product} />
				</li>
			))}
		</ul>
	);
};

export { ProductList };
