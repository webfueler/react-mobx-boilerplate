import { type IUserService, UserService } from "./UserService";
import { ProductService, type IProductService } from "./ProductService";
import { type ILoggerService, LoggerService } from "./LoggerService";
import { ContainerModule } from "inversify";
import { servicesIdentifiers } from "./constants";

const servicesContainerModule = new ContainerModule((bind) => {
	bind<IUserService>(servicesIdentifiers.IUserService).to(UserService);
	bind<IProductService>(servicesIdentifiers.IProductService).to(ProductService);
	bind<ILoggerService>(servicesIdentifiers.ILoggerService).to(LoggerService);
});

export { servicesContainerModule };
