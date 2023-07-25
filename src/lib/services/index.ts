import { type IUserService, UserService } from "./UserService";
import { ProductService, type IProductService } from "./ProductService";
import { type ILoggerService, LoggerService } from "./LoggerService";

type ServiceModules = {
	userService: IUserService;
	productService: IProductService;
	loggerService: ILoggerService;
};

const getServiceModules = (): ServiceModules => {
	return {
		userService: new UserService(),
		productService: new ProductService(),
		loggerService: new LoggerService(),
	};
};

export { getServiceModules };
export type { ServiceModules };
