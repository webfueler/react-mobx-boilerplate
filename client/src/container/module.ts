import { ContainerModule } from "inversify";
import { identifiers } from "./constants";
import {
	type IUserService,
	type IUserStore,
	UserService,
	UserStore,
} from "../users";
import {
	type IProductService,
	type IProductStore,
	ProductService,
	ProductStore,
} from "../products";
import { CartStore, type ICartStore } from "../cart";

const appModule = new ContainerModule((bind) => {
	bind<IUserService>(identifiers.IUserService).to(UserService);
	bind<IProductService>(identifiers.IProductService).to(ProductService);
	bind<ICartStore>(identifiers.ICartStore).to(CartStore);
	bind<IProductStore>(identifiers.IProductStore).to(ProductStore);
	bind<IUserStore>(identifiers.IUserStore).to(UserStore);
});

export { appModule };
