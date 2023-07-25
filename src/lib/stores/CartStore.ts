import { action, computed, makeObservable, observable } from "mobx";
import { IProductService, Product } from "../services/ProductService";

interface ICartStore {
	add(id: number): Promise<Product[]>;
	remove(id: number): Product[];
	products: Product[];
	productIds: number[];
	total: number;
}

class CartStore implements ICartStore {
	@observable products: Product[] = [];

	constructor(private productService: IProductService) {
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
		this.products.push(product);
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
