import { inject, injectable } from "inversify";
import type { Product } from "./interfaces";
import { identifiers } from "../../../../../lib/src/container/constants";
import type { IHttpService } from "../../../../../lib/src/services";
import { ErrorHandling } from "../../../shared/utilities/ErrorHandling";

interface IProductService {
	fetchAll: (options?: {
		limit?: number;
		sort?: "asc" | "desc";
	}) => Promise<Product[]>;
	fetchOne: (id: number) => Promise<Product>;
}

@injectable()
class ProductService implements IProductService {
	constructor(
		@inject(identifiers.IHttpService)
		private readonly httpService: IHttpService,
	) {}

	fetchAll({ limit = 20, sort = "desc" } = {}): Promise<Product[]> {
		const data = this.httpService
			.get<Product[]>(
				`https://fakestoreapi.com/products/?limit=${limit}&sort=${sort}`,
			)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw ErrorHandling.parseError(error);
			});

		return data;
	}

	fetchOne(id: number): Promise<Product> {
		const data = fetch(`https://fakestoreapi.com/products/${id}`)
			.then((response) => {
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
