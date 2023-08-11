import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from "mobx";
import {
	type IProductService,
	Product,
} from "../../products/services/ProductService";
import { inject, injectable } from "inversify";
import { identifiers } from "../../container/constants";

interface ICartStore {
	add(id: number): Promise<Product[]>;
	remove(id: number): Product[];
	products: Product[];
	productIds: number[];
	total: number;
}

@injectable()
class CartStore implements ICartStore {
	@observable products: Product[] = [];

	constructor(
		@inject(identifiers.IProductService)
		private readonly productService: IProductService,
	) {
		makeObservable(this);
	}

	@computed
	public get total(): number {
		return this.products.reduce((acc, product) => acc + product.price, 0);
	}

	@computed
	public get productIds(): number[] {
		const ids: number[] = [];
		for (const product of this.products) {
			ids.push(product.id);
		}
		return ids;
	}

	@action
	public async add(id: number): Promise<Product[]> {
		const product = await this.productService.fetchOne(id);
		runInAction(() => {
			this.products.push(product);
		});
		return this.products;
	}

	@action
	public remove(id: number): Product[] {
		this.products = this.products.filter((prod) => prod.id !== id);
		return this.products;
	}
}

export { CartStore };
export type { ICartStore };
