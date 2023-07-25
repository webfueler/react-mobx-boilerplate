import { ErrorHandling } from "../../utilities/ErrorHandling";
import type { Product } from "./interfaces";

interface IProductService {
	fetchAll: (options?: {
		limit?: number;
		sort?: "asc" | "desc";
	}) => Promise<Product[]>;
	fetchOne: (id: number) => Promise<Product>;
}

class ProductService implements IProductService {
	fetchAll({ limit = 20, sort = "desc" } = {}): Promise<Product[]> {
		console.time("API response time");

		const data = fetch(
			`https://fakestoreapi.com/products/?limit=${limit}&sort=${sort}`,
		)
			.then((response) => {
				console.timeEnd("API response time");
				return response.json();
			})
			.then((products: Product[]) => products)
			.catch((error) => {
				throw ErrorHandling.parseError(error);
			});

		return data;
	}

	fetchOne(id: number): Promise<Product> {
		console.time("API response time");
		const data = fetch(`https://fakestoreapi.com/products/${id}`)
			.then((response) => {
				console.timeEnd("API response time");
				return response.json();
			})
			.then((product: Product) => product)
			.catch((error) => {
				throw new Error(error);
			});

		return data;
	}
}

export { ProductService };
export type { IProductService };
