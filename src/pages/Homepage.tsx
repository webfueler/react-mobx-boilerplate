import React, { useEffect } from "react";
import type { IProductStore } from "../lib/stores/ProductStore";
import { ProductList } from "../components/ProductList";
import { withModule } from "../container/WithModule";
import { identifiers } from "../container/constants";

type Modules = {
	productStore: IProductStore;
};

type Props = Modules;

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

const Homepage = withModule<Modules>({
	productStore: identifiers.IProductStore,
})(HomepageComponent);

export { Homepage };
