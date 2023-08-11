import { action, makeObservable, observable } from "mobx";
import type { IProductService, Product } from "../services/ProductService";
import { inject, injectable } from "inversify";
import { identifiers } from "../../container/constants";
import { ServerSideFetcher } from "../../../../lib/src/router/interfaces";
import { ErrorHandling } from "../../shared/utilities/ErrorHandling";

interface IProductStore {
	products: Product[] | null;
	loading: boolean;
	error?: Error;
	loadProducts: () => Promise<Product[]>;
	loadProduct: (options: { id: number }) => Promise<Product | undefined>;
}

@injectable()
class ProductStore implements IProductStore, ServerSideFetcher {
	@observable products: Product[] = [];
	@observable product: Product | undefined;
	@observable loading = false;
	@observable error?: Error;

	constructor(
		@inject(identifiers.IProductService)
		private readonly productService: IProductService,
	) {
		makeObservable(this);
	}

	@action
	public async serverSideFetch(): Promise<unknown> {
		const products = await this.loadProducts();
		return products;
	}

	@action
	loadProducts(): Promise<Product[]> {
		this.setError(undefined);
		this.setLoading(true);

		let data: Promise<Product[]>;

		try {
			data = this.productService
				.fetchAll()
				.then((products) => {
					this.setProducts(products);
					return products;
				})
				.catch((error) => {
					this.setError(ErrorHandling.parseError(error));
					return [];
				})
				.finally(() => {
					this.setLoading(false);
				});
		} catch (error) {
			data = Promise.resolve([]);
			this.setError(ErrorHandling.parseError(error));
		}

		return data;
	}

	@action
	loadProduct({ id }: { id: number }): Promise<Product | undefined> {
		this.setError(undefined);
		this.setLoading(true);

		let data: Promise<Product | undefined>;

		try {
			data = this.productService
				.fetchOne(id)
				.then((product) => {
					this.setProduct(product);
					return product;
				})
				.finally(() => {
					this.setLoading(false);
				});
		} catch (error) {
			data = Promise.resolve(undefined);
			this.setError(ErrorHandling.parseError(error));
		}

		return data;
	}

	@action
	setError(error?: Error): void {
		this.error = error;
	}

	@action
	setProducts(products: Product[]): void {
		this.products = products;
	}

	@action
	setProduct(product?: Product): void {
		this.product = product;
	}

	@action
	setLoading(value: boolean): void {
		this.loading = value;
	}
}

export { ProductStore };
export type { IProductStore };
