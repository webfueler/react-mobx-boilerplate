import { ContainerModule } from "inversify";
import { identifiers } from "./constants";
import {
	type ILoggerService,
	type IProductService,
	type IUserService,
	LoggerService,
	ProductService,
	UserService,
} from "../lib/services";
import {
	type ICartStore,
	type IProductStore,
	type IUserStore,
	CartStore,
	ProductStore,
	UserStore,
} from "../lib/stores";

const appModule = new ContainerModule((bind) => {
	bind<IUserService>(identifiers.IUserService).to(UserService);
	bind<IProductService>(identifiers.IProductService).to(ProductService);
	bind<ILoggerService>(identifiers.ILoggerService).to(LoggerService);
	bind<ICartStore>(identifiers.ICartStore).to(CartStore);
	bind<IProductStore>(identifiers.IProductStore).to(ProductStore);
	bind<IUserStore>(identifiers.IUserStore).to(UserStore);
});

export { appModule };
