import React, { useEffect } from "react";
import type { IProductStore } from "../lib/stores/ProductStore";
import { withModule } from "../container/hoc/WithModule";
import { ProductList } from "../components/ProductList";

type Props = {
	productStore: IProductStore;
};

const HomepageComponent = ({ productStore }: Props): React.ReactElement => {
	const { error, loading, products } = productStore;

	// can't use destructuring to call loadProducts
	// probably mobx limitation / needs investigation
	useEffect(() => {
		productStore.loadProducts();
	}, [productStore]);

	return (
		<div className="product-page">
			{error && (
				<div className="alert">
					<h2>{error.message}</h2>
					<p>{error.stack}</p>
				</div>
			)}
			{products && (
				<ProductList
					className={`${loading ? "is-loading" : ""}`}
					products={products}
				/>
			)}
		</div>
	);
};

const Homepage = withModule(["productStore"])(HomepageComponent);

export { Homepage };
