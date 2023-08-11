import React from "react";
import type { IProductStore } from "../stores/ProductStore";
import { ProductList } from "../components/ProductList";
import { withModule } from "../../../../lib/src/container/WithModule";
import { identifiers } from "../../container/constants";
import { Head } from "../../../../lib/src/components/Head";

type Modules = {
	productStore: IProductStore;
};

type Props = Modules;

const ProductPageComponent = ({ productStore }: Props): React.ReactElement => {
	const { error, loading, products } = productStore;

	return (
		<>
			<Head>
				<title>
					Welcome to Mobx React boilerplate with Server Side Rendering
				</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
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
		</>
	);
};

const ProductPage = withModule<Modules>({
	productStore: identifiers.IProductStore,
})(ProductPageComponent);

export { ProductPage };
