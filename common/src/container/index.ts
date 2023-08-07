import { ContainerModule } from "inversify";
import {
	ClientHttpService,
	ServerHttpService,
	type IHttpService,
} from "../services/HttpService";
import { identifiers } from "./constants";
import { type ITTLCache, TTLCache } from "../services";

const clientModule = new ContainerModule((bind) => {
	bind<IHttpService>(identifiers.IHttpService).to(ClientHttpService);
});

const serverModule = new ContainerModule((bind) => {
	bind<IHttpService>(identifiers.IHttpService)
		.to(ServerHttpService)
		.inSingletonScope();
	bind<ITTLCache<Record<string, unknown>>>(identifiers.ITTLCache)
		.to(TTLCache)
		.inSingletonScope();
});

export { serverModule, clientModule };
