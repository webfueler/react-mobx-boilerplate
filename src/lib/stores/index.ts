import { UserStore, type IUserStore } from "./UserStore";
import { ProductStore, type IProductStore } from "./ProductStore";
import { CartStore, type ICartStore } from "./CartStore";
import { ContainerModule } from "inversify";
import { storesIdentifiers } from "./constants";

const storesContainerModule = new ContainerModule((bind) => {
	bind<ICartStore>(storesIdentifiers.ICartStore).to(CartStore);
	bind<IProductStore>(storesIdentifiers.IProductStore).to(ProductStore);
	bind<IUserStore>(storesIdentifiers.IUserStore).to(UserStore);
});

export { storesContainerModule };
