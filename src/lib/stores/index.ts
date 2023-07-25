import { UserStore, IUserStore } from "./UserStore";
import type { ServiceModules } from "../services";
import { ProductStore, type IProductStore } from "./ProductStore";
import { CartStore, type ICartStore } from "./CartStore";

type StoreModules = {
	userStore: IUserStore;
	productStore: IProductStore;
	cartStore: ICartStore;
};

type GetStores = (services: Partial<ServiceModules>) => StoreModules;

const getStoreModules: GetStores = ({
	userService,
	productService,
}): StoreModules => {
	if (!userService || !productService) {
		throw new Error("Missing services");
	}

	return {
		userStore: new UserStore(userService),
		productStore: new ProductStore(productService),
		cartStore: new CartStore(productService),
	};
};

export { getStoreModules };
export type { StoreModules };
